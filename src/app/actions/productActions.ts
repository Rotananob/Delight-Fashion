"use server";

import "server-only";
import { getSessionServer } from "./authActions";
import { adminDb } from "@/services/firebase/admin";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";

const verifyAdmin = async () => {
  const isMockMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("mock");
  if (isMockMode) return true; // Bypass strictly for UI development

  const session = await getSessionServer();
  if (!session || session.admin !== true) {
    throw new Error("Unauthorized: Admin credentials required.");
  }
  return true;
};

export async function createProductAction(productData: Omit<Product, "id" | "createdAt">) {
  try {
    await verifyAdmin();

    const newDocRef = adminDb.collection("products").doc();
    const newProduct: Product = {
      ...productData,
      id: newDocRef.id,
      createdAt: new Date().toISOString(),
    };

    await newDocRef.set(newProduct);
    
    // Purge cache so storefront updates
    revalidatePath("/products");
    revalidatePath("/");
    
    return { success: true, productId: newDocRef.id };
  } catch (error: any) {
    console.error("Create Product Error:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProductAction(productId: string, updates: Partial<Product>) {
  try {
    await verifyAdmin();

    const docRef = adminDb.collection("products").doc(productId);
    await docRef.update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/products");
    revalidatePath(`/products/${updates.slug || ""}`);
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    console.error("Update Product Error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    await verifyAdmin();

    await adminDb.collection("products").doc(productId).delete();

    revalidatePath("/products");
    revalidatePath("/");
    
    return { success: true };
  } catch (error: any) {
    console.error("Delete Product Error:", error);
    return { success: false, error: error.message };
  }
}
