"use server";

import "server-only";
import { getSessionAndUserServer } from "./authActions";
import { adminDb } from "@/services/firebase/admin";
import { Order, OrderStatus } from "@/types";
import { sendPushNotificationAction } from "./notificationActions";

async function verifyAdmin() {
  const isMockMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("mock");
  if (isMockMode) return true;

  const user = await getSessionAndUserServer();
  if (!user || !user.isAdmin) {
    throw new Error("Unauthorized: Admin credentials required.");
  }
}

export async function getAdminOrdersAction() {
  try {
    await verifyAdmin();

    const snapshot = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .get();

    const orders = snapshot.docs.map(doc => doc.data() as Order);
    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminOrderByIdAction(orderId: string) {
  try {
    await verifyAdmin();

    const doc = await adminDb.collection("orders").doc(orderId).get();
    if (!doc.exists) {
      throw new Error("Order not found");
    }

    return { success: true, order: doc.data() as Order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOrderStatusAction(orderId: string, newStatus: OrderStatus, note?: string) {
  try {
    await verifyAdmin();

    const orderRef = adminDb.collection("orders").doc(orderId);
    
    await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(orderRef);
      if (!doc.exists) {
        throw new Error("Order not found");
      }
      
      const data = doc.data() as Order;
      
      // Prevent redundant updates
      if (data.status === newStatus) return;
      
      const statusHistory = data.statusHistory || [];
      statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Order status updated to ${newStatus}`,
      });
      
      transaction.update(orderRef, { 
        status: newStatus,
        statusHistory 
      });
    });

    // Send push notification in the background
    const doc = await orderRef.get();
    const data = doc.data() as Order;
    
    if (data && data.customerId) {
      // Fire and forget, don't await so we don't slow down the response
      sendPushNotificationAction(
        data.customerId,
        `Order Update: ${newStatus}`,
        `Your order ${data.orderCode || ''} is now ${newStatus}. ${note ? `Note: ${note}` : ''}`
      ).catch(e => console.error("Failed to send push notification:", e));
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
