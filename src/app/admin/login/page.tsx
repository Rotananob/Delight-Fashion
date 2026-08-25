"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase/client";
import { createSessionAction } from "@/app/actions/authActions";
import { Button } from "@/components/ui/Button";
import { Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      const sessionResult = await createSessionAction(token);
      
      if (sessionResult.success) {
        // Force refresh to apply server-side session checks in the layout
        window.location.href = "/admin/dashboard";
      } else {
        setError(sessionResult.error || "Failed to create session");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-sm p-8 flex flex-col gap-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0"></div>
        
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.jpg" alt="Delight Fashion" className="w-16 h-16 rounded-full border border-[#D4AF37]/30" />
          <h1 className="text-2xl font-bold uppercase tracking-widest text-white text-center">
            Admin <span className="text-[#D4AF37]">Login</span>
          </h1>
          <p className="text-white/50 text-sm text-center">
            Authorized personnel only. Secure dashboard access.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-sm text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm py-3 pl-11 pr-4 text-white outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="admin@delightfashion.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-white/50 font-bold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm py-3 pl-11 pr-4 text-white outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" variant="gold" className="w-full mt-2 py-3" isLoading={isLoading}>
            Secure Login
          </Button>
        </form>

        <div className="flex items-center justify-center mt-4">
          <Link href="/" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors flex items-center gap-1 uppercase tracking-wider">
            &larr; Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
