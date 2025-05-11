"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { User, Mail, MapPin, Bell, Edit3, ShieldCheck, Crown, LogOut, Trash2, Camera, Briefcase, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function UserProfilePage() {
  const { user, loading: authLoading, updateProfile, logout, deleteAccount } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    avatar_url: "",
  });
  const [newAvatarFile, setNewAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: user.profile?.location || "",
        avatar_url: user.profile?.avatar_url || "",
      });
      setAvatarPreview(user.profile?.avatar_url || null);
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    let avatarUrl = formData.avatar_url;

    if (newAvatarFile) {
      const fileExt = newAvatarFile.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars") // Ensure this bucket exists and has RLS policies
        .upload(fileName, newAvatarFile, { upsert: true });

      if (uploadError) {
        toast({ title: "Erro no Upload", description: "Não foi possível enviar sua nova foto de perfil.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
      avatarUrl = publicUrlData.publicUrl;
    }

    try {
      await updateProfile({
        name: formData.name,
        // Email update should be handled separately due to Supabase auth flow (requires confirmation)
        location: formData.location,
        avatar_url: avatarUrl,
      });
      toast({ title: "Perfil Atualizado", description: "Suas informações foram salvas com sucesso." });
      setIsEditing(false);
      setNewAvatarFile(null); // Reset file input after successful upload
    } catch (error: any) {
      toast({ title: "Erro ao Atualizar", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
      setIsLoading(true);
      try {
        await deleteAccount();
        toast({ title: "Conta Excluída", description: "Sua conta foi excluída com sucesso." });
        router.push("/");
      } catch (error: any) {
        toast({ title: "Erro ao Excluir Conta", description: error.message, variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (authLoading || !user) {
    return <div className="flex justify-center items-center h-screen">Carregando perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-24 pb-12">
      <main className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-lg border border-border/30 rounded-xl shadow-2xl p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center mb-8">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-primary/50 shadow-lg">
                  <AvatarImage src={avatarPreview || user.profile?.avatar_url || "/default-avatar.png"} alt={user.name || "Usuário"} />
                  <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label htmlFor="avatarUpload" className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/80 transition-colors">
                    <Camera className="h-5 w-5" />
                    <input id="avatarUpload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </label>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center">
                  {formData.name || user.name}
                  {user.premium && <Crown className="ml-2 h-6 w-6 text-yellow-500" title="Usuário Premium" />}
                  {user.profile?.verified && <ShieldCheck className="ml-2 h-6 w-6 text-green-500" title="Perfil Verificado" />}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
                {user.role === "companion" && (
                  <Link href="/perfil/acompanhante/configuracao" passHref>
                    <Button variant="outline" size="sm" className="mt-3">
                      <Briefcase className="mr-2 h-4 w-4" /> Gerenciar Perfil de Acompanhante
                    </Button>
                  </Link>
                )}
              </div>
              <Button 
                variant={isEditing ? "secondary" : "outline"} 
                size="icon" 
                onClick={() => setIsEditing(!isEditing)} 
                className="ml-auto mt-4 sm:mt-0 h-10 w-10"
                title={isEditing ? "Cancelar Edição" : "Editar Perfil"}
              >
                {isEditing ? <User className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
              </Button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nome de Exibição</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Seu nome" className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email (para alterar, contate o suporte)</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={formData.email} disabled placeholder="seu@email.com" className="pl-10 bg-muted/50 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Localização (Cidade, Estado)</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Sua cidade" className="pl-10" />
                  </div>
                </div>
                <Button type="submit" className="w-full premium-gradient" disabled={isLoading || authLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                  <span className="text-foreground">{formData.location || "Localização não informada"}</span>
                </div>
                {/* Add more display fields here as needed */}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/premium" passHref>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card/60 backdrop-blur-md border-border/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Meu Plano</CardTitle>
                  <Crown className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.premium ? "Premium Ativo" : "Gratuito"}</div>
                  <p className="text-xs text-muted-foreground">
                    {user.premium ? "Aproveite todos os benefícios!" : "Faça upgrade para mais recursos."}
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/perfil/configuracoes" passHref> {/* Assuming a settings page */} 
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-card/60 backdrop-blur-md border-border/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Configurações</CardTitle>
                  <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Gerenciar Conta</div>
                  <p className="text-xs text-muted-foreground">
                    Notificações, privacidade e segurança.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="bg-card/80 backdrop-blur-lg border border-border/30 rounded-xl shadow-xl p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Ações da Conta</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Sair da Conta (Logout)
              </Button>
              <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteAccount} disabled={isLoading || authLoading}>
                <Trash2 className="mr-2 h-4 w-4" /> Excluir Minha Conta
              </Button>
              <p className="text-xs text-muted-foreground pt-2">
                A exclusão da conta é permanente e removerá todos os seus dados da plataforma.
              </p>
            </div>
          </div>

        </motion.div>
      </main>
    </div>
  );
}
