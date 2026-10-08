import { NextRequest, NextResponse } from "next/server";
import { verifyTransactionStatus } from "@/services/paymentService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId, tranId, clientId, token, cookie } = body;

    if (!orderId || !tranId) {
      return NextResponse.json(
        { success: false, paid: false, error: "Missing orderId or tranId" },
        { status: 400 }
      );
    }

    const result = await verifyTransactionStatus(
      orderId,
      tranId,
      clientId,
      token,
      cookie
    );

    return NextResponse.json({
      success: true,
      paid: result.paid,
      status: result.status,
      isOfflineTranId: result.isOfflineTranId,
      rateLimited: result.rateLimited,
    });
  } catch (error: any) {
    console.error("[/api/payway/check-status POST Error]:", error);
    return NextResponse.json(
      {
        success: false,
        paid: false,
        error: error.message || "Failed to verify transaction status",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const tranId = searchParams.get("tranId");
    const clientId = searchParams.get("clientId") || undefined;
    const token = searchParams.get("token") || undefined;
    const cookie = searchParams.get("cookie") || undefined;

    if (!orderId || !tranId) {
      return NextResponse.json(
        { success: false, paid: false, error: "Missing orderId or tranId parameters" },
        { status: 400 }
      );
    }

    const result = await verifyTransactionStatus(
      orderId,
      tranId,
      clientId,
      token,
      cookie
    );

    return NextResponse.json({
      success: true,
      paid: result.paid,
      status: result.status,
      isOfflineTranId: result.isOfflineTranId,
      rateLimited: result.rateLimited,
    });
  } catch (error: any) {
    console.error("[/api/payway/check-status GET Error]:", error);
    return NextResponse.json(
      {
        success: false,
        paid: false,
        error: error.message || "Failed to verify transaction status",
      },
      { status: 500 }
    );
  }
}
