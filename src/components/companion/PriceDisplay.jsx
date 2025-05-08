
import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Clock, Calendar, Plane } from "lucide-react";

export function PriceDisplay({ prices }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const priceItems = [
    { icon: Clock, label: "1 Hora", value: prices?.hour, duration: "60 minutos" },
    { icon: Clock, label: "2 Horas", value: prices?.twoHours, duration: "120 minutos" },
    { icon: Calendar, label: "Pernoite", value: prices?.night, duration: "12 horas" },
    { icon: Calendar, label: "Final de Semana", value: prices?.weekend, duration: "48 horas" },
    { icon: Plane, label: "Viagem", value: prices?.travel, duration: "Por dia" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Valores</h3>
      <div className="grid gap-3">
        {priceItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-lg p-4 flex items-center justify-between group hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.duration}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lg">
                {item.value ? formatPrice(item.value) : "Sob consulta"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
