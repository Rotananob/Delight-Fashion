"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "./AuthContext";
import { Mail, Lock, UserCheck, LogOut } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail, logout } = useAuth();
  const { t } = useLanguage();
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      if (isLoginView) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError("Google authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? "MY ACCOUNT" : (isLoginView ? "SIGN IN" : "CREATE ACCOUNT")} maxWidth="md">
      <div className="flex flex-col gap-6 relative">
        
        {user ? (
          <div className="p-5 rounded-sm bg-white border border-gray-200 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black text-white font-bold flex items-center justify-center text-lg">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-black uppercase tracking-wide">
                  {user.displayName}
                </span>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                size="md"
                leftIcon={<UserCheck className="w-4 h-4" />}
                onClick={() => {
                  onClose();
                  window.location.href = "/profile";
                }}
                className="w-full justify-start pl-4 tracking-wide font-semibold"
              >
                ACCESS MY PROFILE
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<LogOut className="w-4 h-4" />}
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full justify-start pl-4 tracking-wide font-semibold"
              >
                SIGN OUT
              </Button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-sm text-xs text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4 text-gray-500" />}
              />
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-gray-500" />}
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
                className="w-full mt-2 font-bold tracking-wide"
              >
                {isLoginView ? "SIGN IN" : "CREATE ACCOUNT"}
              </Button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wide">
                OR
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Button
              variant="secondary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleGoogleLogin}
              className="w-full font-bold flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.92H1.27v3.15C3.32 21.49 7.4 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.57H1.27C.46 8.19 0 10.04 0 12c0 1.96.46 3.81 1.27 5.43l4.01-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.4 0 3.32 2.51 1.27 6.57l4.01 3.15c.95-2.82 3.6-4.97 6.72-4.97Z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-xs text-gray-500 hover:text-black uppercase tracking-wide transition-colors"
              >
                {isLoginView 
                  ? "Don't have an account? Register" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
