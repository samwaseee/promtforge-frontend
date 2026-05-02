"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define what the context looks like
const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check localStorage exactly ONCE when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("promptforge_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // Done checking
  }, []);

  // A global logout function you can call from anywhere
  const logout = () => {
    localStorage.removeItem("promptforge_token");
    localStorage.removeItem("promptforge_user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// A custom hook so your Navbar can easily grab the data
export const useAuth = () => useContext(AuthContext);