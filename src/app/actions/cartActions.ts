"use server";

import "server-only";
import { getSessionServer } from "./authActions";
import { adminDb } from "@/services/firebase/admin";
import { OrderItem } from "@/types";

/**
 * Fetch the user's saved cart from Firestore.
 */
export async function getCloudCartAction() {
  try {
    const session = await getSessionServer();
    if (!session?.uid) {
      return { success: false, error: "Unauthorized" };
    }

    // We store the cart as a single document to make syncing arrays easier
    // Path: users/{uid}/cart/data
    const cartDoc = await adminDb.collection("users").doc(session.uid).collection("cart").doc("data").get();
    
    if (!cartDoc.exists) {
      return { success: true, items: [] };
    }

    const data = cartDoc.data();
    return { success: true, items: (data?.items || []) as OrderItem[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Overwrite the user's cloud cart with the provided items.
 */
export async function syncCloudCartAction(items: OrderItem[]) {
  try {
    const session = await getSessionServer();
    if (!session?.uid) {
      return { success: false, error: "Unauthorized" };
    }

    const cartRef = adminDb.collection("users").doc(session.uid).collection("cart").doc("data");
    
    await cartRef.set({
      items,
      updatedAt: new Date().toISOString()
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
