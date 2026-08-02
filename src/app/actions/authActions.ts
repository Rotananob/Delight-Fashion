"use server";

import "server-only";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/services/firebase/admin";
import { UserProfile, UserRole } from "@/types";

const SESSION_COOKIE_NAME = "delight_session";
const EXPIRES_IN = 1000 * 60 * 60 * 24 * 5; // 5 days

export async function createSessionAction(idToken: string) {
  try {
    // 1. Verify the ID token first
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // 2. Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN,
    });

    // 3. Set cookie in Next.js
    (await cookies()).set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: EXPIRES_IN / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    // 4. Sync User Profile in Firestore
    const userRef = adminDb.collection("users").doc(decodedToken.uid);
    const userSnap = await userRef.get();

    // Determine initial role (default to customer, check if admin email)
    const email = decodedToken.email || "";
    const isOwner = email === process.env.FIREBASE_ADMIN_CLIENT_EMAIL || email.includes("admin");
    const role: UserRole = isOwner ? "admin" : "customer";

    if (!userSnap.exists) {
      const newUser: UserProfile = {
        id: decodedToken.uid,
        email,
        displayName: decodedToken.name || email.split("@")[0] || "Shopper",
        role,
        createdAt: new Date().toISOString(),
      };
      await userRef.set(newUser);
      
      // If admin, set custom claims so Firestore Rules work!
      if (role === "admin") {
        await adminAuth.setCustomUserClaims(decodedToken.uid, { admin: true });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Session creation error:", error);
    return { success: false, error: "Failed to create session" };
  }
}

export async function clearSessionAction() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (sessionCookie) {
      const decoded = await adminAuth.verifySessionCookie(sessionCookie);
      await adminAuth.revokeRefreshTokens(decoded.sub);
    }
    
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error("Session clear error:", error);
    // Still delete cookie even if Firebase revocation fails
    (await cookies()).delete(SESSION_COOKIE_NAME);
    return { success: false };
  }
}

/**
 * Validates the current session cookie server-side.
 * Returns the decoded token if valid, null otherwise.
 */
export async function getSessionServer() {
  try {
    const sessionCookie = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!sessionCookie) return null;
    
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decodedToken;
  } catch (error) {
    return null;
  }
}
