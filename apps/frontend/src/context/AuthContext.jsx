"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE =
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080";

  // Load token on startup
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("auth", JSON.stringify(data));
      return data;
    } else throw new Error(data.error || "Login failed");
  };

  const signup = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("auth", JSON.stringify(data));
      return data;
    } else throw new Error(data.error || "Signup failed");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
