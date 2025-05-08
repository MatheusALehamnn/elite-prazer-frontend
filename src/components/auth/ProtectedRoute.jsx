
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  const { toast } = useToast();

  if (!user) {
    toast({
      title: "Acesso Restrito",
      description: "Faça login para acessar o conteúdo premium",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    toast({
      title: "Acesso Negado",
      description: "Você não tem permissão para acessar esta área",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return children;
}
