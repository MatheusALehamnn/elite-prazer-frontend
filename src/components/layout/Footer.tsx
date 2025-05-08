import React from "react";
import Link from "next/link"; // Changed from react-router-dom

export function Footer() {
  const usefulLinks = [
    { href: "/faq", label: "Perguntas Frequentes" },
    { href: "/termos", label: "Termos de Uso" }, // Matched with todo.md page name
    { href: "/privacidade", label: "Política de Privacidade" }, // Assuming a /privacidade route
    { href: "/contato", label: "Contato" }, // Matched with todo.md page name
  ];

  const forCompanionsLinks = [
    { href: "/cadastro/acompanhante", label: "Cadastre-se" }, // Matched with todo.md page name
    { href: "/premium", label: "Plano Premium" }, // Matched with todo.md page name
    { href: "/faq", label: "Como Funciona" }, // Re-using FAQ link
  ];

  return (
    <footer className="bg-background/50 backdrop-blur-sm mt-auto border-t border-border/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Elite Prazer</h3>
            <p className="text-sm text-muted-foreground">
              A melhor plataforma de acompanhantes premium do Brasil.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} passHref>
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Para Acompanhantes</h3>
            <ul className="space-y-2 text-sm">
              {forCompanionsLinks.map((link) => (
                <li key={link.label + link.href}> {/* Added href to key for more uniqueness */} 
                  <Link href={link.href} passHref>
                    <span className="text-muted-foreground hover:text-primary cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Atendimento</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Segunda a Sexta: 9h às 18h</li>
              <li>Sábado: 9h às 13h</li>
              <li>contato@eliteprazer.com</li>
              <li>(11) 99999-9999</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Elite Prazer. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

