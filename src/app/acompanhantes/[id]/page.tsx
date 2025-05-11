"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation"; // Changed from react-router-dom
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { PhotoGallery } from "@/components/companion/PhotoGallery"; // Assuming adapted
import { Reviews } from "@/components/companion/Reviews"; // Assuming adapted
import { Availability } from "@/components/companion/Availability"; // Assuming adapted
import { PriceDisplay } from "@/components/companion/PriceDisplay"; // Assuming adapted
import { useToast } from "@/components/ui/use-toast";
import { Heart, MessageCircle, Star, MapPin, Shield, Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Define types for better code quality
interface CompanionProfileData {
  id: string;
  name: string;
  location: string;
  description: string;
  verified: boolean;
  premium: boolean;
  price_range: any; // Define more specific type if possible
  services?: string[];
  photos: any[]; // Define more specific type for photos
  reviews: any[]; // Define more specific type for reviews
  availability: any[]; // Define more specific type for availability
  // Add other fields as necessary
}

interface PageProps {
  params: { id: string };
}

export default function CompanionProfilePage({ params }: PageProps) {
  const { id } = params; // Get id from params
  const { user, toggleFavorite, setIsAuthOpen } = useAuth();
  // const { addToViewHistory } = useAuth(); // Assuming addToViewHistory is part of useAuth if needed
  const [companion, setCompanion] = useState<CompanionProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const fetchCompanion = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data: companionData, error: companionError } = await supabase
        .from("companions")
        .select("*, photos(*), reviews(*, users(name, premium)), availability(*)") // Simplified select
        .eq("id", id)
        .eq("verified", true) // Only show verified companions
        .eq("status", "approved") // Only show approved companions
        .single();

      if (companionError || !companionData) {
        if (companionError) console.error("Error fetching companion data:", companionError);
        toast({ title: "Erro", description: "Perfil não encontrado ou não disponível.", variant: "destructive" });
        router.push("/acompanhantes");
        return;
      }

      if (user) {
        const { data: favoriteData, error: favError } = await supabase
          .from("favorites")
          .select("id")
          .eq("companion_id", id)
          .eq("user_id", user.id)
          .single();
        if (favError && favError.code !== 'PGRST116') throw favError; // PGRST116: single row not found
        setIsFavorite(!!favoriteData);

        // Add to view history (example, actual implementation might differ)
        // if (addToViewHistory) await addToViewHistory(id);
      }
      
      // Increment view count (ensure this RPC exists and works)
      // Consider doing this server-side or with a more robust client-side approach to avoid race conditions/abuse
      try {
        await supabase.rpc("increment_views", { p_companion_id: id });
      } catch (rpcError) {
        console.warn("Could not increment views:", rpcError);
      }

      setCompanion(companionData as CompanionProfileData);
    } catch (error) {
      console.error("Error fetching companion details:", error);
      toast({ title: "Erro", description: "Não foi possível carregar o perfil.", variant: "destructive" });
      // router.push("/acompanhantes"); // Avoid navigation loop if error is persistent
    } finally {
      setLoading(false);
    }
  }, [id, user, router, toast, /*addToViewHistory*/]);

  useEffect(() => {
    fetchCompanion();
  }, [fetchCompanion]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({ title: "Login Necessário", description: "Faça login para adicionar aos favoritos.", variant: "default" });
      setIsAuthOpen(true);
      return;
    }
    if (toggleFavorite) {
        await toggleFavorite(id);
        setIsFavorite(!isFavorite);
        toast({
            title: !isFavorite ? "Adicionado aos Favoritos" : "Removido dos Favoritos",
        });
    }
  };

  const handleChat = () => {
    if (!user) {
      toast({ title: "Login Necessário", description: "Faça login para iniciar uma conversa.", variant: "default" });
      setIsAuthOpen(true);
      return;
    }
    router.push(`/chat/${id}`); // Example chat route
    toast({ title: "Chat", description: `Iniciando chat com ${companion?.name}.` });
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-64 md:h-96 bg-muted/50 rounded-2xl mb-8 shadow" />
          <div className="space-y-4 p-4">
            <div className="h-8 bg-muted/50 rounded w-1/3" />
            <div className="h-4 bg-muted/50 rounded w-1/4" />
            <div className="h-32 bg-muted/50 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="w-full text-center py-12">
        <h1 className="text-2xl font-bold text-destructive">Perfil não encontrado</h1>
        <p className="text-muted-foreground mb-4">O perfil que você está tentando acessar não existe ou não está mais disponível.</p>
        <Link href="/acompanhantes" passHref>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Acompanhantes
          </Button>
        </Link>
      </div>
    );
  }

  const primaryPhoto = companion.photos?.find(p => p.is_primary)?.url || companion.photos?.[0]?.url || "https://via.placeholder.com/600x800.png?text=Sem+Foto";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="mb-6">
        <Link href="/acompanhantes" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Lista
          </Button>
        </Link>
      </div>
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column: Photos and Actions */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-2xl overflow-hidden shadow-xl">
                <PhotoGallery 
                    photos={companion.photos || []} 
                    isPremium={user?.premium || false} // Pass user's premium status
                    companionPremium={companion.premium} // Pass companion's premium status
                />
            </div>
        </div>

        {/* Right Column: Info and Actions */}
        <div className="lg:col-span-1 space-y-6 md:space-y-8">
          <div className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">{companion.name}</h1>
                  {companion.verified && (
                    <Shield className="h-5 w-5 text-green-500" title="Perfil Verificado" />
                  )}
                  {companion.premium && (
                    <Crown className="h-5 w-5 text-yellow-500" title="Perfil Premium" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{companion.location}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-muted/50"
                onClick={handleFavoriteToggle}
                title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
              >
                <Heart className={`h-5 w-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </Button>
            </div>

            {/* Placeholder for Availability - to be refined */}
            {/* <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              <span>Disponível hoje (Exemplo)</span> 
            </div> */}

            <PriceDisplay prices={companion.price_range} />

            <div className="space-y-3 mt-6">
              <Button 
                className="w-full premium-gradient text-white"
                onClick={handleChat}
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Conversar Agora
              </Button>
              {companion.premium && !user?.premium && (
                <Button 
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={() => router.push("/premium")} // Navigate to premium page
                  size="lg"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Acessar Conteúdo Premium
                </Button>
              )}
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-2xl overflow-hidden shadow-xl">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full grid grid-cols-3 bg-muted/30 rounded-t-xl rounded-b-none">
                <TabsTrigger value="about" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-md">Sobre</TabsTrigger>
                <TabsTrigger value="services" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-md">Serviços</TabsTrigger>
                <TabsTrigger value="reviews" className="py-3 data-[state=active]:bg-background data-[state=active]:shadow-md">Avaliações ({companion.reviews?.length || 0})</TabsTrigger>
              </TabsList>
              <div className="p-4 md:p-6 min-h-[200px]">
                <TabsContent value="about">
                  <div className="space-y-4 text-sm text-muted-foreground prose prose-sm max-w-none">
                    <p>{companion.description || "Nenhuma descrição fornecida."}</p>
                    {/* Availability component might need more complex data/logic */}
                    <h4 className="font-semibold text-foreground">Disponibilidade:</h4>
                    <Availability availability={companion.availability || []} />
                  </div>
                </TabsContent>
                <TabsContent value="services">
                  {companion.services && companion.services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {companion.services.map((service) => (
                        <div
                          key={service}
                          className="flex items-center gap-2 p-2.5 rounded-md bg-muted/40 border border-border/20 text-sm"
                        >
                          <Star className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{service}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum serviço específico listado.</p>
                  )}
                </TabsContent>
                <TabsContent value="reviews">
                  <Reviews reviews={companion.reviews || []} companionId={id} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

