"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("fable_token");
    const savedUser = localStorage.getItem("fable_user");
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem("fable_token");
        localStorage.removeItem("fable_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem("fable_token", token);
    localStorage.setItem("fable_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await axios.post(`${API}/auth/register`, formData);
    const { token, user: userData } = res.data;
    localStorage.setItem("fable_token", token);
    localStorage.setItem("fable_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    return res.data;
  };

  const googleLogin = async ({ idToken, role }) => {
    const res = await axios.post(`${API}/auth/google`, { idToken, role });
    const { token, user: userData } = res.data;
    localStorage.setItem("fable_token", token);
    localStorage.setItem("fable_user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("fable_token");
    localStorage.removeItem("fable_user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("fable_user", JSON.stringify(updatedUser));
  };

  const isAdmin = user?.role === "admin";
  const isWriter = user?.role === "writer";
  const isUser = user?.role === "user";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout, updateUser, isAdmin, isWriter, isUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
