"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Search, MessageCircle, Shield, Star } from "lucide-react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useRouter } from "next/navigation"; // Changed from react-router-dom
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link"; // Import Link for navigation

export default function HomePage() { // Changed to default export and renamed for clarity
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const router = useRouter(); // Next.js router hook
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      router.push("/premium"); // Changed to router.push
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleOpenChat = (companion) => {
    if (user) {
      setSelectedCompanion(companion);
      setIsChatOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-rose-50">
      <main className="container mx-auto px-4 pt-16 md:pt-24 lg:pt-32"> {/* Adjusted top padding for potential header */} 
        <section className="py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Exclusividade, Segurança e Sofisticação
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Conectamos clientes exigentes a acompanhantes verificadas em um ambiente premium e discreto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleGetStarted} size="lg" className="premium-gradient text-white">
                {user ? "Área Premium" : "Criar Conta Premium"}
              </Button>
              {/* Assuming Saiba Mais could link to an about or features page */}
              <Link href="/sobre" passHref>
                <Button variant="outline" size="lg" asChild>
                  <a>Saiba Mais</a>
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="py-12 md:py-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Shield}
              title="Segurança Garantida"
              description="Perfis verificados e pagamentos seguros para sua tranquilidade."
            />
            <FeatureCard
              icon={Star}
              title="Perfis Premium"
              description="Acompanhantes selecionadas e fotos profissionais."
            />
            <FeatureCard
              icon={MessageCircle}
              title="Chat Privativo"
              description="Comunicação direta e discreta com as acompanhantes."
            />
            <FeatureCard
              icon={Search}
              title="Busca Avançada"
              description="Encontre exatamente o que procura com nossos filtros."
            />
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Acompanhantes em Destaque</h2>
            <p className="text-muted-foreground">
              Conheça algumas de nossas acompanhantes premium
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder data for ProfileCard, to be replaced with dynamic data later */}
            <ProfileCard
              name="Laura"
              id="laura" // Added id for linking
              location="São Paulo, SP"
              description="Modelo internacional com experiência em eventos sociais."
              imageUrl="https://images.unsplash.com/photo-1635591781169-15e8ab6060f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" // Example image
              onChat={() => handleOpenChat({ name: "Laura", id: "laura" })}
            />
            <ProfileCard
              name="Sophia"
              id="sophia"
              location="Rio de Janeiro, RJ"
              description="Acompanhante de luxo para momentos especiais."
              imageUrl="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" // Example image
              onChat={() => handleOpenChat({ name: "Sophia", id: "sophia" })}
            />
            <ProfileCard
              name="Isabella"
              id="isabella"
              location="Belo Horizonte, MG"
              description="Elegante e sofisticada para encontros exclusivos."
              imageUrl="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80" // Example image
              onChat={() => handleOpenChat({ name: "Isabella", id: "isabella" })}
            />
          </div>
        </section>
      </main>

      {user && isChatOpen && selectedCompanion && (
        <ChatWindow
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          companion={selectedCompanion}
        />
      )}
      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="glass-card rounded-2xl p-6 shadow-lg bg-white/30 backdrop-blur-md border border-white/20"
    >
      <div className="h-12 w-12 rounded-lg premium-gradient flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-muted-foreground text-gray-600">{description}</p>
    </motion.div>
  );
}

interface ProfileCardProps {
  name: string;
  id: string;
  location: string;
  description: string;
  imageUrl: string;
  onChat: () => void;
}

function ProfileCard({ name, id, location, description, imageUrl, onChat }: ProfileCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card rounded-2xl overflow-hidden shadow-lg bg-white/30 backdrop-blur-md border border-white/20"
    >
      <div className="aspect-[3/4] relative">
        <img 
          className="w-full h-full object-cover"
          alt={`Foto de ${name}`}
          src={imageUrl}
        />
        <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors">
          <Heart className="h-5 w-5 text-white" />
        </button>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-1 text-gray-800">{name}</h3>
        <p className="text-sm text-muted-foreground mb-3 text-gray-600">{location}</p>
        <p className="text-sm text-gray-700">{description}</p>
        <div className="flex gap-2 mt-4">
          <Link href={`/acompanhantes/${id}`} passHref>
            <Button className="flex-1 premium-gradient text-white" asChild>
              <a>Ver Perfil</a>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={onChat}
            className="aspect-square border-primary/50 text-primary hover:bg-primary/10"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

