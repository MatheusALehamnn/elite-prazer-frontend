"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, DollarSign, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react"; // Added Eye for View Details
import Link from "next/link"; // For navigation if needed

// Mock data - replace with actual data fetching later
const stats = [
  { id: 1, icon: Users, title: "Clientes", value: "1,234", description: "Total de clientes" },
  { id: 2, icon: Users, title: "Acompanhantes", value: "256", description: "Perfis ativos" },
  { id: 3, icon: DollarSign, title: "Receita (Mês)", value: "R$ 12.345", description: "Faturamento mensal" },
  { id: 4, icon: AlertTriangle, title: "Denúncias", value: "23", description: "Pendentes de revisão" },
];

const pendingProfilesData = [
  { id: 1, name: "Julia Silva", location: "São Paulo, SP", imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" },
  { id: 2, name: "Carla Dias", location: "Rio de Janeiro, RJ", imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop" },
  { id: 3, name: "Mariana Costa", location: "Belo Horizonte, MG", imageUrl: "https://images.unsplash.com/photo-1635591781169-15e8ab6060f9?w=100&h=100&fit=crop" },
];

const recentReportsData = [
  { id: 1, title: "Conteúdo Inadequado", time: "2h atrás", description: "Fotos inadequadas no perfil de 'Amanda G.'", profileLink: "/admin/profiles/amanda-g" },
  { id: 2, title: "Comportamento Suspeito", time: "5h atrás", description: "Usuário 'ClienteX' enviando mensagens repetitivas.", profileLink: "/admin/users/clientex" },
  { id: 3, title: "Perfil Falso", time: "1 dia atrás", description: "Suspeita de perfil falso para 'NovaModelo123'.", profileLink: "/admin/profiles/novamodelo123" },
];

export default function AdminDashboardPage() {
  // Handlers for approve/reject/remove actions - to be implemented
  const handleApproveProfile = (profileId) => console.log(`Approve profile ${profileId}`);
  const handleRejectProfile = (profileId) => console.log(`Reject profile ${profileId}`);
  const handleRemoveContent = (reportId) => console.log(`Remove content for report ${reportId}`);

  return (
    // Removed min-h-screen and pt-24 as layout.tsx handles this
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="bg-card/50 backdrop-blur-lg border border-border/30 rounded-2xl p-6 md:p-8 mb-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Painel Administrativo</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(stat => (
            <StatCard
              key={stat.id}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card/30 backdrop-blur-md border border-border/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Cadastros Pendentes de Aprovação</h2>
            {pendingProfilesData.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {pendingProfilesData.map((profile) => (
                    <PendingProfileCard 
                      key={profile.id} 
                      profile={profile} 
                      onApprove={handleApproveProfile}
                      onReject={handleRejectProfile}
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">Nenhum cadastro pendente no momento.</p>
            )}
          </div>

          <div className="bg-card/30 backdrop-blur-md border border-border/20 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Denúncias Recentes</h2>
            {recentReportsData.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {recentReportsData.map((report) => (
                    <ReportCard 
                      key={report.id} 
                      report={report} 
                      onRemove={handleRemoveContent} 
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-muted-foreground">Nenhuma denúncia recente.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
}

function StatCard({ icon: Icon, title, value, description }: StatCardProps) {
  return (
    <div className="bg-card/20 backdrop-blur-sm border border-border/10 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-foreground">{value}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

interface PendingProfileCardProps {
  profile: { id: number; name: string; location: string; imageUrl: string; };
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

function PendingProfileCard({ profile, onApprove, onReject }: PendingProfileCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/20 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/50">
          <img 
            className="w-full h-full object-cover"
            alt={`Foto de ${profile.name}`}
            src={profile.imageUrl} 
          />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-foreground">{profile.name}</h3>
          <p className="text-xs text-muted-foreground">{profile.location}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="icon-sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10" onClick={() => onApprove(profile.id)} title="Aprovar Perfil">
          <CheckCircle className="h-4 w-4" />
        </Button>
        <Button size="icon-sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10" onClick={() => onReject(profile.id)} title="Rejeitar Perfil">
          <XCircle className="h-4 w-4" />
        </Button>
        <Link href={`/admin/profiles/${profile.id}`} passHref>
            <Button size="icon-sm" variant="outline" title="Ver Detalhes do Perfil">
                <Eye className="h-4 w-4" />
            </Button>
        </Link>
      </div>
    </div>
  );
}

interface ReportCardProps {
  report: { id: number; title: string; time: string; description: string; profileLink?: string };
  onRemove: (id: number) => void;
}

function ReportCard({ report, onRemove }: ReportCardProps) {
  return (
    <div className="p-3 rounded-lg bg-muted/30 border border-border/20 hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-sm text-foreground">{report.title}</h3>
        <span className="text-xs text-muted-foreground">{report.time}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2 truncate" title={report.description}>{report.description}</p>
      <div className="flex gap-2">
        {report.profileLink && (
            <Link href={report.profileLink} passHref>
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                    Ver Detalhes
                </Button>
            </Link>
        )}
        <Button size="sm" variant="destructive-outline" className="text-xs" onClick={() => onRemove(report.id)}>
          Resolver/Remover
        </Button>
      </div>
    </div>
  );
}

