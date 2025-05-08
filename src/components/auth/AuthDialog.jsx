import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function AuthDialog({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [userType, setUserType] = React.useState("client");

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.target);
      const data = await login(formData.get("email"), formData.get("password"));
      
      if (data.user) {
        // Redirect based on user type
        if (data.user.user_metadata?.role === "companion") {
          router.push("/companion/setup");
        } else {
          router.push("/profile");
        }
      }
      onClose();
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.target);
      const data = await register(
        formData.get("name"),
        formData.get("email"),
        formData.get("password"),
        userType
      );

      if (data.user) {
        // Redirect based on user type
        if (userType === "companion") {
          router.push("/companion/setup");
        } else {
          router.push("/profile");
        }
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Por favor, verifique seus dados e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full h-16 rounded-none grid grid-cols-2">
            <TabsTrigger value="login" className="text-lg">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="text-lg">Cadastrar</TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full premium-gradient"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <Tabs value={userType} onValueChange={setUserType} className="w-full mb-6">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="client">Cliente</TabsTrigger>
                  <TabsTrigger value="companion">Modelo</TabsTrigger>
                </TabsList>
              </Tabs>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {userType === "companion" ? "Nome Artístico" : "Nome"}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder={userType === "companion" ? "Seu nome artístico" : "Seu nome"}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full premium-gradient"
                  disabled={isLoading}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
                {userType === "companion" && (
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Após o cadastro, você será redirecionada para completar seu perfil com fotos e informações adicionais.
                  </p>
                )}
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
