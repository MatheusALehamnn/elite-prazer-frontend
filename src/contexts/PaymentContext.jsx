
import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const PaymentContext = createContext({});

export function PaymentProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();

  const handlePaymentSuccess = (details) => {
    setLoading(true);
    try {
      // Update user's premium status
      updateProfile({ premium: true });
      
      toast({
        title: "Pagamento realizado com sucesso!",
        description: "Bem-vindo ao plano Premium",
      });
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error) => {
    toast({
      title: "Erro no pagamento",
      description: "Por favor, tente novamente",
      variant: "destructive",
    });
  };

  const value = {
    loading,
    handlePaymentSuccess,
    handlePaymentError
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => useContext(PaymentContext);
