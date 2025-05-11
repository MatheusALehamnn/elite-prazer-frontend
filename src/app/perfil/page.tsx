"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext"; // Assuming AuthContext is in this path
import { User, Mail, MapPin, ShieldCheck, Edit3, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { user, updateUserProfile, loading: authLoading, setLoading: setAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(""); // Assuming city is part of user profile
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/"); // Redirect to home or login if not authenticated
    } else if (user) {
      setName(user.user_metadata?.name || user.email?.split('@')[0] || "");
      setEmail(user.email || "");
      // Assuming city might be stored in user_metadata or a separate profile table linked to the user
      // For this example, let's assume it's in user_metadata.custom_data.city
      setCity(user.user_metadata?.city || ""); 
    }
  }, [user, authLoading, router]);

  const handleProfileUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setAuthLoading(true);

    try {
      // Construct the metadata to update.
      // Only include fields that have changed or are being set.
      const metadataUpdate: { name?: string; city?: string; [key: string]: any } = {};
      if (name !== (user.user_metadata?.name || user.email?.split('@')[0])) {
        metadataUpdate.name = name;
      }
      if (city !== (user.user_metadata?.city || "")) {
        metadataUpdate.city = city;
      }
      // Email updates often require a verification step and are handled differently,
      // usually not directly via metadata update for security reasons.
      // If email change is needed, it might involve a dedicated function in useAuth.

      // For now, we'll only update name and city through user_metadata.
      // If email needs to be updatable, the `updateUser` method in `AuthContext` should handle it.
      await updateUserProfile({ data: metadataUpdate }); 

      toast({
        title: "Perfil Atualizado",
        description: "Suas informações foram salvas com sucesso.",
        className: "bg-green-500 text-white",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Erro ao Atualizar",
        description: error.message || "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setAuthLoading(false);
    }
  };

  if (authLoading || !user) {
    return <div className="flex justify-center items-center min-h-screen">Carregando perfil...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 md:px-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card/80 backdrop-blur-lg border border-border/30 rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center md:flex-row md:items-start gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-4xl font-semibold text-primary">
                  {name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                </div>
                {/* Placeholder for profile picture upload if needed */}
              </div>
              <div className="text-center md:text-left flex-grow">
                <h1 className="text-3xl font-bold text-foreground">{name || "Usuário"}</h1>
                <p className="text-muted-foreground">{user.email}</p>
                {user.user_metadata?.city && <p className="text-sm text-muted-foreground">{user.user_metadata.city}</p>}
              </div>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="shrink-0">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Editar Perfil
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Nome Completo</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="emailEdit" className="text-sm font-medium">Email</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="emailEdit"
                      type="email"
                      value={email}
                      // Email changes often require a separate verification flow, so disable editing or handle with care.
                      // For this example, we'll make it read-only in the form, assuming email changes are handled elsewhere or not allowed directly.
                      readOnly 
                      className="pl-10 bg-muted/50 cursor-not-allowed"
                      disabled={isLoading}
                    />
                     <p className="text-xs text-muted-foreground mt-1">A alteração de e-mail requer um processo de verificação e não pode ser feita diretamente aqui.</p>
                  </div>
                </div>
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">Cidade</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Sua cidade e estado (ex: São Paulo, SP)"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <Button type="submit" className="w-full premium-gradient" disabled={isLoading || authLoading}>
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs text-muted-foreground uppercase font-semibold">Nome</h3>
                  <p className="text-foreground">{name || "Não informado"}</p>
                </div>
                <div>
                  <h3 className="text-xs text-muted-foreground uppercase font-semibold">Email</h3>
                  <p className="text-foreground">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-xs text-muted-foreground uppercase font-semibold">Cidade</h3>
                  <p className="text-foreground">{city || "Não informada"}</p>
                </div>
                {/* Placeholder for other profile information */}
              </div>
            )}
          </div>

          <div className="mt-8 bg-card/80 backdrop-blur-lg border border-border/30 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Plano e Assinatura</h2>
            {user.user_metadata?.is_premium ? (
              <div>
                <p className="text-muted-foreground">Você é um membro <span className="font-semibold text-primary">Premium</span>!</p>
                <p className="text-sm text-muted-foreground">Sua assinatura é válida até: {new Date(user.user_metadata.premium_expires_at).toLocaleDateString('pt-BR')}</p>
                {/* Add link to manage subscription if applicable */}
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground mb-3">Desbloqueie recursos exclusivos e apoie a plataforma tornando-se um membro Premium.</p>
                <Link href="/premium" passHref>
                  <Button className="w-full md:w-auto premium-gradient">
                    Conheça as Vantagens Premium
                  </Button>
                </Link>
              </div>
            )}
            {/* Add more details about subscription management or link to a dedicated page */}
          </div>

          <div className="mt-8 bg-card/80 backdrop-blur-lg border border-border/30 rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Segurança da Conta</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-left" disabled>
                <ShieldCheck className="mr-2 h-4 w-4 text-green-500"/>
                Alterar Senha (Em breve)
              </Button>
              <p className="text-xs text-muted-foreground pl-1">
                Recomendamos o uso de senhas fortes e únicas.
              </p>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
