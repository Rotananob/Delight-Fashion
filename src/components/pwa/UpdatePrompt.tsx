"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Listen for the controllerchange event, which fires when a new service worker
      // takes control of the page (e.g., after an update with skipWaiting).
      const handleControllerChange = () => {
        setShowPrompt(true);
      };

      navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

      return () => {
        navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
      };
    }
  }, []);

  const handleUpdate = () => {
    // Reload the page to load the new assets
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm"
        >
          <div className="bg-white/95 backdrop-blur-xl border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] rounded-lg p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#D4AF37]/20 p-2 rounded-full">
                  <Download className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-foreground font-medium text-sm">Update Available</h3>
                  <p className="text-foreground/60 text-xs mt-0.5 font-khmer">មានកំណែទម្រង់ថ្មី! សូមធ្វើបច្ចុប្បន្នភាព។</p>
                </div>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-foreground/40 hover:text-foreground transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex gap-2 mt-1">
              <Button 
                variant="gold" 
                size="sm" 
                className="w-full font-khmer text-xs py-2"
                onClick={handleUpdate}
              >
                ធ្វើបច្ចុប្បន្នភាពឥឡូវនេះ (Update Now)
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
