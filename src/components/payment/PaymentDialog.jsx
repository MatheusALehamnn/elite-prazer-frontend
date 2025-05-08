
import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePayment } from "@/contexts/PaymentContext";

export function PaymentDialog({ isOpen, onClose }) {
  const { handlePaymentSuccess, handlePaymentError } = usePayment();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assinar Plano Premium</DialogTitle>
          <DialogDescription>
            Aproveite todos os benefícios do Elite Acompanhantes por apenas R$10/mês
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: "10.00",
                      currency_code: "BRL"
                    },
                    description: "Assinatura Premium Elite Acompanhantes"
                  }
                ]
              });
            }}
            onApprove={(data, actions) => {
              return actions.order.capture().then(handlePaymentSuccess);
            }}
            onError={handlePaymentError}
            style={{
              layout: "vertical",
              color: "gold",
              shape: "rect",
              label: "pay"
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
