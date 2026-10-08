import { RotanaKhqr, buildBankDeeplinks } from "rotana-khqr-deeplink";
import QRCode from "qrcode";
import axios from "axios";
import crypto from "crypto";
import { adminDb } from "@/services/firebase/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentMode = "offline" | "online";

export interface PaymentInvoiceResult {
  tranId: string;
  orderId: string;
  amount: number;
  currency: "USD" | "KHR";
  isTestMode: boolean;
  mode: PaymentMode;
  qrString: string;
  qrDataUrl: string;
  deeplinks: {
    aba: string;
    wing: string;
    acleda: string;
    bakong: string;
  };
  paywayUrl?: string;
  clientId?: string;
  token?: string;
  cookie?: string;
}

export interface VerifyResult {
  paid: boolean;
  status: string;
  rateLimited?: boolean;
  isOfflineTranId?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Genuine NBC EMVCo KHQR merchant template for ABA PayWay (ABAPAYaA536712c).
 * Used as high-speed fallback if network is unreachable.
 */
const DEFAULT_BASE_KHQR =
  process.env.ABA_BASE_KHQR ||
  "00020101021230510016abaakhppxxx@abaa01151260428194431870208ABA Bank52048999530384054040.015802KH5925THOUN SOTHEARA ANALITEKIT6003N/A625568510010PAYWAY@ABA0115536712-3061550102090422413040301199670013179147146508201131794063465082672100170013F1BF016411FDA6804PLIK63042BD7";

export const PURE_MOCK_SIMULATION_MODE = true;

// ─── Invoice Creation (Pure Mock LocalStorage Simulation Engine) ─────────────

export async function createPaymentInvoice(
  orderId: string,
  actualAmount: number,
  currency: "USD" | "KHR" = "USD"
): Promise<PaymentInvoiceResult> {
  const isTestMode = process.env.NEXT_PUBLIC_PAYMENT_TEST_MODE === "true";
  const testAmount = parseFloat(process.env.NEXT_PUBLIC_TEST_AMOUNT_USD || "0.01");
  const effectiveAmount = isTestMode ? testAmount : actualAmount;

  const checkoutUrl =
    process.env.PAYWAY_CHECKOUT_URL || "https://link.payway.com.kh/ABAPAYaA536712c";

  let qrString = "";
  let tranId = "";
  let clientId = "";
  let token = "";
  let cookie = "";
  let deeplinks = { aba: "", wing: "", acleda: "", bakong: "" };
  let mode: PaymentMode = "offline";

  // 1. Pure Mock LocalStorage Simulation Mode (Zero Bank Calls)
  if (PURE_MOCK_SIMULATION_MODE) {
    tranId = `MOCK-LOCAL-${Date.now()}`;
    qrString = RotanaKhqr.mutateKhqr(DEFAULT_BASE_KHQR, effectiveAmount, currency);
    deeplinks = buildBankDeeplinks(qrString);
    mode = "offline";

    const qrDataUrl = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 340,
      color: { dark: "#0B0F19", light: "#FFFFFF" },
    });

