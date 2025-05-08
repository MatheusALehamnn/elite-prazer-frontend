"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Mail, Lock, User, ArrowLeft } from "lucide-react";

export default function CompanionRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, loading: authLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      // If user is already logged in, redirect them, perhaps to home or dashboard
      // Or if they are a companion and profile is incomplete, to setup page
      if (user.role === 'companion') {
        router.push('/perfil/acompanhante/configuracao');
      } else {
        router.push('/');
      }
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro de Validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    if (formData.password.length < 6) {
        toast({
            title: "Senha Muito Curta",
            description: "A senha deve ter pelo menos 6 caracteres.",
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    try {
      const authData = await register(formData.name, formData.email, formData.password, "companion");
      if (authData && authData.user) {
        // AuthContext's register function already shows a success toast.
        // It also creates a basic user and companion entry.
        // Now redirect to the detailed profile setup page.
        router.push("/perfil/acompanhante/configuracao");
      } else {
        // If authData or authData.user is null/undefined, it means registration might have been handled (e.g., user already exists)
        // but didn't proceed to create a new user session for redirection here.
        // The toast for existing user is handled in AuthContext.
        // If it's another error, AuthContext should also show a toast.
      }
    } catch (error: any) {
      // Error toast is handled by AuthContext's register function
      console.error("Registration failed on page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 dark:from-rose-900/30 dark:via-background dark:to-purple-900/30 flex flex-col justify-center items-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/80 backdrop-blur-lg border border-border/30 rounded-xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/" passHref className="mb-4 inline-block">
                <span className="text-3xl font-bold text-gradient">Elite Prazer</span>
            </Link>
            <h1 className="text-2xl font-semibold text-foreground">Cadastro de Acompanhante</h1>
            <p className="text-muted-foreground text-sm mt-1">Crie sua conta para começar a brilhar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome Artístico</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Como você quer ser conhecida"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Repita sua senha"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full premium-gradient text-white py-3 text-base"
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? "Criando Conta..." : "Criar Conta e Continuar"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Já tem uma conta?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Faça Login
            </Link>
          </p>
        </div>
         <div className="mt-6 text-center">
            <Link href="/" passHref>
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Início
                </Button>
            </Link>
        </div>
      </motion.div>
    </div>
  );
}

