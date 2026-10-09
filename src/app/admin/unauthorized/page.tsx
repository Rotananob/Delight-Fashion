"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthContext";

export default function AdminUnauthorizedPage() {
  const { user, logout } = useAuth();

  const handleSwitchAccount = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md bg-[#121212] border border-red-500/20 rounded-sm p-8 shadow-2xl flex flex-col items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/80"></div>
        
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold uppercase tracking-widest text-white">
            Access Restricted
          </h1>
          <p className="text-sm text-white/60">
            {user?.email ? (
              <>
                Signed in as <span className="text-white font-medium">{user.email}</span>. This account does not possess administrator credentials.
              </>
            ) : (
              "You must be an authorized store administrator to access this section."
            )}
          </p>
        </div>

        <div className="flex flex-col w-full gap-3 pt-2">
          <Button
            variant="gold"
            size="md"
            onClick={handleSwitchAccount}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="w-full"
          >
            Switch to Admin Account
          </Button>

          <Link href="/" className="w-full">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Return to Storefront
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
