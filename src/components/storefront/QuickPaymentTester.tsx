"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { AbaQrPaymentView } from "@/components/storefront/AbaQrPaymentView";
import type { PaymentInvoiceResult } from "@/services/paymentService";
import { QrCode, Sparkles, Loader2 } from "lucide-react";

export const QuickPaymentTester: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentInvoiceResult | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOpenTest = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);
    setIsSuccess(false);

    try {
      const res = await fetch("/api/payment/quick-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.paymentData) {
        setPaymentData(data.paymentData);
        setIsOpen(true);
      } else {
        throw new Error(data.error || "Failed to initialize payment data");
      }
    } catch (err: any) {
      console.error("[QuickPaymentTester Error]:", err);
      setErrorMessage(err.message || "Failed to load payment");
    } finally {
      setLoading(false);
    }
  };

  // Quick Payment Tester: visible in production for real payment testing

  return (
    <>
      {/* Floating UI Button with Loading State */}
      <div className="fixed bottom-5 left-5 z-[9999]">
        <button
          type="button"
          onClick={handleOpenTest}
          disabled={loading}
          className="bg-black/95 hover:bg-black text-white border border-white/30 shadow-2xl rounded-full px-4 py-2.5 flex items-center gap-2 text-xs font-bold tracking-wide transition-all hover:scale-105 active:scale-95 backdrop-blur-md disabled:opacity-75 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <QrCode className="w-4 h-4 text-amber-400" />
            </>
          )}
          <span>{loading ? "GENERATING QR..." : "ABA QR TEST ($0.01)"}</span>
        </button>

        {errorMessage && (
          <div className="mt-1 bg-red-600 text-white text-[10px] px-2 py-1 rounded shadow max-w-[200px]">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Small UI Modal */}
      {isOpen && paymentData && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={isSuccess ? "PAYMENT SUCCESSFUL" : "ABA KHQR TEST ($0.01)"}
          maxWidth="md"
        >
          {isSuccess ? (
            <div className="flex flex-col items-center py-8 gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-foreground">
                $0.01 Real Payment Confirmed!
              </h3>
              <p className="text-xs text-foreground/60 max-w-xs">
                Transaction Ref:{" "}
                <code className="font-mono text-emerald-500">
                  {paymentData.tranId}
                </code>
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="mt-2 px-6 py-2 rounded-md bg-black text-white text-xs font-bold"
              >
                CLOSE
              </button>
            </div>
          ) : (
            <AbaQrPaymentView
              paymentData={paymentData}
              orderCode="TEST-001"
              onPaymentSuccess={() => setIsSuccess(true)}
              onCancel={() => setIsOpen(false)}
              onRefresh={handleOpenTest}
            />
          )}
        </Modal>
      )}
    </>
  );
};
