"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "@/services/auth";

const AuthContext = createContext(undefined);

const TOKEN_KEY = "ttm_token";
const USER_KEY = "ttm_user";

const persistSession = (response) => {
  window.localStorage.setItem(TOKEN_KEY, response.token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(response.user));
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_KEY);
    const savedUser = window.localStorage.getItem(USER_KEY);

    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedToken) {
      authService
        .me()
        .then((currentUser) => {
          setUser(currentUser);
          window.localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        })
        .catch(() => {
          window.localStorage.removeItem(TOKEN_KEY);
          window.localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const refreshUser = async () => {
    const currentUser = await authService.me();
    setUser(currentUser);
    window.localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
  };

  const login = async (payload) => {
    const response = await authService.login(payload);
    persistSession(response);
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const register = async (payload) => {
    const response = await authService.register(payload);
    persistSession(response);
    setToken(response.token);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, refreshUser }),
    [user, token, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
