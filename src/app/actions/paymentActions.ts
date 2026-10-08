"use server";

import "server-only";
import { adminDb } from "@/services/firebase/admin";
import {
  createPaymentInvoice,
  verifyTransactionStatus,
  confirmPaymentManually,
  PaymentInvoiceResult,
} from "@/services/paymentService";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreatePaymentResponse {
  success: boolean;
  paymentData?: PaymentInvoiceResult;
  error?: string;
}

export interface CheckStatusResponse {
  success: boolean;
  paid: boolean;
  status?: string;
  isOfflineTranId?: boolean;
  rateLimited?: boolean;
  error?: string;
}

// ─── Create Invoice Action ────────────────────────────────────────────────────

export async function createPaymentAction(
  orderId: string,
  amount: number,
  currency: "USD" | "KHR" = "USD"
): Promise<CreatePaymentResponse> {
  try {
    if (!orderId) throw new Error("Order ID is required to generate payment invoice.");

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) throw new Error(`Order #${orderId} was not found.`);

    const invoice = await createPaymentInvoice(orderId, amount, currency);

    // Persist invoice to Firestore
    await orderRef.update({
      paymentDetails: {
        tranId:     invoice.tranId,
        qrString:   invoice.qrString,
        qrDataUrl:  invoice.qrDataUrl,
        deeplinks:  invoice.deeplinks,
        amount:     invoice.amount,
        currency:   invoice.currency,
        isTestMode: invoice.isTestMode,
        mode:       invoice.mode,
        status:     "pending",
        createdAt:  new Date().toISOString(),
        ...(invoice.clientId ? { clientId: invoice.clientId } : {}),
        ...(invoice.token ? { token: invoice.token } : {}),
        ...(invoice.cookie ? { cookie: invoice.cookie } : {}),
      },
      paymentStatus: "awaiting_payment",
    });

    return { success: true, paymentData: invoice };
  } catch (error: any) {
    console.error("[createPaymentAction] Error:", error);
    return { success: false, error: error.message || "Failed to initialize payment." };
  }
}

// ─── Check Status Action ──────────────────────────────────────────────────────

export async function checkPaymentStatusAction(
  orderId: string,
  tranId: string,
  clientId?: string,
  token?: string,
  cookie?: string
): Promise<CheckStatusResponse> {
  try {
    if (!orderId || !tranId) {
      return { success: false, paid: false, error: "Missing orderId or tranId" };
    }

    const result = await verifyTransactionStatus(orderId, tranId, clientId, token, cookie);

    return {
      success:         true,
      paid:            result.paid,
      status:          result.status,
      isOfflineTranId: result.isOfflineTranId,
      rateLimited:     result.rateLimited,
    };
  } catch (error: any) {
    console.error("[checkPaymentStatusAction] Error:", error);
    return { success: false, paid: false, error: error.message };
  }
}

// ─── Manual Payment Confirmation Action ───────────────────────────────────────

export async function confirmPaymentManuallyAction(
  orderId: string,
  tranId: string
): Promise<{ success: boolean; error?: string }> {
  return confirmPaymentManually(orderId, tranId);
}