    return {
      tranId,
      orderId,
      amount: effectiveAmount,
      currency,
      isTestMode: true,
      mode,
      qrString,
      qrDataUrl,
      deeplinks,
      paywayUrl: checkoutUrl,
    };
  }

  // 1. Direct Headless Handshake with ABA PayWay Switch
  if (checkoutUrl && checkoutUrl.startsWith("https://link.payway.com.kh/")) {
    try {
      const pageRes = await axios.get(checkoutUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        timeout: 12000,
      });

      const rawCookies = pageRes.headers["set-cookie"] || [];
      const cookieHeader = (Array.isArray(rawCookies) ? rawCookies : [rawCookies])
        .map((c: string) => c.split(";")[0])
        .join("; ");
      if (cookieHeader) {
        cookie = cookieHeader;
      }

      const html = pageRes.data;
      const abaDataMatch = html.match(/["']?aba_data["']?\s*[:=,]\s*["']([^"']+)["']/);
      const reqTimeMatch = html.match(/["']?request_time["']?\s*[:=,]\s*["']?(\d+)["']?/);

      if (abaDataMatch && reqTimeMatch) {
        const abaData = abaDataMatch[1].replace(/\\u002F/g, "/");
        const requestTime = reqTimeMatch[1];
        const amountStr = effectiveAmount.toFixed(2);
        const hashPayload = requestTime + abaData + JSON.stringify({ amount: amountStr });
        const hash = crypto.createHash("sha512").update(hashPayload, "utf8").digest("hex");

        const gatewayRes = await axios.post(
          "https://pwapp.ababank.com/api/pw-app/v1/payment/gateway/list-payment-options",
          {
            aba_data: abaData,
            additional_fields: JSON.stringify({ amount: amountStr }),
            hash,
            request_time: requestTime,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Origin: "https://link.payway.com.kh",
              Referer: checkoutUrl,
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
              ...(cookie ? { Cookie: cookie } : {}),
            },
            timeout: 12000,
          }
        );

        const gData = gatewayRes.data;
        if (gData?.qr_string) {
          qrString = gData.qr_string;
          tranId = gData.status?.tran_id || gData.tran_id;
          clientId = gData.client_id;
          token = gData.token;
          deeplinks = buildBankDeeplinks(qrString);
          mode = "online";
        }
      }
    } catch (err: any) {
      console.warn(
        `[PaymentService] Live ABA gateway handshake fallback: ${err.message}`
      );
    }
  }

  // 2. High-speed Offline EMVCo Mutator Fallback
  if (!qrString) {
    tranId = `DF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    qrString = RotanaKhqr.mutateKhqr(DEFAULT_BASE_KHQR, effectiveAmount, currency);
    deeplinks = buildBankDeeplinks(qrString);
    mode = "offline";
  }

  // 3. Render High-Resolution PNG QR Data URL
  const qrDataUrl = await QRCode.toDataURL(qrString, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 340,
    color: { dark: "#0B0F19", light: "#FFFFFF" },
  });

  return {
    tranId,
    orderId,
    amount: effectiveAmount,
    currency,
    isTestMode,
    mode,
    qrString,
    qrDataUrl,
    deeplinks,
    paywayUrl: checkoutUrl,
    clientId,
    token,
    cookie,
  };
}

// Memory map to simulate polling cycles for pure mock simulation mode
const mockPollCounters = new Map<string, number>();

// ─── Payment Status Auto-Verification (ABA Official Status API) ───────────────

export async function verifyTransactionStatus(
  orderId: string,
  tranId: string,
  clientId?: string,
  token?: string,
  cookie?: string
): Promise<VerifyResult> {
  // Check if order is already marked paid in Firestore
  try {
    if (orderId && !orderId.startsWith("TEST-")) {
      const orderDoc = await adminDb.collection("orders").doc(orderId).get();
      if (orderDoc.exists && orderDoc.data()?.paymentStatus === "paid") {
        return { paid: true, status: "PAID" };
      }
    }
  } catch {}

  // 0. Pure Mock LocalStorage Simulation Mode (Zero Bank Calls, Auto-Approve after 3 polls ~6-8s)
  if (PURE_MOCK_SIMULATION_MODE || tranId.startsWith("MOCK-")) {
    const polls = (mockPollCounters.get(tranId) || 0) + 1;
    mockPollCounters.set(tranId, polls);

    if (polls >= 3) {
      if (orderId && !orderId.startsWith("TEST-")) {
        try {
          await adminDb.collection("orders").doc(orderId).update({
            paymentStatus: "paid",
            status: "Confirmed",
            paidAt: new Date().toISOString(),
            "paymentDetails.status": "paid",
            "paymentDetails.confirmedAt": new Date().toISOString(),
            "paymentDetails.confirmedBy": "mock_auto_simulation",
          });
        } catch {}
      }
      return { paid: true, status: "PAID", isOfflineTranId: true };
    }

    return { paid: false, status: "PENDING", isOfflineTranId: true };
  }

  // If local offline reference
  if (tranId.startsWith("DF-") && !clientId) {
    return { paid: false, status: "OFFLINE_AWAITING_CONFIRM", isOfflineTranId: true };
  }

  // Query ABA Official Payment Link Status API
  if (tranId && clientId) {
    try {
      const t = Date.now().toString();
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let deviceId = "";
      for (let i = 0; i < 10; i++) deviceId += chars[Math.floor(Math.random() * chars.length)];

      const hashPayload = clientId + deviceId + t;
      const hash = crypto.createHash("sha512").update(hashPayload, "utf8").digest("hex");

      const payload = {
        client_id: clientId,
        device_id: deviceId,
        hash,
        request_time: t,
        tran_id: tranId,
      };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Origin: "https://link.payway.com.kh",
        Referer: "https://link.payway.com.kh/ABAPAYaA536712c",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      };

      if (token) {
        headers.token = token;
      }

      if (cookie) {
        headers.Cookie = cookie;
      }

      const res = await axios.post(
        "https://pwapp.ababank.com/api/pw-app/v1/payment-link/check-payment-status",
        payload,
        { headers, timeout: 8000 }
      );

      const resData = res.data;
      const action = resData?.data?.action?.toLowerCase();
      const statusText = resData?.data?.status?.toLowerCase() || action || "";

      const isPaid =
        resData?.status?.code === "00" &&
        (action === "approved" ||
          action === "paid" ||
          action === "completed" ||
          statusText === "approved" ||
          statusText === "paid");

      if (isPaid) {
        // Update Firestore database
        if (orderId && !orderId.startsWith("TEST-")) {
          await adminDb.collection("orders").doc(orderId).update({
            paymentStatus: "paid",
            status: "Confirmed",
            paidAt: new Date().toISOString(),
            "paymentDetails.status": "paid",
            "paymentDetails.confirmedAt": new Date().toISOString(),
            "paymentDetails.confirmedBy": "aba_auto_polling",
          });

          // Telegram Alert
          import("@/services/telegramService")
            .then(({ sendTelegramAlert }) => {
              sendTelegramAlert(
                "Orders",
                `🎉 <b>AUTO-PAYMENT VERIFIED!</b>\nOrder: #${orderId}\nTranID: ${tranId}\nStatus: APPROVED by ABA Bank Gateway`
              );
            })
            .catch(() => {});
        }

        return { paid: true, status: "PAID" };
      }

      return { paid: false, status: action || "PENDING" };
    } catch (err: any) {
      console.warn("[verifyTransactionStatus Error]:", err.message);
    }
  }

  return { paid: false, status: "PENDING" };
}

// ─── Manual Payment Confirmation ─────────────────────────────────────────────

export async function confirmPaymentManually(
  orderId: string,
  tranId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (orderId && !orderId.startsWith("TEST-")) {
      await adminDb.collection("orders").doc(orderId).update({
        paymentStatus: "paid",
        status: "Confirmed",
        paidAt: new Date().toISOString(),
        "paymentDetails.status": "paid",
        "paymentDetails.confirmedAt": new Date().toISOString(),
        "paymentDetails.confirmedBy": "user_manual",
      });

      // Non-blocking Telegram notification
      import("@/services/telegramService")
        .then(({ sendTelegramAlert }) => {
          sendTelegramAlert(
            "Orders",
            `💰 <b>PAYMENT CONFIRMED</b>\nOrder: #${orderId}\nRef: ${tranId}\nNote: Customer confirmed transfer via ABA PayWay KHQR`
          );
        })
        .catch(() => {});
    }

    return { success: true };
  } catch (err: any) {
    console.error("[PaymentService] confirmPaymentManually error:", err);
    return { success: false, error: err.message };
  }
}
