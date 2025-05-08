"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext"; // Assuming AuthContext is adapted for Next.js
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Heart, History, Search, Menu, X } from "lucide-react";

export function Header() {
  const router = useRouter();
  const { user, logout, setIsAuthOpen } = useAuth(); // Assuming setIsAuthOpen is exposed by AuthContext
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const navigateAndCloseMobileMenu = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const openAuthModal = () => {
    setIsAuthOpen(true); // This function should be provided by your AuthContext to open the AuthDialog
    setIsMobileMenuOpen(false);
  }

  const navLinks = [
    { href: "/busca", label: "Buscar", icon: Search, authRequired: true, className: "" },
    { href: "/premium", label: "Área Premium", icon: null, authRequired: true, className: "premium-gradient text-white" },
  ];

  const userMenuItems = [
    { href: "/perfil", label: "Meu Perfil", icon: User },
    { href: "/busca?favorites=true", label: "Favoritos", icon: Heart }, // Assuming query params are handled by the search page
    { href: "/busca?history=true", label: "Histórico", icon: History },
    { href: "/configuracoes", label: "Configurações", icon: Settings },
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" passHref>
          <span className="text-2xl font-bold text-gradient cursor-pointer">
            Elite Prazer
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2">
          {user && navLinks.map(link => (
            <Link key={link.href} href={link.href} passHref>
              <Button variant="ghost" className={`${link.className} flex items-center gap-2`}>
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userMenuItems.map(item => (
                  <DropdownMenuItem key={item.href} onClick={() => navigateAndCloseMobileMenu(item.href)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                ))}
                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigateAndCloseMobileMenu("/admin/dashboard")}> {/* Updated admin route */}
                      <span className="font-semibold">Painel Admin</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" onClick={openAuthModal}>
                Entrar
              </Button>
              <Button onClick={openAuthModal} className="premium-gradient text-white">
                Começar
              </Button>
            </div>
          )}
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg py-4 z-40 border-b border-border/40">
          <div className="container mx-auto px-4 flex flex-col gap-2">
            {user ? (
              navLinks.map(link => (
                <Link key={link.href} href={link.href} passHref>
                  <Button variant="ghost" className={`${link.className} w-full justify-start text-lg py-3`} onClick={() => setIsMobileMenuOpen(false)}>
                    {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                    {link.label}
                  </Button>
                </Link>
              ))
            ) : (
              <>
                <Button variant="ghost" onClick={openAuthModal} className="w-full justify-start text-lg py-3">
                  Entrar
                </Button>
                <Button onClick={openAuthModal} className="premium-gradient text-white w-full justify-start text-lg py-3">
                  Começar
                </Button>
              </>
            )}
            {user && <div className="my-2 border-t border-border/40"></div>}
            {user && userMenuItems.slice(0,2).map(item => ( // Show first few items, rest in dropdown or separate page
                <Link key={item.href} href={item.href} passHref>
                    <Button variant="ghost" className="w-full justify-start text-lg py-3" onClick={() => setIsMobileMenuOpen(false)}>
                        <item.icon className="mr-2 h-5 w-5" />
                        <span>{item.label}</span>
                    </Button>
                </Link>
            ))}
             {user && (
                <Link href="/configuracoes" passHref>
                    <Button variant="ghost" className="w-full justify-start text-lg py-3" onClick={() => setIsMobileMenuOpen(false)}>
                        <Settings className="mr-2 h-5 w-5" />
                        <span>Configurações</span>
                    </Button>
                </Link>
            )}
            {user && user.role === "admin" && (
                 <Link href="/admin/dashboard" passHref>
                    <Button variant="ghost" className="w-full justify-start text-lg py-3 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>
                        Painel Admin
                    </Button>
                </Link>
            )}
            {user && <div className="my-2 border-t border-border/40"></div>}
            {user && (
              <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-lg py-3 text-red-500 hover:text-red-600">
                <LogOut className="mr-2 h-5 w-5" />
                Sair
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

