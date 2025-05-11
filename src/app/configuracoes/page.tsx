"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext"; // Assuming AuthContext is in this path
import { Bell, Shield, EyeOff, CreditCard, LogOut, UserCog, Palette, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import Link from "next/link"; // Para o componente Link
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Para os componentes de Select
import { ShieldCheck } from "lucide-react"; // Ícone que faltava

export default function SettingsPage() {
  const { user, logout, updateUserPreferences, loading, setLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // States for user preferences - initialize with user data or defaults
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("pt-BR"); // Default language

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
 
  useEffect(() => {
    if (!loading && user && user.user_metadata) {
      setEmailNotifications(user.user_metadata.email_notifications ?? true);
      setPushNotifications(user.user_metadata.push_notifications ?? true);
      setProfileVisibility(user.user_metadata.profile_public ?? true);
      setDarkMode(user.user_metadata.dark_mode ?? false);
      setLanguage(user.user_metadata.language || "pt-BR");
    }
  }, [user, loading]);

  const handlePreferenceChange = async (preference: string, value: any) => {
    if (!user) return;
    setLoading(true);
    try {
      await updateUserPreferences({ [preference]: value });
      toast({
        title: "Preferência Atualizada",
        description: `Sua configuração de ${preference.replace("_", " ")} foi salva.`,
        className: "bg-green-600 text-white",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao Salvar",
        description: error.message || "Não foi possível salvar a preferência.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/"); // Redirect to home after logout
      toast({ description: "Você foi desconectado." });
    } catch (error: any) {
      toast({
        title: "Erro ao Sair",
        description: error.message || "Não foi possível realizar o logout.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== "EXCLUIR MINHA CONTA") {
      toast({
        title: "Confirmação Inválida",
        description: "Por favor, digite a frase corretamente para confirmar a exclusão.",
        variant: "destructive",
      });
      return;
    }
    // Add account deletion logic here, potentially calling a function from useAuth
    // This is a placeholder for the actual deletion API call
    console.warn("Account deletion functionality not yet implemented.");
    toast({
      title: "Conta Excluída (Simulação)",
      description: "Sua conta seria excluída aqui. Implementação pendente.",
    });
    setIsDeleteModalOpen(false);
    // router.push("/"); // Redirect after deletion
  };

  if (loading || !user) {
    return <div className="flex justify-center items-center min-h-screen">Carregando configurações...</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 md:py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas preferências e dados da conta.</p>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <UserCog className="mr-3 h-5 w-5 text-primary" />
              Conta
            </h2>
            <div className="bg-card/70 backdrop-blur-md border border-border/30 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex items-center cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  Notificações por E-mail
                </Label>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={(value) => handlePreferenceChange("email_notifications", value)}
                  disabled={loading}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex items-center cursor-pointer">
                  <Bell className="mr-2 h-4 w-4" />
                  Notificações Push (App)
                </Label>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={(value) => handlePreferenceChange("push_notifications", value)}
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Shield className="mr-3 h-5 w-5 text-primary" />
              Privacidade e Segurança
            </h2>
            <div className="bg-card/70 backdrop-blur-md border border-border/30 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="profile-visibility" className="flex items-center cursor-pointer">
                  <EyeOff className="mr-2 h-4 w-4" />
                  Perfil Visível para outros usuários
                </Label>
                <Switch
                  id="profile-visibility"
                  checked={profileVisibility}
                  onCheckedChange={(value) => handlePreferenceChange("profile_public", value)}
                  disabled={loading}
                />
              </div>
              <Separator />
              <Button variant="outline" className="w-full justify-start" disabled>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Alterar Senha (Em breve)
              </Button>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <Palette className="mr-3 h-5 w-5 text-primary" />
              Aparência e Idioma
            </h2>
            <div className="bg-card/70 backdrop-blur-md border border-border/30 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center cursor-pointer">
                  Modo Escuro
                </Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={(value) => handlePreferenceChange("dark_mode", value)}
                  disabled={loading}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="language-select">Idioma</Label>
                <Select value={language} onValueChange={(value) => handlePreferenceChange("language", value)} disabled={loading}>
                  <SelectTrigger id="language-select" className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES" disabled>Español (Próximamente)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
              <CreditCard className="mr-3 h-5 w-5 text-primary" />
              Assinatura e Pagamentos
            </h2>
            <div className="bg-card/70 backdrop-blur-md border border-border/30 rounded-lg p-6 space-y-4">
              {user.user_metadata?.is_premium ? (
                <div>
                  <p className="text-green-600 font-semibold">Você é um Assinante Premium!</p>
                  <p className="text-sm text-muted-foreground">Sua assinatura é válida até {new Date(user.user_metadata.premium_expires_at).toLocaleDateString("pt-BR")}.</p>
                  <Button variant="outline" className="w-full mt-3" disabled>
                    Gerenciar Assinatura (Em breve)
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">Você não possui uma assinatura ativa.</p>
                  <Link href="/premium" passHref>
                    <Button className="w-full mt-3 premium-gradient">
                      Conheça as Vantagens Premium
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-destructive mb-4 flex items-center">
              <AlertTriangle className="mr-3 h-5 w-5" />
              Zona de Perigo
            </h2>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-6 space-y-4">
              <Button variant="destructive" className="w-full" onClick={() => setIsDeleteModalOpen(true)} disabled={loading}>
                Excluir Minha Conta Permanentemente
              </Button>
              <p className="text-xs text-destructive/80">
                Esta ação é irreversível. Todos os seus dados, incluindo perfil, histórico e configurações serão permanentemente removidos.
              </p>
            </div>
          </section>

          <div className="mt-10 flex justify-end">
            <Button onClick={handleLogout} variant="ghost" disabled={loading || authLoading}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair da Conta
            </Button>
          </div>
        </div>
      </motion.div>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Confirmar Exclusão de Conta</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Esta ação é <strong className="text-destructive-foreground">permanente e irreversível</strong>. Todos os seus dados, incluindo perfil, mensagens, favoritos e histórico de atividades serão excluídos.
            </p>
            <p className="text-sm text-muted-foreground">
              Para confirmar, digite "<strong className="text-destructive-foreground">EXCLUIR MINHA CONTA</strong>" no campo abaixo.
            </p>
            <Input 
              type="text"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="EXCLUIR MINHA CONTA"
              className="border-destructive focus:ring-destructive"
            />
          </div>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading || deleteConfirmationText !== "EXCLUIR MINHA CONTA"}
            >
              {isLoading ? "Excluindo..." : "Eu entendo, excluir minha conta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Mock components if not available or for simplicity
// const Select = ({ children, ...props }: any) => <select {...props}>{children}</select>;
// const SelectTrigger = ({ children, ...props }: any) => <div {...props}>{children}</div>;
// const SelectValue = ({ placeholder }: any) => <span>{placeholder || "Select an option"}</span>;
// const SelectContent = ({ children, ...props }: any) => <div {...props}>{children}</div>;
// const SelectItem = ({ children, value, ...props }: any) => <option value={value} {...props}>{children}</option>;


