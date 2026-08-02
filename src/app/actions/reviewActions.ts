"use server";

import "server-only";
import { getSessionServer } from "./authActions";
import { adminDb } from "@/services/firebase/admin";
import { Review, Order } from "@/types";

/**
 * Fetch all approved reviews for a specific product
 */
export async function getProductReviewsAction(productId: string) {
  try {
    const snapshot = await adminDb
      .collection("reviews")
      .where("productId", "==", productId)
      .orderBy("createdAt", "desc")
      .get();
      
    const reviews = snapshot.docs.map(doc => doc.data() as Review);
    return { success: true, reviews };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Submit a new review for a product
 */
export async function submitReviewAction(productId: string, rating: number, comment: string) {
  try {
    const session = await getSessionServer();
    if (!session?.uid) throw new Error("You must be logged in to review a product.");

    if (rating < 1 || rating > 5) throw new Error("Invalid rating value.");
    if (!comment || comment.trim().length < 5) throw new Error("Review comment is too short.");

    // Check if the user has purchased this product (to grant "Verified Purchase" badge)
    const ordersSnapshot = await adminDb
      .collection("orders")
      .where("customerId", "==", session.uid)
      .get();
    
    let isVerifiedPurchase = false;
    
    for (const doc of ordersSnapshot.docs) {
      const order = doc.data() as Order;
      if (order.items && order.items.some(item => item.productId === productId)) {
        isVerifiedPurchase = true;
        break;
      }
    }

    const reviewRef = adminDb.collection("reviews").doc();
    const newReview: Review = {
      id: reviewRef.id,
      productId,
      userId: session.uid,
      userName: session.displayName || "Anonymous",
      rating,
      comment: comment.trim(),
      isVerifiedPurchase,
      createdAt: new Date().toISOString()
    };

    await reviewRef.set(newReview);
    return { success: true, review: newReview };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
