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

    const snapshot = await adminDb
      .collection("orders")
      .where("customerId", "==", session.uid)
      .get();

    const orders = snapshot.docs
      .map(doc => doc.data() as Order)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return { success: true, orders };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
