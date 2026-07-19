import React, { createContext, useContext, useEffect, useState } from "react";
import { getDecodedToken, isTokenValid } from "../utils/auth";

type AuthState = {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t && isTokenValid()) {
      setToken(t);
      setUser(getDecodedToken());
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(getDecodedToken());
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    // force full reload to reset client state/navigation if needed
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated: !!token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
