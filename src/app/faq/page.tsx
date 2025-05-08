"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Using ShadCN Accordion for better UX
import { MessageCircle, ArrowRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const faqData = [
  {
    id: "cadastro",
    question: "Como funciona o cadastro de acompanhante?",
    answer: "O cadastro é simples e rápido. Clique em 'Quero me Cadastrar' na página de acompanhantes ou no seu perfil, preencha suas informações, envie suas fotos e defina seus serviços e preços. Após uma breve análise da nossa equipe para garantir a segurança e qualidade da plataforma, seu perfil estará visível no site.",
  },
  {
    id: "pagamento",
    question: "Como funciona o pagamento pelos serviços?",
    answer: "Os pagamentos são acordados e realizados diretamente entre clientes e acompanhantes. A Elite Prazer atua como uma plataforma de anúncio e conexão, não intermediando transações financeiras entre as partes. Recomendamos que combinem os detalhes do pagamento de forma clara e segura antes do encontro.",
  },
  {
    id: "verificacao",
    question: "Como sei se um perfil de acompanhante é verificado?",
    answer: "Perfis verificados possuem um selo de verificação (geralmente um ícone de escudo) exibido de forma proeminente no perfil da acompanhante. Todas as acompanhantes passam por um processo de verificação de identidade antes de terem seus perfis aprovados e publicados na plataforma.",
  },
  {
    id: "premium-cliente",
    question: "O que é a conta Premium para clientes?",
    answer: "A conta Premium para clientes oferece acesso a funcionalidades exclusivas, como visualização de fotos e vídeos privados das acompanhantes, filtros de busca avançados, histórico de visualizações, lista de favoritos ilimitada e, em alguns casos, contato direto facilitado. Assine Premium para uma experiência completa.",
  },
  {
    id: "premium-acompanhante",
    question: "Quais as vantagens de ser uma acompanhante Premium?",
    answer: "Acompanhantes com perfil Premium ganham maior destaque nas buscas, podem adicionar mais fotos e vídeos (incluindo conteúdo exclusivo para assinantes), e têm acesso a ferramentas de gerenciamento de perfil mais avançadas. Isso aumenta sua visibilidade e potencial de ganhos.",
  },
  {
    id: "privacidade",
    question: "Como a Elite Prazer lida com a privacidade dos usuários?",
    answer: "Levamos sua privacidade muito a sério. Todas as informações sensíveis são tratadas com confidencialidade e segurança. Você tem controle sobre quais informações deseja exibir publicamente em seu perfil. Consulte nossa Política de Privacidade para mais detalhes.",
  },
  {
    id: "contato-acompanhante",
    question: "Como entro em contato com uma acompanhante?",
    answer: "Após criar sua conta e fazer login, você pode utilizar o sistema de chat interno para iniciar uma conversa com a acompanhante desejada. Algumas acompanhantes Premium também podem disponibilizar outras formas de contato direto em seus perfis, visíveis para clientes Premium.",
  },
];

export default function FAQPage() {
  const router = useRouter();

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-12">
          <HelpCircle className="mx-auto h-12 w-12 text-primary mb-4" />
          <h1 className="text-4xl font-bold text-gradient">Perguntas Frequentes</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Encontre respostas para as dúvidas mais comuns sobre a Elite Prazer.
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-xl shadow-xl p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b-0">
                <AccordionTrigger className="text-left hover:no-underline p-4 bg-muted/30 rounded-lg data-[state=open]:bg-muted/50 data-[state=open]:shadow-md transition-all">
                  <span className="font-semibold text-base text-foreground">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pt-3 pb-4 px-4 text-muted-foreground text-sm">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 p-6 bg-muted/40 rounded-lg border border-border/20 text-center">
            <h2 className="text-xl font-semibold mb-2 text-foreground">Ainda tem dúvidas?</h2>
            <p className="text-muted-foreground mb-6">
              Nossa equipe de suporte está pronta para ajudar você com qualquer questão que não tenha sido respondida aqui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato" passHref>
                <Button className="premium-gradient text-white w-full sm:w-auto">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Falar com Suporte
                </Button>
              </Link>
              <Link href="/premium" passHref>
                <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Conheça o Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

