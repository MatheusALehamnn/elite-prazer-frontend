
import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Elite Prazer</h3>
            <p className="text-sm text-muted-foreground">
              A melhor plataforma de acompanhantes premium do Brasil.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Para Acompanhantes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/companion/register" className="text-muted-foreground hover:text-primary">
                  Cadastre-se
                </Link>
              </li>
              <li>
                <Link to="/premium" className="text-muted-foreground hover:text-primary">
                  Plano Premium
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Atendimento</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Segunda a Sexta: 9h às 18h</li>
              <li>Sábado: 9h às 13h</li>
              <li>contato@eliteprazer.com</li>
              <li>(11) 99999-9999</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Elite Prazer. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
