import { NextResponse } from "next/server";
import { createPaymentInvoice } from "@/services/paymentService";

export async function GET() {
  try {
    const testOrderId = `TEST-${Date.now()}`;
    const paymentData = await createPaymentInvoice(testOrderId, 0.01, "USD");

    return NextResponse.json({
      success: true,
      paymentData,
    });
  } catch (error: any) {
    console.error("[QuickTest API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate test invoice" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const testOrderId = `TEST-${Date.now()}`;
    const paymentData = await createPaymentInvoice(testOrderId, 0.01, "USD");

    return NextResponse.json({
      success: true,
      paymentData,
    });
  } catch (error: any) {
    console.error("[QuickTest API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate test invoice" },
      { status: 500 }
    );
  }
}
