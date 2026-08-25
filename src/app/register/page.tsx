"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StorefrontLayoutShell } from "@/components/storefront/StorefrontLayoutShell";
import { useAuth } from "@/features/auth/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const { user, registerWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      await registerWithEmail(email, password);
      router.push("/profile");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      await loginWithGoogle();
      router.push("/profile");
    } catch (err: unknown) {
      setError("Google authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StorefrontLayoutShell>
      <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-[#111] p-8 rounded-sm border border-white/10 shadow-2xl relative">
          
          <div className="flex flex-col items-center">
            <Image 
              src="/logo.jpg" 
              alt="Delight Fashion Logo" 
              width={60}
              height={60}
              className="w-16 h-16 object-contain rounded-full border border-[#D4AF37]/30 mb-4" 
            />
            <h2 className="text-center text-3xl font-bold tracking-widest text-white uppercase font-sans">
              CREATE <span className="text-[#D4AF37]">ACCOUNT</span>
            </h2>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-sm text-xs text-center">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
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
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold tracking-widest"
            >
              CREATE ACCOUNT
            </Button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-white/40 text-xs uppercase tracking-widest">
              OR
            </span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <Button
            variant="secondary"
            size="lg"
            isLoading={isSubmitting}
            onClick={handleGoogleLogin}
            className="w-full font-bold flex items-center justify-center gap-2 hover:bg-white/10"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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

          <div className="pt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-[#D4AF37] uppercase tracking-wider transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </StorefrontLayoutShell>
  );
}
