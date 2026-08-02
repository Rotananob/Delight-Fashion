"use server";

import "server-only";
import { getSessionServer } from "./authActions";
import { adminDb } from "@/services/firebase/admin";
import { Category } from "@/types";

/**
 * Validates if the current session belongs to an Admin.
 */
async function verifyAdmin() {
  const session = await getSessionServer();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized: Admin access required.");
  }
}

export async function getCategoriesAction() {
  try {
    const snapshot = await adminDb.collection("categories").orderBy("orderIndex", "asc").get();
    const categories = snapshot.docs.map(doc => doc.data() as Category);
    return { success: true, categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createCategoryAction(data: Omit<Category, "id">) {
  try {
    await verifyAdmin();
    
    // We use the slug as the document ID for cleaner URLs and uniqueness
    if (!data.slug) throw new Error("Slug is required.");
    
    const docRef = adminDb.collection("categories").doc(data.slug);
    const existing = await docRef.get();
    
    if (existing.exists) {
      throw new Error("A category with this slug already exists.");
    }

    const newCategory: Category = {
      id: data.slug,
      ...data
    };

    await docRef.set(newCategory);
    return { success: true, category: newCategory };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateCategoryAction(id: string, data: Partial<Category>) {
  try {
    await verifyAdmin();
    
    const docRef = adminDb.collection("categories").doc(id);
    const existing = await docRef.get();
    
    if (!existing.exists) {
      throw new Error("Category not found.");
    }

    // Don't allow changing the ID/Slug through update (would require delete + create)
    const { id: _, slug, ...updateData } = data as any;

    await docRef.update(updateData);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await verifyAdmin();
    
    // In a real app, you might want to check if products exist for this category first
    // For MVP, we allow deletion directly.
    await adminDb.collection("categories").doc(id).delete();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
