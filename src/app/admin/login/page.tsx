"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/services/firebase/client";
import { createSessionAction } from "@/app/actions/authActions";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
        if (!sessionResult.isAdmin) {
          setError("Your account does not possess administrator rights. Please contact the owner.");
          return;
        }
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

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(true); // Force refresh token to get newly minted claims
      
      const sessionResult = await createSessionAction(token);

      if (sessionResult.success) {
        if (sessionResult.isAdmin) {
          window.location.href = "/admin/dashboard";
        } else {
          setError(
            `Signed in as ${result.user.email}, but this account is not registered as an administrator. Please sign in with the store owner Google account.`
          );
        }
      } else {
        setError(sessionResult.error || "Failed to create admin session");
      }
    } catch (err: any) {
      console.error("Admin Google Auth Error:", err);
      if (err.code === "auth/unauthorized-domain") {
        setError(
          `Firebase Error: This domain (${typeof window !== 'undefined' ? window.location.hostname : 'current domain'}) is not authorized in Firebase Console > Authentication > Settings > Authorized domains.`
        );
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup blocked by browser. Please allow popups for this site to sign in with Google.");
      } else if (err.code === "auth/popup-closed-by-user") {
        // User just closed popup, no error needed
      } else {
        setError(err.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-sm p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37] to-[#D4AF37]/0"></div>
        
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.jpg" alt="Delight Fashion" className="w-16 h-16 rounded-full border border-[#D4AF37]/30" />
          <h1 className="text-2xl font-bold uppercase tracking-widest text-white text-center">
            Admin <span className="text-[#D4AF37]">Portal</span>
          </h1>
          <p className="text-white/50 text-xs text-center">
            Secure management portal for Delight Fashion Boutique.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-300 p-3 rounded-sm text-xs text-left leading-relaxed">
            {error}
          </div>
        )}

        {/* 1-Click Google Sign In for Admin */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full bg-white hover:bg-neutral-100 text-neutral-900 font-semibold py-3 px-4 rounded-sm flex items-center justify-center gap-3 border border-neutral-300 transition-colors shadow-sm disabled:opacity-50 text-sm"
          >
            {isGoogleLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="h-[1px] bg-white/10 flex-1"></div>
            <span className="text-[10px] uppercase tracking-wider text-white/40">Or Admin Credentials</span>
            <div className="h-[1px] bg-white/10 flex-1"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="admin@delightfashion.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" variant="gold" className="w-full mt-2 py-2.5 text-xs font-bold uppercase tracking-wider" isLoading={isLoading} leftIcon={<ShieldCheck className="w-4 h-4" />}>
            Enter Dashboard
          </Button>
        </form>

        <div className="flex items-center justify-center mt-2 border-t border-white/10 pt-4">
          <Link href="/" className="text-xs text-white/50 hover:text-[#D4AF37] transition-colors flex items-center gap-1 uppercase tracking-wider">
            &larr; Back to Delight Fashion Store
          </Link>
        </div>
      </div>
    </div>
  );
}
