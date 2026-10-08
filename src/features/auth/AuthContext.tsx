"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, UserProfile } from "@/types";
import { auth, db } from "@/services/firebase/client";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createSessionAction, clearSessionAction } from "@/app/actions/authActions";
import Cookies from "js-cookie";

export interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string) => Promise<void>;
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
  displayName: "Thoun Sotheara (Shop Owner)",
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

  // Check if we are running in Mock Mode (no real Firebase API Keys)
  const isMockMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "mock_api_key" || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("mock");

  useEffect(() => {
    if (isMockMode) {
      try {
        const stored = localStorage.getItem("delight_fashion_mock_user");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (stored === "admin") setUser(MOCK_ADMIN);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        else if (stored === "customer") setUser(MOCK_CUSTOMER);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        else setUser(null);
      } catch (e) {
        console.warn("Mock auth error:", e);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Real Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          // Fetch profile from Firestore
          const userDoc = await getDoc(doc(db, "users", fbUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data() as UserProfile);
          } else {
            // Fallback if sync hasn't completed yet
            setUser({
              id: fbUser.uid,
              email: fbUser.email || "",
              displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
              role: "customer",
              createdAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isMockMode]);

  const handleServerSession = async (fbUser: FirebaseUser) => {
    const idToken = await fbUser.getIdToken();
    const res = await createSessionAction(idToken);
    if (!res.success) {
      console.error("Failed to establish server session");
    } else {
      // Set a client-side indicator cookie (not secure, just for middleware routing)
      Cookies.set("delight_has_session", "true", { expires: 5 });
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 600));
      setUser(MOCK_CUSTOMER);
      localStorage.setItem("delight_fashion_mock_user", "customer");
      Cookies.set("delight_has_session", "true", { expires: 5 });
    } else {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await handleServerSession(result.user);
      } catch (error) {
        console.error("Google Auth Error:", error);
        throw error;
      }
    }
    setIsLoading(false);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 600));
      const role: UserRole = email.includes("admin") || email.includes("owner") ? "admin" : "customer";
      const selectedUser = role === "admin" ? MOCK_ADMIN : MOCK_CUSTOMER;
      setUser(selectedUser);
      localStorage.setItem("delight_fashion_mock_user", role);
      Cookies.set("delight_has_session", "true", { expires: 5 });
    } else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, pass);
        await handleServerSession(result.user);
      } catch (error) {
        console.error("Email Auth Error:", error);
        throw error;
      }
    }
    setIsLoading(false);
  };

  const registerWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 600));
      setUser(MOCK_CUSTOMER);
      localStorage.setItem("delight_fashion_mock_user", "customer");
      Cookies.set("delight_has_session", "true", { expires: 5 });
    } else {
      try {
        const result = await createUserWithEmailAndPassword(auth, email, pass);
        // Create initial profile in Firestore
        await setDoc(doc(db, "users", result.user.uid), {
          id: result.user.uid,
          email: result.user.email,
          displayName: result.user.email?.split("@")[0] || "User",
          role: "customer",
          createdAt: new Date().toISOString(),
        });
        await handleServerSession(result.user);
      } catch (error) {
        console.error("Register Error:", error);
        throw error;
      }
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    if (isMockMode) {
      await new Promise((r) => setTimeout(r, 300));
      setUser(null);
      localStorage.removeItem("delight_fashion_mock_user");
    } else {
      try {
        await firebaseSignOut(auth);
        await clearSessionAction();
      } catch (error) {
        console.error("Logout Error:", error);
      }
    }
    Cookies.remove("delight_has_session");
    setIsLoading(false);
  };

  const toggleMockUser = (role: UserRole | null) => {
    if (!isMockMode) return;
    if (!role) {
      setUser(null);
      localStorage.removeItem("delight_fashion_mock_user");
      Cookies.remove("delight_has_session");
    } else {
      const selected = role === "admin" ? MOCK_ADMIN : MOCK_CUSTOMER;
      setUser(selected);
      localStorage.setItem("delight_fashion_mock_user", role);
      Cookies.set("delight_has_session", "true", { expires: 5 });
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
        registerWithEmail,
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
