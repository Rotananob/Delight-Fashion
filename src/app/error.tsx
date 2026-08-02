"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Route segment error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
      </div>
      <h2 className="text-2xl font-bold uppercase tracking-widest text-white mb-4">
        Something went wrong
      </h2>
      <p className="text-white/60 max-w-md mx-auto mb-8 text-sm">
        We encountered an unexpected error while loading this section.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-sm font-semibold uppercase tracking-wider transition-colors border border-white/10"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}
