"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Bell, Shield, Eye, CreditCard, LogOut, Trash2, UserCircle, Palette, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Define a type for settings if it becomes complex
interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  profile_visibility: boolean;
  online_status: boolean;
  dark_mode: boolean;
  language: string;
}

export default function SettingsPage() {
  const { user, loading: authLoading, logout, deleteAccount, updateUserSettings, userSettings } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
    if (user && userSettings) {
      setCurrentSettings(userSettings);
    }
  }, [user, authLoading, userSettings, router]);

  const handleSettingChange = async (key: keyof UserSettings, value: any) => {
    if (!user || !currentSettings) return;
    
    const newSettings = { ...currentSettings, [key]: value };
    setCurrentSettings(newSettings);

    // Debounce or save on blur/button click for better UX
    // For now, save immediately
    try {
      await updateUserSettings(newSettings);
      toast({ title: "Configuração Salva", description: `Sua preferência de ${key.replace("_", " ")} foi atualizada.` });
    } catch (error: any) {
      toast({ title: "Erro ao Salvar", description: error.message, variant: "destructive" });
      // Revert UI change if save fails
      setCurrentSettings(prev => ({ ...prev, [key]: !value })); 
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      router.push("/"); // Redirect to home after logout
    } catch (error: any) {
      toast({ title: "Erro ao Sair", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.")) {
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

  if (authLoading || !user || !currentSettings) {
    return <div className="flex justify-center items-center h-screen">Carregando configurações...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-20 pb-12">
      <main className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="mb-6">
            <Link href="/perfil/usuario" passHref>
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Perfil
              </Button>
            </Link>
          </div>

          <div className="bg-card/80 backdrop-blur-lg border border-border/30 rounded-xl shadow-2xl p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-gradient">Configurações da Conta</h1>

            <div className="space-y-8">
              {/* Notificações Section */}
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-foreground">
                  <Bell className="h-5 w-5 text-primary" />
                  Notificações
                </h2>
                <div className="space-y-4 pl-7">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <Label htmlFor="email-notifications" className="cursor-pointer flex-grow">Notificações por email</Label>
                    <Switch 
                      id="email-notifications" 
                      checked={currentSettings.email_notifications}
                      onCheckedChange={(checked) => handleSettingChange("email_notifications", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <Label htmlFor="push-notifications" className="cursor-pointer flex-grow">Notificações push (app)</Label>
                    <Switch 
                      id="push-notifications" 
                      checked={currentSettings.push_notifications}
                      onCheckedChange={(checked) => handleSettingChange("push_notifications", checked)}
                    />
                  </div>
                </div>
              </section>

              {/* Privacidade Section */}
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-foreground">
                  <Shield className="h-5 w-5 text-primary" />
                  Privacidade
                </h2>
                <div className="space-y-4 pl-7">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <Label htmlFor="profile-visibility" className="cursor-pointer flex-grow">Perfil visível para outros usuários</Label>
                    <Switch 
                      id="profile-visibility" 
                      checked={currentSettings.profile_visibility}
                      onCheckedChange={(checked) => handleSettingChange("profile_visibility", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <Label htmlFor="online-status" className="cursor-pointer flex-grow">Mostrar status online</Label>
                    <Switch 
                      id="online-status" 
                      checked={currentSettings.online_status}
                      onCheckedChange={(checked) => handleSettingChange("online_status", checked)}
                    />
                  </div>
                </div>
              </section>

              {/* Preferências Section */}
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-foreground">
                  <Eye className="h-5 w-5 text-primary" />
                  Preferências de Interface
                </h2>
                <div className="space-y-4 pl-7">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <Label htmlFor="dark-mode" className="cursor-pointer flex-grow">Modo escuro</Label>
                    <Switch 
                      id="dark-mode" 
                      checked={currentSettings.dark_mode}
                      onCheckedChange={(checked) => handleSettingChange("dark_mode", checked)}
                      // This would typically also trigger a theme change in the app
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <Label htmlFor="language">Idioma</Label>
                    {/* Language selection could be a dropdown or modal */}
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Em Breve", description: "Seleção de idioma será implementada futuramente." }) }>
                      <Globe className="mr-2 h-4 w-4" /> {currentSettings.language || "Português (BR)"}
                    </Button>
                  </div>
                </div>
              </section>

              {/* Pagamento Section - Placeholder, actual implementation depends on payment provider */}
              {user.role === "client" && (
                <section>
                  <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-foreground">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Pagamentos e Assinaturas
                  </h2>
                  <div className="space-y-3 pl-7">
                    <Link href="/premium/gerenciar" passHref> {/* Example route */} 
                      <Button variant="outline" className="w-full justify-start">
                        Gerenciar Assinatura Premium
                      </Button>
                    </Link>
                    <Link href="/historico-pagamentos" passHref> {/* Example route */} 
                      <Button variant="outline" className="w-full justify-start">
                        Histórico de Transações
                      </Button>
                    </Link>
                  </div>
                </section>
              )}

              {/* Ações da Conta Section */}
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-destructive">
                  <UserCircle className="h-5 w-5" />
                  Gerenciamento da Conta
                </h2>
                <div className="space-y-3 pl-7">
                  <Button variant="outline" className="w-full justify-start" onClick={handleLogout} disabled={isLoading}>
                    <LogOut className="mr-2 h-4 w-4" /> Sair da Conta (Logout)
                  </Button>
                  <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteAccount} disabled={isLoading}>
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir Minha Conta
                  </Button>
                  <p className="text-xs text-muted-foreground pt-1">
                    A exclusão da conta é permanente e removerá todos os seus dados da plataforma.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

