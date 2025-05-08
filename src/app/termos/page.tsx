"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming this path is correct for your project structure
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-20 pb-12 text-foreground">
      <main className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="mb-6">
            <Link href="/" passHref>
              <Button variant="outline" size="sm" className="text-foreground border-border hover:bg-muted/50">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Início
              </Button>
            </Link>
          </div>

          <div className="bg-card/80 backdrop-blur-lg border border-border/30 rounded-xl shadow-2xl p-6 md:p-8">
            <div className="text-center mb-8">
              <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
              <h1 className="text-3xl md:text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Termos de Uso
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Leia atentamente nossos termos e condições antes de utilizar a plataforma Elite Prazer.
              </p>
            </div>

            <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground dark:prose-invert">
              <h2 className="text-xl font-semibold text-foreground">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar ou usar a plataforma Elite Prazer ("Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Uso ("Termos"). Se você não concordar com estes Termos, não deverá acessar ou usar o Serviço.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-6">2. Elegibilidade</h2>
              <p>
                Você deve ter pelo menos 18 anos de idade para usar o Serviço. Ao usar o Serviço, você declara e garante que tem pelo menos 18 anos de idade e tem o direito, autoridade e capacidade para celebrar estes Termos.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-6">3. Uso da Plataforma</h2>
              <p>
                A Elite Prazer é uma plataforma de classificados online que conecta acompanhantes e clientes. Não nos responsabilizamos pelas interações ou transações entre usuários. Você é o único responsável por suas interações com outros usuários.
              </p>
              <p>
                Você concorda em não usar o Serviço para qualquer finalidade ilegal ou proibida por estes Termos, incluindo, mas não se limitando a:
              </p>
              <ul>
                <li>Publicar conteúdo ilegal, difamatório, obsceno ou ofensivo.</li>
                <li>Personificar qualquer pessoa ou entidade.</li>
                <li>Violar os direitos de privacidade ou propriedade intelectual de terceiros.</li>
                <li>Envolver-se em qualquer atividade fraudulenta.</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-6">4. Conteúdo do Usuário</h2>
              <p>
                Você é o único responsável por todo o conteúdo que publica, envia ou exibe no Serviço ("Conteúdo do Usuário"). Ao fornecer Conteúdo do Usuário, você concede à Elite Prazer uma licença mundial, não exclusiva, isenta de royalties, sublicenciável e transferível para usar, reproduzir, distribuir, preparar trabalhos derivados, exibir e executar o Conteúdo do Usuário em conexão com o Serviço.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-6">5. Moderação e Remoção de Conteúdo</h2>
              <p>
                Reservamo-nos o direito, mas não a obrigação, de monitorar, editar ou remover qualquer Conteúdo do Usuário que, a nosso exclusivo critério, viole estes Termos ou seja de outra forma censurável.
              </p>
              
              <h2 className="text-xl font-semibold text-foreground mt-6">6. Limitação de Responsabilidade</h2>
              <p>
                O Serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo. Em nenhuma circunstância a Elite Prazer será responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes ou relacionados ao seu uso do Serviço.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-6">7. Alterações nos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos você sobre quaisquer alterações publicando os novos Termos no Serviço. Seu uso continuado do Serviço após a publicação das alterações constitui sua aceitação dos novos Termos.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-6">8. Contato</h2>
              <p>
                Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco em <a href="mailto:suporte@eliteprazer.com" className="text-primary hover:underline">suporte@eliteprazer.com</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

