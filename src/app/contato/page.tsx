"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, MessageCircle, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend API
    // For this example, we'll just show a toast notification
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    console.log("Contact Form Data:", { name, email, subject, message });

    toast({
      title: "Mensagem Enviada!",
      description: "Obrigado por entrar em contato. Responderemos em breve.",
    });
    // Optionally, reset the form
    e.currentTarget.reset();
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient">Entre em Contato</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Tem alguma dúvida, sugestão ou precisa de suporte? Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Contact Form */}
          <div className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-xl p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-foreground">Envie uma Mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" placeholder="Seu nome completo" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Seu Melhor Email</Label>
                <Input id="email" name="email" type="email" placeholder="voce@exemplo.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subject">Assunto</Label>
                <Input id="subject" name="subject" placeholder="Sobre o que você gostaria de falar?" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Sua Mensagem</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Digite sua mensagem detalhada aqui..."
                  className="min-h-[120px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full premium-gradient text-white py-3">
                <MessageCircle className="h-5 w-5 mr-2" />
                Enviar Mensagem
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-xl p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Outras Formas de Contato</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground text-sm">
                      Para dúvidas gerais e suporte: <a href="mailto:contato@eliteprazer.com" className="text-primary hover:underline">contato@eliteprazer.com</a>
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Para parcerias e imprensa: <a href="mailto:parcerias@eliteprazer.com" className="text-primary hover:underline">parcerias@eliteprazer.com</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Telefone (WhatsApp)</h3>
                    <p className="text-muted-foreground text-sm">
                      <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">(11) 99999-9999</a>
                    </p>
                    <p className="text-xs text-muted-foreground">Atendimento via WhatsApp: Seg-Sex, 9h-18h</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-xl p-6 md:p-8 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-foreground">Horário de Atendimento</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4"/>
                        <span>Segunda a Sexta: 9h às 18h</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4"/>
                        <span>Sábado: 9h às 13h (Suporte Limitado)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-destructive"/>
                        <span>Domingo e Feriados: Fechado</span>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

