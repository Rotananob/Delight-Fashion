"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service (e.g., Sentry, Firebase Crashlytics)
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white mb-4">
            Critical System Error
          </h1>
          <p className="text-white/60 max-w-md mx-auto mb-8 text-sm">
            We apologize, but a critical error has occurred. Our technical team has been notified. 
            Please try refreshing the page or return to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={() => reset()}
              className="flex items-center gap-2 bg-[#D4AF37] text-black px-6 py-3 rounded-sm font-bold uppercase tracking-wider hover:bg-[#F3E5AB] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 border border-white/20 rounded-sm font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>
          
          {process.env.NODE_ENV === "development" && (
            <div className="mt-12 p-6 bg-black border border-rose-500/30 rounded-sm text-left max-w-2xl w-full overflow-auto">
              <p className="text-rose-500 font-mono text-sm font-bold mb-2">Developer Details:</p>
              <p className="text-rose-400 font-mono text-xs">{error.message}</p>
              <pre className="text-white/40 font-mono text-[10px] mt-4">{error.stack}</pre>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
