import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "ellp_token";
const USER_KEY = "ellp_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega dados salvos ao iniciar
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Verifica se o token ainda é válido
      checkSession(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Verifica sessão com o backend
  const checkSession = async (tokenToCheck) => {
    try {
      const userData = await authService.getMe(tokenToCheck);
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (err) {
      // Token inválido ou expirado
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      setToken(response.token);
      setUser(response.user);

      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  // Verifica se usuário tem determinada role
  const hasRole = useCallback(
    (...roles) => {
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  // Verifica se usuário pode editar (admin ou coordenador)
  const canEdit = useCallback(() => {
    return hasRole("admin", "coordenador");
  }, [hasRole]);

  // Verifica se usuário pode deletar (apenas admin)
  const canDelete = useCallback(() => {
    return hasRole("admin");
  }, [hasRole]);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    hasRole,
    canEdit,
    canDelete,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Constantes de roles para uso no app
export const ROLES = {
  ADMIN: "admin",
  COORDENADOR: "coordenador",
  VISITANTE: "visitante",
};

