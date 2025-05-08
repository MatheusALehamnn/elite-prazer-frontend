"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation"; // Changed from react-router-dom
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase"; // Assuming supabase client is correctly configured

// Define types for context and user
interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  preferences?: {
    notifications?: boolean;
    emailAlerts?: boolean;
    city?: string;
    ageRange?: [number, number];
  };
  companionProfile?: any; // Define a more specific type if possible
  // Add other user-specific fields here
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email, password) => Promise<any>;
  logout: () => Promise<void>;
  register: (name, email, password, role?: string) => Promise<any>;
  toggleFavorite?: (companionId: string) => Promise<void>; // Made optional as it might not be used everywhere
  isAuthOpen: boolean; // Added to manage AuthDialog state
  setIsAuthOpen: React.Dispatch<React.SetStateAction<boolean>>; // Added to manage AuthDialog state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false); // State for AuthDialog
  const { toast } = useToast();
  const router = useRouter();

  const getUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError) throw userError;

      let finalUserData: UserProfile = { ...userData } as UserProfile;

      if (userData && userData.role === "companion") {
        const { data: companionData, error: companionError } = await supabase
          .from("companions")
          .select(`
            *,
            photos (
              id,
              url,
              is_primary,
              is_premium
            )
          `)
          .eq("id", userId)
          .single();

        if (!companionError && companionData) {
          finalUserData.companionProfile = companionData;
        }
      }
      setUser(finalUserData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Por favor, tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await getUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await getUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false); // Ensure loading is set to false when session is null
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [getUserProfile]);

  const register = async (name, email, password, role = "client") => {
    try {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (authError) {
        // Check for specific error: User already registered
        if (authError.message.includes("User already registered") || authError.message.includes("already exists")) {
            toast({
                title: "Erro no cadastro",
                description: "Este email já está cadastrado.",
                variant: "destructive",
            });
        } else {
            throw authError;
        }
        return; // Stop execution if user already exists
      }
      
      if (!authData.user) throw new Error("User registration failed, no user data returned.");

      const { error: profileError } = await supabase
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email,
            name,
            role,
            preferences: {
              notifications: true,
              emailAlerts: true,
              city: "",
              ageRange: [18, 50]
            }
          }
        ]);

      if (profileError) throw profileError;

      if (role === "companion") {
        const { error: companionError } = await supabase
          .from("companions")
          .insert([
            {
              id: authData.user.id,
              // email, // email is already in users table
              // name, // name is already in users table
              location: "",
              description: "",
              verified: false,
              premium: false,
              status: "pending",
              services: [],
              price_range: {
                hour: 0,
                additional_hour: 0,
                overnight: 0
              }
            }
          ]);

        if (companionError) throw companionError;
      }

      toast({
        title: "Cadastro realizado com sucesso!",
        description: role === "companion" 
          ? "Complete seu perfil para começar a receber contatos."
          : "Bem-vindo ao Elite Prazer!",
      });
      setIsAuthOpen(false); // Close auth dialog on successful registration
      return authData;
    } catch (error: any) {
      console.error("Error registering:", error);
      if (!error.message.includes("Este email já está cadastrado")) { // Avoid double toast for already registered
        toast({
            title: "Erro no cadastro",
            description: error.message || "Ocorreu um erro no cadastro. Tente novamente.",
            variant: "destructive",
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.session) throw new Error("Login failed, no session data returned.");

      // User profile should be fetched by onAuthStateChange listener
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta ao Elite Prazer!",
      });
      setIsAuthOpen(false); // Close auth dialog on successful login
      return data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast({
        title: "Erro no login",
        description: error.message || "Email ou senha incorretos. Verifique e tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null); // Clear user state
      router.push("/");
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Por favor, tente novamente",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (companionId: string) => {
    if (!user) {
        toast({ title: "Ação requer login", description: "Por favor, entre na sua conta para favoritar.", variant: "destructive"});
        setIsAuthOpen(true);
        return;
    }

    try {
      const { data: existingFavorite, error: fetchError } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("companion_id", companionId)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") { // PGRST116: 'single row not found'
        throw fetchError;
      }

      if (existingFavorite) {
        const { error: deleteError } = await supabase
          .from("favorites")
          .delete()
          .eq("id", existingFavorite.id);
        if (deleteError) throw deleteError;
        toast({ title: "Removido dos Favoritos" });
      } else {
        const { error: insertError } = await supabase
          .from("favorites")
          .insert([{ user_id: user.id, companion_id: companionId }]);
        if (insertError) throw insertError;
        toast({ title: "Adicionado aos Favoritos" });
      }
      // Optionally, re-fetch user profile or update local state to reflect changes in favorites
      if (user?.id) await getUserProfile(user.id);

    } catch (error: any) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Erro ao atualizar favoritos",
        description: error.message || "Não foi possível atualizar os favoritos. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    toggleFavorite,
    isAuthOpen,
    setIsAuthOpen
  };

  return (
    <AuthContext.Provider value={value}>
      {children} 
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

