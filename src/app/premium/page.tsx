"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle, Star, Zap, ShieldCheck, Award, Users, MessageSquare, CalendarCheck2, Lock } from "lucide-react";

const premiumFeatures = [
  {
    icon: <Star className="h-6 w-6 text-yellow-400" />,
    title: "Destaque nas Buscas",
    description: "Apareça no topo dos resultados e seja vista por mais clientes.",
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-blue-500" />,
    title: "Selo de Perfil Verificado",
    description: "Aumente a confiança e credibilidade com um selo de verificação especial.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-green-500" />,
    title: "Chat Ilimitado",
    description: "Converse sem restrições com todos os seus pretendentes.",
  },
  {
    icon: <CalendarCheck2 className="h-6 w-6 text-purple-500" />,
    title: "Agendamento Facilitado",
    description: "Ferramentas avançadas para gerenciar seus encontros e disponibilidade.",
  },
  {
    icon: <Lock className="h-6 w-6 text-red-500" />,
    title: "Privacidade Avançada",
    description: "Controle quem pode ver suas informações e fotos privadas.",
  },
  {
    icon: <Award className="h-6 w-6 text-orange-500" />,
    title: "Acesso a Eventos Exclusivos",
    description: "Participe de eventos e encontros VIPs organizados pela plataforma.",
  },
];

const pricingTiers = [
  {
    name: "Plano Mensal",
    price: "R$ 29,90",
    billingCycle: "/mês",
    features: [
      "Todos os benefícios Premium",
      "Suporte prioritário",
      "Cancelamento a qualquer momento",
    ],
    cta: "Assinar Agora",
    highlight: false,
  },
  {
    name: "Plano Trimestral",
    price: "R$ 79,90",
    billingCycle: "/trimestre",
    features: [
      "Todos os benefícios Premium",
      "Economize 10%",
      "Suporte prioritário",
      "Cancelamento a qualquer momento",
    ],
    cta: "Assinar Agora",
    highlight: true,
  },
  {
    name: "Plano Anual",
    price: "R$ 299,90",
    billingCycle: "/ano",
    features: [
      "Todos os benefícios Premium",
      "Economize 20%",
      "Suporte prioritário",
      "Cancelamento a qualquer momento",
    ],
    cta: "Assinar Agora",
    highlight: false,
  },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Desbloqueie o Potencial Máximo do Seu Perfil
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Com o plano Premium, você tem acesso a ferramentas exclusivas para aumentar sua visibilidade, segurança e oportunidades.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {premiumFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-3">
                {feature.icon}
                <h3 className="text-xl font-semibold ml-3 text-white">{feature.title}</h3>
              </div>
              <p className="text-purple-200 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Escolha o Plano Ideal para Você</h2>
          <p className="text-lg text-purple-200">
            Invista em você e alcance novos patamares de sucesso.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              className={`rounded-xl shadow-2xl p-8 flex flex-col ${tier.highlight ? 'bg-white text-purple-700' : 'bg-white/10 text-white'}`}
            >
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <p className={`text-4xl font-extrabold mb-1 ${tier.highlight ? 'text-purple-600' : 'text-white'}`}>{tier.price}</p>
              <p className={`text-sm mb-6 ${tier.highlight ? 'text-gray-600' : 'text-purple-200'}`}>{tier.billingCycle}</p>
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 ${tier.highlight ? 'text-green-500' : 'text-green-400'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full py-3 text-lg font-semibold rounded-lg ${tier.highlight ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-purple-200">
            Dúvidas? Entre em contato com nosso suporte especializado.
          </p>
        </div>
      </div>
    </div>
  );
}

