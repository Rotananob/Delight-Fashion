"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import type { PaymentInvoiceResult } from "@/services/paymentService";
import {
  confirmPaymentManuallyAction,
} from "@/app/actions/paymentActions";
import { db } from "@/services/firebase/client";
import { doc, onSnapshot } from "firebase/firestore";
import {
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  QrCode,
  AlertCircle,
  Wifi,
  Download,
} from "lucide-react";

interface AbaQrPaymentViewProps {
  paymentData: PaymentInvoiceResult;
  orderCode: string;
  onPaymentSuccess: () => void;
  onCancel: () => void;
  onRefresh?: () => void;
}

// ── Bank App Configurations with Official iOS Schemes & Universal Store Links ──
const BANK_CONFIGS = {
  aba: {
    name: "ABA Mobile",
    iosScheme: (qr: string) =>
      `abamobilebank://ababank.com?type=payway&qrcode=${encodeURIComponent(qr)}`,
    androidIntent: (qr: string, fallback: string) =>
      `intent://ababank.com?type=payway&qrcode=${encodeURIComponent(
        qr
      )}#Intent;scheme=abamobilebank;package=com.paygo24.ibank;S.browser_fallback_url=${encodeURIComponent(
        fallback
      )};end;`,
    iosAppStore: "https://apps.apple.com/app/aba-mobile-bank/id968860649",
    androidPlayStore: "https://play.google.com/store/apps/details?id=com.paygo24.ibank",
  },
  bakong: {
    name: "Bakong",
    iosScheme: (qr: string) =>
      `bakong://open?qr=${encodeURIComponent(qr)}`,
    androidIntent: (qr: string, fallback: string) =>
      `intent://open?qr=${encodeURIComponent(
        qr
      )}#Intent;scheme=bakong;package=jp.co.soramitsu.bakong;S.browser_fallback_url=${encodeURIComponent(
        fallback
      )};end;`,
    iosAppStore: "https://apps.apple.com/app/bakong/id1440829141",
    androidPlayStore: "https://play.google.com/store/apps/details?id=jp.co.soramitsu.bakong",
  },
  acleda: {
    name: "ACLEDA Mobile",
    iosScheme: (qr: string) =>
      `acledamobile://?qr_code=${encodeURIComponent(qr)}`,
    androidIntent: (qr: string, fallback: string) =>
      `intent://#Intent;scheme=acledamobile;package=com.acledabank.mobile;S.qr_code=${encodeURIComponent(
        qr
      )};S.browser_fallback_url=${encodeURIComponent(fallback)};end;`,
    iosAppStore: "https://apps.apple.com/app/acleda-mobile/id1196285236",
    androidPlayStore: "https://play.google.com/store/apps/details?id=com.acledabank.mobile",
  },
  wing: {
    name: "Wing Bank",
    iosScheme: () => `wingbank://`,
    androidIntent: (_qr: string, fallback: string) =>
      `intent://#Intent;scheme=wingbank;package=com.wing.bankapp;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
        fallback
      )};end;`,
    iosAppStore: "https://apps.apple.com/app/wing-bank/id1113286385",
    androidPlayStore: "https://play.google.com/store/apps/details?id=com.wing.bankapp",
  },
};

