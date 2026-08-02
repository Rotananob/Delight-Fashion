"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserProfile } from "@/types";

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleMockUser: (role: UserRole | null) => void;
}

const MOCK_CUSTOMER: UserProfile = {
  id: "mock_customer_kh_001",
  email: "sokha.vong@gmail.com",
  displayName: "Sokha Vong",
  phone: "+855 12 345 678",
  role: "customer",
  savedAddresses: [
    {
      id: "addr_default_01",
      fullName: "Sokha Vong",
      phone: "012345678",
      addressLine1: "St 271, Sangkat Tumnop Teuk",
      district: "Chamkar Mon",
      city: "Phnom Penh",
      isDefault: true,
    },
  ],
  createdAt: new Date().toISOString(),
};

const MOCK_ADMIN: UserProfile = {
  id: "mock_admin_owner_001",
  email: "owner@delightfashion.com.kh",
  displayName: "Rotana (Shop Owner)",
  phone: "+855 12 999 888",
  role: "admin",
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with Mock Admin or Mock Customer from localStorage if present (fallback to null)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("delight_fashion_mock_user");
      if (stored === "admin") {
        setUser(MOCK_ADMIN);
      } else if (stored === "customer") {
        setUser(MOCK_CUSTOMER);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.warn("localStorage read error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    // Simulate network latency for mock auth
    await new Promise((r) => setTimeout(r, 600));
    setUser(MOCK_CUSTOMER);
    localStorage.setItem("delight_fashion_mock_user", "customer");
    setIsLoading(false);
  };

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const role: UserRole = email.includes("admin") || email.includes("owner") ? "admin" : "customer";
    const selectedUser = role === "admin" ? MOCK_ADMIN : MOCK_CUSTOMER;
    setUser(selectedUser);
    localStorage.setItem("delight_fashion_mock_user", role);
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setUser(null);
    localStorage.removeItem("delight_fashion_mock_user");
    setIsLoading(false);
  };

  const toggleMockUser = (role: UserRole | null) => {
    if (!role) {
      setUser(null);
      localStorage.removeItem("delight_fashion_mock_user");
    } else if (role === "admin") {
      setUser(MOCK_ADMIN);
      localStorage.setItem("delight_fashion_mock_user", "admin");
    } else {
      setUser(MOCK_CUSTOMER);
      localStorage.setItem("delight_fashion_mock_user", "customer");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        loginWithGoogle,
        loginWithEmail,
        logout,
        toggleMockUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
