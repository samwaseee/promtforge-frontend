"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("promptforge_token");
      if (token) {
        try {
          const userData = await apiClient.get('/api/users/me', true);
          setUser(userData);
          // ✨ FIX 1: Keep localStorage synced on page refresh
          localStorage.setItem("promptforge_user", JSON.stringify(userData)); 
        } catch (error) {
          console.error("Invalid token", error);
          localStorage.removeItem("promptforge_token");
          localStorage.removeItem("promptforge_user"); // ✨ Clear this too
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: any) => {
    localStorage.setItem("promptforge_token", token); 
    // ✨ FIX 2: Save the user to localStorage so DashboardLayout can see it!
    localStorage.setItem("promptforge_user", JSON.stringify(userData)); 
    setUser(userData); 
  };

  const logout = () => {
    localStorage.removeItem("promptforge_token");
    // ✨ FIX 3: Remove the user from localStorage on logout
    localStorage.removeItem("promptforge_user"); 
    setUser(null); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);