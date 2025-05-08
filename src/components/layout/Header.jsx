
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Heart, History, Search } from "lucide-react";

export function Header({ onOpenAuth }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed w-full top-0 z-50 glass-card">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 
            onClick={() => navigate("/")} 
            className="text-2xl font-bold text-gradient cursor-pointer"
          >
            Elite Prazer
          </h1>
          {user && (
            <div className="hidden md:flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2"
                onClick={() => navigate("/search")}
              >
                <Search className="h-4 w-4" />
                Buscar
              </Button>
              <Button 
                variant="ghost"
                className="premium-gradient text-white"
                onClick={() => navigate("/premium")}
              >
                Área Premium
              </Button>
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/search?favorites=true")}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Favoritos</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/search?history=true")}>
                  <History className="mr-2 h-4 w-4" />
                  <span>Histórico</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
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
            <>
              <Button variant="ghost" onClick={onOpenAuth}>
                Entrar
              </Button>
              <Button onClick={onOpenAuth} className="premium-gradient text-white">
                Começar
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
