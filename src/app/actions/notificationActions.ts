"use server";

import "server-only";
import { getSessionServer } from "./authActions";
import { adminDb } from "@/services/firebase/admin";
import * as admin from "firebase-admin";

/**
 * Save an FCM registration token to the current user's profile.
 */
export async function saveFCMTokenAction(token: string) {
  try {
    const session = await getSessionServer();
    if (!session?.uid) throw new Error("Unauthorized");

    const userRef = adminDb.collection("users").doc(session.uid);
    
    // Add token to fcmTokens array if it doesn't already exist
    await userRef.update({
      fcmTokens: admin.firestore.FieldValue.arrayUnion(token)
    });

    return { success: true };
  } catch (error: any) {
    // If the document doesn't exist, we can create it
    if (error.code === 5 || error.message.includes("NOT_FOUND")) {
        try {
            const session = await getSessionServer();
            const userRef = adminDb.collection("users").doc(session!.uid);
            await userRef.set({ fcmTokens: [token] }, { merge: true });
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }
    return { success: false, error: error.message };
  }
}

/**
 * Remove an FCM registration token from the current user's profile (e.g. on logout or token refresh).
 */
export async function removeFCMTokenAction(token: string) {
  try {
    const session = await getSessionServer();
    if (!session?.uid) throw new Error("Unauthorized");

    const userRef = adminDb.collection("users").doc(session.uid);
    
    await userRef.update({
      fcmTokens: admin.firestore.FieldValue.arrayRemove(token)
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Sends a push notification to a specific user (Admin use only)
 */
export async function sendPushNotificationAction(userId: string, title: string, body: string) {
  try {
    const session = await getSessionServer();
    if (!session?.uid || session.role !== "admin") {
      throw new Error("Unauthorized: Admin only");
    }

    const userDoc = await adminDb.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new Error("User not found");
    }

    const userData = userDoc.data();
    const tokens = userData?.fcmTokens as string[] || [];

    if (tokens.length === 0) {
      return { success: false, error: "User has no registered devices." };
    }

    const message = {
      notification: { title, body },
      tokens
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    
    // Cleanup invalid tokens (if a user uninstalled or revoked permissions)
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          if (resp.error?.code === "messaging/invalid-registration-token" ||
              resp.error?.code === "messaging/registration-token-not-registered") {
            failedTokens.push(tokens[idx]);
          }
        }
      });
      if (failedTokens.length > 0) {
        await adminDb.collection("users").doc(userId).update({
          fcmTokens: admin.firestore.FieldValue.arrayRemove(...failedTokens)
        });
      }
    }

    return { success: true, successCount: response.successCount };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
