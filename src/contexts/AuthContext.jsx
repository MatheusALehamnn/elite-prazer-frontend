
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getUserProfile = useCallback(async (userId) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      let finalUserData = { ...userData };

      if (userData.role === 'companion') {
        const { data: companionData, error: companionError } = await supabase
          .from('companions')
          .select(`
            *,
            photos (
              id,
              url,
              is_primary,
              is_premium
            )
          `)
          .eq('id', userId)
          .single();

        if (!companionError && companionData) {
          finalUserData.companionProfile = companionData;
        }
      }

      setUser(finalUserData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Por favor, tente novamente mais tarde",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await getUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await getUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [getUserProfile]);

  const register = async (name, email, password, role = "client") => {
    try {
      setLoading(true);

      // First, check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error("User already registered");
      }

      // Create auth user
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

      if (authError) throw authError;

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
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

      // If registering as companion, create companion profile
      if (role === "companion") {
        const { error: companionError } = await supabase
          .from('companions')
          .insert([
            {
              id: authData.user.id,
              email,
              name,
              location: "",
              description: "",
              verified: false,
              premium: false,
              status: 'pending',
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
        title: "Cadastro realizado com sucesso",
        description: role === "companion" 
          ? "Complete seu perfil para começar a receber contatos"
          : "Bem-vindo ao Elite Prazer",
      });

      return authData;
    } catch (error) {
      console.error('Error registering:', error);
      toast({
        title: "Erro no cadastro",
        description: error.message === "User already registered" 
          ? "Este email já está cadastrado"
          : "Ocorreu um erro no cadastro. Tente novamente.",
        variant: "destructive",
      });
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

      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao Elite Prazer",
      });

      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
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

      setUser(null);
      navigate("/");
      
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Erro ao sair",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (companionId) => {
    if (!user) return;

    try {
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('companion_id', companionId)
        .single();

      if (existingFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('id', existingFavorite.id);
      } else {
        await supabase
          .from('favorites')
          .insert([
            {
              user_id: user.id,
              companion_id: companionId
            }
          ]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
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
    toggleFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
