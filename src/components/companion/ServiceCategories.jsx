
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

export const SERVICE_CATEGORIES = {
  "Massagens": [
    "Massagem Relaxante",
    "Massagem Tântrica",
    "Massagem Sensual",
    "Massagem com Óleos",
    "Massagem Nuru",
  ],
  "Fetiches": [
    "Dominação",
    "Submissão",
    "Role Play",
    "Fantasias",
    "BDSM Leve",
    "BDSM Pesado",
    "Pet Play",
  ],
  "Preliminares": [
    "Beijos",
    "Oral Natural",
    "Oral Completo",
    "69",
    "Masturbação",
  ],
  "Acompanhante": [
    "Jantar",
    "Eventos Sociais",
    "Viagens",
    "Pernoite",
    "Final de Semana",
  ],
  "Especiais": [
    "Striptease",
    "Danças Sensuais",
    "Fotos Sensuais",
    "Vídeo Chamada",
    "Sexting",
  ],
  "Extras": [
    "Anal",
    "Inversão",
    "Duplas",
    "Fantasias Temáticas",
    "Acessórios",
  ],
};

export function ServiceCategories({ selectedServices, onToggleService }) {
  return (
    <div className="space-y-8">
      {Object.entries(SERVICE_CATEGORIES).map(([category, services]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            {category}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {services.map((service) => (
              <Button
                key={service}
                variant={selectedServices.includes(service) ? "default" : "outline"}
                className="justify-start h-auto py-3 px-4"
                onClick={() => onToggleService(service)}
              >
                {selectedServices.includes(service) && (
                  <Check className="h-4 w-4 mr-2 flex-shrink-0" />
                )}
                <span className="text-sm">{service}</span>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
