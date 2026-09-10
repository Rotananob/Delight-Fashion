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
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { user, loginWithEmail, loginWithGoogle } = useAuth();
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
      await loginWithEmail(email, password);
      router.push("/profile");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Authentication failed. Please try again.");
      } else {
        setError("Authentication failed. Please try again.");
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
      <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-md w-full z-10"
        >
          {/* Card */}
          <div className="space-y-8 bg-white p-8 sm:p-10 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">

            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Image 
                  src="/logo.jpg" 
                  alt="Delight Fashion Logo" 
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain rounded-full border-2 border-gray-200 mb-6" 
                />
              </motion.div>
              <h2 className="text-center text-3xl font-bold tracking-wide text-black uppercase font-sans mb-1">
                SIGN <span className="text-black">IN</span>
              </h2>
              <p className="text-gray-500 text-sm font-khmer">ចូលគណនីរបស់អ្នក</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-lg text-sm text-center font-khmer"
              >
                {error}
              </motion.div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <Input
                  label="Email Address / អ៊ីមែល"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-5 h-5 text-gray-500" />}
                />
                <Input
                  label="Password / ពាក្យសម្ងាត់"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  leftIcon={<Lock className="w-5 h-5 text-gray-500" />}
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full font-bold tracking-wide text-base sm:text-lg py-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  SIGN IN / ចូលគណនី
                </Button>
              </div>
            </form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-wide font-medium">
                OR
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Button
              variant="secondary"
              isLoading={isSubmitting}
              onClick={handleGoogleLogin}
              leftIcon={
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.92H1.27v3.15C3.32 21.49 7.4 24 12 24Z" />
                  <path fill="#FBBC05" d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.57H1.27C.46 8.19 0 10.04 0 12c0 1.96.46 3.81 1.27 5.43l4.01-3.15Z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.4 0 3.32 2.51 1.27 6.57l4.01 3.15c.95-2.82 3.6-4.97 6.72-4.97Z" />
                </svg>
              }
              className="w-full font-medium flex items-center justify-center bg-white hover:bg-gray-50 text-black border border-gray-200 text-sm sm:text-base py-3 sm:py-3.5 transition-all duration-300 shadow-sm rounded-lg"
            >
              Continue with Google
            </Button>

            <div className="pt-8 text-center">
              <Link
                href="/register"
                className="text-sm text-gray-500 hover:text-black uppercase tracking-wide transition-colors font-khmer flex items-center justify-center gap-2"
              >
                <span>Don't have an account?</span>
                <span className="font-bold underline underline-offset-4 decoration-gray-300 text-black">Register</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </StorefrontLayoutShell>
  );
}
