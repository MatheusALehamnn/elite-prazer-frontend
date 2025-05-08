
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";

export function Availability({ availability }) {
  const today = new Date();
  const nextWeek = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <Calendar className="h-4 w-4" />
        <span>Disponibilidade esta semana</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {nextWeek.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const slots = availability[dateStr] || [];
          const isAvailable = slots.length > 0;

          return (
            <div
              key={dateStr}
              className={`text-center p-2 rounded-lg ${
                isAvailable
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <div className="text-xs mb-1">{format(date, "EEE", { locale: ptBR })}</div>
              <div className="text-sm font-medium">{format(date, "d")}</div>
              {isAvailable && (
                <div className="text-xs mt-1">
                  {slots.length} horário{slots.length !== 1 ? "s" : ""}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
