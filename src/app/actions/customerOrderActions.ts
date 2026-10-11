"use server";

import "server-only";
import { getSessionServer } from "./authActions";
import { adminDb } from "@/services/firebase/admin";
import { Order } from "@/types";

export async function getCustomerOrdersAction() {
  try {
    const session = await getSessionServer();
    if (!session?.uid) {
      throw new Error("Unauthorized: Please sign in");
    }

    const orderMap = new Map<string, Order>();

    // 1. Fetch by customerId
    const snapshotByUid = await adminDb
      .collection("orders")
      .where("customerId", "==", session.uid)
      .get();

    snapshotByUid.docs.forEach((doc) => {
      orderMap.set(doc.id, { id: doc.id, ...doc.data() } as Order);
    });

    // 2. Fetch by customerEmail if available
    if (session.email) {
      try {
        const snapshotByEmail = await adminDb
          .collection("orders")
          .where("customerEmail", "==", session.email.toLowerCase().trim())
          .get();

        snapshotByEmail.docs.forEach((doc) => {
          orderMap.set(doc.id, { id: doc.id, ...doc.data() } as Order);
        });
      } catch {}
    }

    const orders = Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );

    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