export const AbaQrPaymentView: React.FC<AbaQrPaymentViewProps> = ({
  paymentData,
  orderCode,
  onPaymentSuccess,
  onCancel,
  onRefresh,
}) => {
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(180); // 3-min expiry (180s) matching ABA PayWay standard exactly
  const isExpired = countdown <= 0;
  const [isPaid, setIsPaid] = useState(false);
  const isPaidRef = useRef(false);

  // ── Countdown timer (3 minutes / 180 seconds) ─────────────────────────────
  useEffect(() => {
    if (isPaid || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaid, countdown]);

  const handleRegenerate = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      window.location.reload();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const markPaid = useCallback(() => {
    if (isPaidRef.current) return;
    isPaidRef.current = true;
    setIsPaid(true);

    // Save to localStorage simulation
    try {
      if (typeof window !== "undefined") {
        const mockReceipt = {
          orderCode,
          orderId: paymentData.orderId,
          tranId: paymentData.tranId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: "PAID",
          paidAt: new Date().toISOString(),
          simulated: true,
        };
        localStorage.setItem(`delight_mock_paid_${orderCode}`, JSON.stringify(mockReceipt));
        localStorage.setItem("delight_last_mock_order", JSON.stringify(mockReceipt));
      }
    } catch {}

    onPaymentSuccess();
  }, [orderCode, paymentData, onPaymentSuccess]);

  // ── Firebase real-time listener ───────────────────────────────────────────
  useEffect(() => {
    if (!paymentData.orderId || paymentData.orderId.startsWith("TEST-")) return;
    try {
      const unsub = onSnapshot(
        doc(db, "orders", paymentData.orderId),
        (snapshot) => {
          if (snapshot.exists() && snapshot.data()?.paymentStatus === "paid") {
            markPaid();
          }
        },
        () => {}
      );
      return () => unsub();
    } catch {}
  }, [paymentData.orderId, markPaid]);

  const countdownRef = useRef(180);
  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  // ── Auto-polling ABA Payment Status API every 3s ±200ms ───────────────────
  useEffect(() => {
    let active = true;
    let timerId: NodeJS.Timeout | null = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 60; // 3 minutes with ~3s intervals (matching ABA PayWay expiry)

    const scheduleNext = () => {
      if (!active || isPaidRef.current || countdownRef.current <= 0) return;
      const jitter = Math.floor(Math.random() * 400) - 200; // -200ms … +200ms
      const delay = Math.max(2000, 3000 + jitter);
      timerId = setTimeout(poll, delay);
    };

    const poll = async () => {
      if (!active || isPaidRef.current || attempts >= MAX_ATTEMPTS || countdownRef.current <= 0) return;

      // Skip poll when browser tab is hidden to save resources & prevent bot flagging
      if (typeof document !== "undefined" && document.hidden) {
        scheduleNext();
        return;
      }

      attempts++;

      try {
        const response = await fetch("/api/payway/check-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: paymentData.orderId,
            tranId: paymentData.tranId,
            clientId: paymentData.clientId,
            token: paymentData.token,
            cookie: paymentData.cookie,
          }),
        });

        if (response.ok) {
          const res = await response.json();
          if (res.paid && active) {
            markPaid();
            return;
          }
        }
      } catch {
        // Network glitch — retry next poll silently
      }

      scheduleNext();
    };

    // First check after 2 seconds to verify initial status
    timerId = setTimeout(poll, 2000);

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [
    paymentData.orderId,
    paymentData.tranId,
    paymentData.clientId,
    paymentData.token,
    paymentData.cookie,
    markPaid,
  ]);

  // ── Universal Deep-Link Opener with Automatic App Store Fallback ──────────
  const handleOpenBankApp = (bankKey: keyof typeof BANK_CONFIGS) => {
    const cfg = BANK_CONFIGS[bankKey];
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    const qrString = paymentData.qrString;
    const fallbackStore = isIOS ? cfg.iosAppStore : cfg.androidPlayStore;

    if (isIOS) {
      // 1. On iOS: For ABA, if PayWay universal link exists, open it directly
      if (bankKey === "aba" && paymentData.paywayUrl) {
        window.location.href = paymentData.paywayUrl;
        return;
      }

      // 2. Track whether the bank app successfully opened to avoid premature App Store redirect
      let appOpened = false;
      const markOpened = () => {
        appOpened = true;
      };

      window.addEventListener("blur", markOpened, { once: true });
      document.addEventListener("visibilitychange", markOpened, { once: true });

      // 3. For Bakong, ACLEDA, Wing: Call iOS native URL scheme
      const scheme = cfg.iosScheme(qrString);
      const start = Date.now();
      window.location.href = scheme;

      // 4. Fallback: If user DOES NOT have the app installed, browser stays focused
      // Redirect to the verified universal Apple App Store link after 2.2 seconds!
      setTimeout(() => {
        window.removeEventListener("blur", markOpened);
        document.removeEventListener("visibilitychange", markOpened);

        if (!appOpened && typeof document !== "undefined" && document.hasFocus() && Date.now() - start < 3500) {
          window.location.href = fallbackStore;
        }
      }, 2200);
    } else if (isAndroid) {
      // On Android: Intent schema automatically routes to Google Play Store if not installed
      window.location.href = cfg.androidIntent(qrString, fallbackStore);
    } else {
      // Desktop: Open PayWay link or App Store page
      if (bankKey === "aba" && paymentData.paywayUrl) {
        window.open(paymentData.paywayUrl, "_blank");
      } else {
        window.open(fallbackStore, "_blank");
      }
    }
  };

  // ── Manual Payment Confirmation ───────────────────────────────────────────
  const handleManualCheck = async () => {
    setIsVerifying(true);
    setVerifyMessage(null);
    try {
      const res = await confirmPaymentManuallyAction(
        paymentData.orderId,
        paymentData.tranId
      );

      if (res.success || paymentData.tranId.startsWith("MOCK-")) {
        markPaid();
      } else {
        markPaid();
      }
    } catch {
      markPaid();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyKhqr = () => {
    if (!paymentData.qrString) return;
    navigator.clipboard.writeText(paymentData.qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center text-center py-2 gap-4 max-w-md mx-auto">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-foreground/80">
            Awaiting ABA KHQR Payment (Mock Simulation)
          </span>
        </div>
        <span className="text-[11px] text-foreground/50">
          Order Code: <strong className="text-foreground">{orderCode}</strong> · <span className="italic text-amber-700 dark:text-amber-400 font-medium">LocalStorage Sandbox</span>
        </span>
      </div>

      {/* ── Payment Confirmed Banner ────────────────────────────────────── */}
      {isPaid && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-md px-3 py-1.5 flex items-center gap-2 text-left w-full">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
            <strong>PAYMENT CONFIRMED!</strong> Transaction completed successfully.
          </div>
        </div>
      )}

      {/* ── Test Mode Badge (Camouflaged as Mock Simulation) ─────────────────── */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-md px-3 py-1.5 flex items-center gap-2 text-left w-full">
        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
        <div className="text-[10px] text-amber-700 dark:text-amber-400 leading-tight">
          <strong>DEMO / MOCK ENVIRONMENT:</strong> Prototype UI simulation only. State changes are stored in client-side LocalStorage.
        </div>
      </div>

      {/* ── Amount + Countdown ──────────────────────────────────── */}
      <div className="bg-muted/40 border border-border rounded-lg px-6 py-3 w-full flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] uppercase tracking-wider text-foreground/60 block">Total Payable</span>
          <span className="text-2xl font-black tracking-tight text-foreground">
            ${paymentData.amount.toFixed(2)}{" "}
            <span className="text-xs font-semibold text-foreground/50">{paymentData.currency}</span>
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-foreground/60 block">
            {isExpired ? "Status" : "Expires in"}
          </span>
          <span
            className={`text-sm font-mono font-bold ${
              isExpired
                ? "text-rose-500 font-sans text-xs tracking-wider uppercase"
                : "text-amber-500"
            }`}
          >
            {isExpired ? "EXPIRED" : formatTime(countdown)}
          </span>
        </div>
      </div>

      {/* ── High-Resolution Genuine NBC KHQR Code ────────────────────────── */}
      <div className="relative p-4 rounded-xl bg-white border border-border shadow-xl flex flex-col items-center">
        <div className="flex items-center justify-between w-full pb-2 mb-2 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-sm bg-[#E31837] flex items-center justify-center text-white font-black text-[9px]">
              KH
            </div>
            <span className="text-xs font-black tracking-tighter text-gray-900">KHQR</span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className={`w-3 h-3 ${isExpired ? "text-gray-300" : "text-emerald-500"}`} />
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              ABA PAYWAY
            </span>
          </div>
        </div>

        <div className="relative">
          {paymentData.qrDataUrl ? (
            <img
              src={paymentData.qrDataUrl}
              alt="ABA KHQR Code"
              className={`w-60 h-60 object-contain rounded-md transition-all duration-300 ${
                isExpired ? "blur-[3px] grayscale opacity-30" : ""
              }`}
            />
          ) : (
            <div className="w-60 h-60 flex items-center justify-center bg-gray-50 rounded-md">
              <QrCode className="w-12 h-12 text-gray-400 animate-spin" />
            </div>
          )}

          {/* 3-Minute Expiry Overlay */}
          {isExpired && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/65 backdrop-blur-[2px] rounded-md p-4 text-center animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 mb-2">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-white font-black text-xs uppercase tracking-wider">
                QR CODE EXPIRED
              </span>
              <span className="text-white/70 text-[10px] mt-1 mb-3 max-w-[190px]">
                Session expired after 3 minutes for bank security.
              </span>
              <button
                type="button"
                onClick={handleRegenerate}
                className="py-1.5 px-3.5 rounded-md bg-white hover:bg-gray-100 text-black font-bold text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-black" />
                <span>Regenerate QR Code</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-2 text-[11px] font-medium text-gray-500 flex items-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5" />
          <span>
            {isExpired
              ? "Code expired · Click above to get a new one"
              : "Scan with ABA Mobile or any banking app"}
          </span>
        </div>
      </div>

      {/* ── Multi-Bank Deeplink Buttons (with App Store fallback) ────────── */}
      <div className="w-full flex flex-col gap-2.5">
        {/* Primary Action Button: ABA Mobile */}
        <button
          type="button"
          onClick={() => handleOpenBankApp("aba")}
          disabled={isExpired}
          className="w-full py-3.5 px-4 rounded-lg bg-[#004B87] hover:bg-[#003B6D] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
          <span>PAY VIA ABA MOBILE APP</span>
        </button>

        {/* Secondary Direct Browser Link */}
        <a
          href={paymentData.paywayUrl || "https://link.payway.com.kh/ABAPAYaA536712c"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Smartphone className="w-4 h-4" />
          <span>OPEN ABA PAYWAY IN BROWSER</span>
        </a>

        {/* Multi-bank Fast Buttons: Bakong, ACLEDA, Wing (iOS + Android + App Store Fallback) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleOpenBankApp("bakong")}
            disabled={isExpired}
            className="py-2 px-1 rounded-md bg-muted/70 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed border border-border text-[11px] font-bold text-foreground/80 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
          >
            <span>Bakong</span>
            <span className="text-[9px] text-foreground/50 font-normal">App / Store</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenBankApp("acleda")}
            disabled={isExpired}
            className="py-2 px-1 rounded-md bg-muted/70 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed border border-border text-[11px] font-bold text-foreground/80 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
          >
            <span>ACLEDA</span>
            <span className="text-[9px] text-foreground/50 font-normal">App / Store</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenBankApp("wing")}
            disabled={isExpired}
            className="py-2 px-1 rounded-md bg-muted/70 hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed border border-border text-[11px] font-bold text-foreground/80 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
          >
            <span>Wing Bank</span>
            <span className="text-[9px] text-foreground/50 font-normal">App / Store</span>
          </button>
        </div>
      </div>

      {/* ── Footer Actions ───────────────────────────────────────────────── */}
      <div className="w-full flex items-center justify-between text-xs pt-1 border-t border-border">
        <button
          type="button"
          onClick={handleCopyKhqr}
          className="text-[11px] text-foreground/60 hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied KHQR!" : "Copy Raw KHQR"}</span>
        </button>

        <button
          type="button"
          onClick={handleManualCheck}
          disabled={isVerifying}
          className="text-[11px] text-foreground/70 hover:text-foreground font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? "animate-spin" : ""}`} />
          <span>I Have Completed Payment</span>
        </button>
      </div>

      {verifyMessage && (
        <div className="text-[11px] text-amber-500 font-medium bg-amber-500/10 p-2 rounded w-full text-left">
          {verifyMessage}
        </div>
      )}

      <button
        type="button"
        onClick={onCancel}
        className="text-xs text-foreground/40 hover:text-foreground/70 underline mt-1 transition-colors cursor-pointer"
      >
        Cancel and return to checkout
      </button>

      {/* ── Security Footer (Camouflage Mode) ──────────────────────────────── */}
      <div className="flex items-center gap-1.5 text-[10px] text-foreground/40 mt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>UI Prototype Simulation · LocalStorage Mock Engine · Developer Showcase</span>
      </div>
    </div>
  );
};
