"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "./AuthContext";
import { Crown, Mail, Lock, ShieldCheck, UserCheck, LogOut } from "lucide-react";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, loginWithGoogle, loginWithEmail, logout, toggleMockUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await loginWithEmail(email, password);
    setIsSubmitting(false);
    onClose();
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    await loginWithGoogle();
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ACCOUNT ACCESS" maxWidth="md">
      <div className="flex flex-col gap-6">
        {/* Current Status Box */}
        {user ? (
          <div className="p-4 rounded-sm bg-[#171717] border border-[#D4AF37]/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">
                Current Active Session
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm bg-[#D4AF37]/20 text-[#D4AF37]">
                {user.role}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#0A0A0A] font-bold flex items-center justify-center">
                {user.displayName.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white">
                  {user.displayName}
                </span>
                <span className="text-xs text-white/50">{user.email}</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full mt-2"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            {/* Google OAuth Login Button */}
            <Button
              variant="secondary"
              size="md"
              isLoading={isSubmitting}
              onClick={handleGoogleLogin}
              className="w-full font-bold"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
              Continue with Google (Phnom Penh)
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-white/40 text-xs uppercase tracking-widest">
                or email sign in
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
              />
              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <Button
                type="submit"
                variant="gold"
                size="md"
                isLoading={isSubmitting}
                className="w-full mt-2 font-bold"
              >
                Sign In to Account
              </Button>
            </form>
          </>
        )}

        {/* Dev / Demo Switcher (As requested by user: mock first) */}
        <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>Dev / Demo Quick Switch (Mock Auth)</span>
          </div>
          <p className="text-[11px] text-white/50">
            Easily test both storefront and admin roles without API keys:
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                toggleMockUser("customer");
                onClose();
              }}
              className="px-3 py-2 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/90 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer Role</span>
            </button>

            <button
              type="button"
              onClick={() => {
                toggleMockUser("admin");
                onClose();
              }}
              className="px-3 py-2 rounded-sm bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs text-[#D4AF37] font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Shop Owner (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
