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

export async function getAdminDashboardStatsAction() {
  try {
    await verifyAdmin();

    // 1. Fetch Orders
    const ordersSnap = await adminDb.collection("orders").get();
    const orders = ordersSnap.docs
      .map(d => ({ id: d.id, ...d.data() as any }))
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    // 2. Fetch Products
    const productsSnap = await adminDb.collection("products").get();
    let products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
    if (products.length === 0) {
      const { MOCK_PRODUCTS } = await import("@/services/mock/products");
      products = [...MOCK_PRODUCTS];
    }

    // 3. Fetch Users
    let userCount = 1;
    try {
      const usersSnap = await adminDb.collection("users").get();
      userCount = Math.max(usersSnap.size, 1);
    } catch {}

    const lowStock = products.filter(p => {
      const stock = p.totalStock !== undefined ? p.totalStock : (p.stock || 0);
      return Number(stock) < 15;
    });

    // 4. Generate 7-day sales breakdown
    const now = new Date();
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setDate(now.getDate() - i);
      const dateStr = targetDate.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

      const daySales = orders.filter((o: any) => {
        if (!o.createdAt) return false;
        const oDate = new Date(o.createdAt);
        return oDate.toLocaleDateString("en-US", { month: "short", day: "2-digit" }) === dateStr;
      }).reduce((sum: number, o: any) => sum + (Number(o.totalAmount || o.total || 0)), 0);

      chartData.push({ name: dateStr, sales: daySales });
    }

    // Today's stats
    const todayStr = now.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    const todayOrders = orders.filter((o: any) => {
      if (!o.createdAt) return false;
      const oDate = new Date(o.createdAt);
      return oDate.toLocaleDateString("en-US", { month: "short", day: "2-digit" }) === todayStr;
    });
    const todaySales = todayOrders.reduce((sum: number, o: any) => sum + (Number(o.totalAmount || o.total || 0)), 0);

    return {
      success: true,
      stats: {
        todaySales,
        newOrders: todayOrders.length,
        activeUsers: userCount,
      },
      salesData: chartData,
      recentOrders: orders.slice(0, 8),
      lowStock,
    };
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return { success: false, error: error.message };
  }
}
