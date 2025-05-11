"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompanionCard } from "@/components/companion/CompanionCard"; // Assuming CompanionCard is adapted
import { supabase } from "@/lib/supabase";
import { Search, MapPin, Filter, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams, useRouter } from 'next/navigation'; // For query params
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

// Define types for better code quality
interface Companion {
  id: string;
  name: string;
  location: string;
  description?: string;
  photos: { url: string; is_primary: boolean }[];
  reviews?: { rating: number }[];
  isFavorite?: boolean;
  rating?: string | null;
  views?: number;
  price_range?: { hour?: number; additional_hour?: number; overnight?: number };
  services?: string[];
  age?: number;
  // Add other fields as necessary
}

interface CityOption {
  value: string;
  label: string;
}

function CompanionListPageInner() {
  const [companions, setCompanions] = useState<Companion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [cities, setCities] = useState<CityOption[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 60]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("created_at_desc"); // Default sort

  const { user, toggleFavorite, setIsAuthOpen } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isFavoritesPage = searchParams.get('favorites') === 'true';
  const isHistoryPage = searchParams.get('history') === 'true'; // Placeholder for history functionality

  const fetchCitiesAndServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("companions")
        .select("location, services")
        .eq("verified", true)
        .eq("status", "approved"); // Only show approved companions

      if (error) throw error;

      const uniqueCities = [...new Set(data.map(c => c.location).filter(Boolean))];
      setCities(uniqueCities.sort().map(city => ({ value: city, label: city })));
      
      const allServices = data.flatMap(c => c.services || []);
      const uniqueServices = [...new Set(allServices.filter(Boolean))];
      setAvailableServices(uniqueServices.sort());

    } catch (error) {
      console.error("Error fetching cities or services:", error);
      toast({ title: "Erro", description: "Não foi possível carregar filtros.", variant: "destructive" });
    }
  }, [toast]);

  const fetchCompanions = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("companions")
        .select(`
          id,
          name,
          description,
          location,
          age,
          price_range,
          services,
          photos ( url, is_primary ),
          reviews ( rating )
        `)
        .eq("verified", true)
        .eq("status", "approved");

      if (isFavoritesPage && user) {
        const { data: favoriteIds, error: favError } = await supabase
          .from('favorites')
          .select('companion_id')
          .eq('user_id', user.id);
        if (favError) throw favError;
        const ids = favoriteIds.map(f => f.companion_id);
        if (ids.length === 0) {
          setCompanions([]);
          setLoading(false);
          return;
        }
        query = query.in('id', ids);
      } else if (isFavoritesPage && !user) {
        toast({ title: "Login Necessário", description: "Faça login para ver seus favoritos.", variant: "default" });
        setIsAuthOpen(true);
        setCompanions([]);
        setLoading(false);
        return;
      }
      
      // Sorting
      if (sortBy === "rating_desc") query = query.order("average_rating", { ascending: false, nullsFirst: false }); // Assuming average_rating column exists
      else if (sortBy === "price_asc") query = query.order("price_range->hour", { ascending: true });
      else if (sortBy === "price_desc") query = query.order("price_range->hour", { ascending: false });
      else query = query.order("created_at", { ascending: false }); // Default

      const { data: companionsData, error: companionsError } = await query;

      if (companionsError) throw companionsError;

      let favorites: string[] = [];
      if (user) {
        const { data: favoritesData } = await supabase
          .from("favorites")
          .select("companion_id")
          .eq("user_id", user.id);
        favorites = favoritesData?.map(f => f.companion_id) || [];
      }

      const companionsWithMeta = companionsData.map(companion => ({
        ...companion,
        isFavorite: favorites.includes(companion.id),
        rating: companion.reviews?.length > 0
          ? (companion.reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / companion.reviews.length).toFixed(1)
          : null,
        // views: 0, // Placeholder for views, to be implemented
      })) as Companion[];

      setCompanions(companionsWithMeta);
    } catch (error) {
      console.error("Error fetching companions:", error);
      toast({ title: "Erro", description: "Não foi possível carregar acompanhantes.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast, user, isFavoritesPage, setIsAuthOpen, sortBy]);

  useEffect(() => {
    fetchCitiesAndServices();
  }, [fetchCitiesAndServices]);

  useEffect(() => {
    fetchCompanions();
  }, [fetchCompanions]); // Re-fetch when sortBy changes

  const handleFavoriteToggle = async (companionId: string) => {
    if (!user) {
      toast({ title: "Login Necessário", description: "Faça login para favoritar.", variant: "default" });
      setIsAuthOpen(true);
      return;
    }
    if (toggleFavorite) {
        await toggleFavorite(companionId);
        // Optimistic update or re-fetch
        setCompanions(prev => prev.map(c => 
            c.id === companionId ? { ...c, isFavorite: !c.isFavorite } : c
        ));
        if (isFavoritesPage) fetchCompanions(); // Re-fetch if on favorites page
    }
  };

  const handleChat = (companion: Companion) => {
    if (!user) {
      toast({ title: "Login Necessário", description: "Faça login para iniciar um chat.", variant: "default" });
      setIsAuthOpen(true);
      return;
    }
    // Navigate to chat or open chat window
    router.push(`/chat/${companion.id}`); // Example route
    toast({ title: "Chat", description: `Iniciando chat com ${companion.name}.`, variant: "default" });
  };

  const filteredCompanions = companions.filter(companion => {
    const nameMatch = companion.name.toLowerCase().includes(searchTerm.toLowerCase());
    const locationMatch = !locationFilter || companion.location === locationFilter;
    const priceMatch = (!companion.price_range?.hour || (companion.price_range.hour >= priceRange[0] && companion.price_range.hour <= priceRange[1]));
    const ageMatch = (!companion.age || (companion.age >= ageRange[0] && companion.age <= ageRange[1]));
    const servicesMatch = selectedServices.length === 0 || selectedServices.every(s => companion.services?.includes(s));
    return nameMatch && locationMatch && priceMatch && ageMatch && servicesMatch;
  });

  const pageTitle = isFavoritesPage ? "Meus Favoritos" : isHistoryPage ? "Histórico de Visualizações" : "Acompanhantes";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-4 sm:mb-0">{pageTitle}</h1>
        {!isFavoritesPage && !isHistoryPage && (
          <Link href="/cadastro/acompanhante" passHref>
            <Button className="premium-gradient text-white">Quero me Cadastrar</Button>
          </Link>
        )}
      </div>

      {/* Filters Section */}
      <div className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-xl p-4 md:p-6 mb-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background pl-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">Todas as cidades</option>
              {cities.map(city => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </select>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <Filter className="mr-2 h-4 w-4" /> 
                {selectedServices.length > 0 ? `${selectedServices.length} serviços selecionados` : "Filtrar por Serviços"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Serviços Oferecidos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableServices.map((service) => (
                <DropdownMenuCheckboxItem
                  key={service}
                  checked={selectedServices.includes(service)}
                  onCheckedChange={(checked) => {
                    setSelectedServices(prev => 
                      checked ? [...prev, service] : prev.filter(s => s !== service)
                    );
                  }}
                >
                  {service}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
                <label className="text-sm font-medium text-muted-foreground">Faixa de Preço (hora): R$ {priceRange[0]} - R$ {priceRange[1]}</label>
                <Slider defaultValue={[0,1000]} max={2000} step={50} value={priceRange} onValueChange={(value) => setPriceRange(value as [number, number])} className="mt-2" />
            </div>
            <div>
                <label className="text-sm font-medium text-muted-foreground">Faixa de Idade: {ageRange[0]} - {ageRange[1]} anos</label>
                <Slider defaultValue={[18,60]} min={18} max={70} step={1} value={ageRange} onValueChange={(value) => setAgeRange(value as [number, number])} className="mt-2" />
            </div>
        </div>
         <div className="flex items-center justify-between mt-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        Ordenar por: {sortBy.replace("_", " ").replace("desc", "(Decres.)").replace("asc", "(Cresc.)")}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy("created_at_desc")}>Mais Recentes</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("rating_desc")}>Melhor Avaliadas</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price_asc")}>Menor Preço</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("price_desc")}>Maior Preço</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {(searchTerm || locationFilter || selectedServices.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 1000 || ageRange[0] !== 18 || ageRange[1] !== 60) && (
                <Button variant="ghost" onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    setSelectedServices([]);
                    setPriceRange([0,1000]);
                    setAgeRange([18,60]);
                }} className="text-sm">
                    <X className="mr-2 h-4 w-4" /> Limpar Filtros
                </Button>
            )}
        </div>
      </div>

      <AnimatePresence>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="animate-pulse"
              >
                <div className="aspect-[3/4] rounded-xl bg-muted/50 shadow" />
                <div className="mt-2 h-4 bg-muted/50 rounded w-3/4"/>
                <div className="mt-1 h-3 bg-muted/50 rounded w-1/2"/>
              </motion.div>
            ))}
          </div>
        ) : filteredCompanions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredCompanions.map((companion) => (
              <CompanionCard
                key={companion.id}
                companion={companion}
                onFavoriteToggle={handleFavoriteToggle} // Ensure CompanionCard uses this prop
                onChat={() => handleChat(companion)} // Ensure CompanionCard uses this prop
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Nenhuma acompanhante encontrada com os filtros selecionados.</p>
            <p className="text-sm text-muted-foreground mt-2">Tente ajustar seus critérios de busca.</p>
          </div>
        )}
      </AnimatePresence>
      {/* TODO: Add pagination if many results */}
    </motion.div>
  );
}

export default function CompanionListPageWrapper() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CompanionListPageInner />
    </Suspense>
  );
}

