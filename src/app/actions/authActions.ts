"use server";

import "server-only";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/services/firebase/admin";
import { UserProfile, UserRole } from "@/types";

import { isUserAdminEmail as isUserAdminEmailBase } from "@/utils/admin";

const SESSION_COOKIE_NAME = "delight_session";
const EXPIRES_IN = 1000 * 60 * 60 * 24 * 5; // 5 days

export function isUserAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  if (isUserAdminEmailBase(email)) return true;
  const clean = email.toLowerCase().trim();
  if (process.env.ADMIN_EMAIL && clean === process.env.ADMIN_EMAIL.toLowerCase().trim()) return true;
  if (process.env.FIREBASE_ADMIN_CLIENT_EMAIL && clean === process.env.FIREBASE_ADMIN_CLIENT_EMAIL.toLowerCase().trim()) return true;
  return false;
}

export async function createSessionAction(idToken: string) {
  try {
    // 1. Verify the ID token first
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Determine admin status
    const email = (decodedToken.email || "").toLowerCase().trim();
    const isOwnerByEmail = isUserAdminEmail(email);

    // 2. Sync User Profile in Firestore
    const userRef = adminDb.collection("users").doc(decodedToken.uid);
    const userSnap = await userRef.get();

    let isOwner = isOwnerByEmail;

    if (!userSnap.exists) {
      const newUser: UserProfile = {
        id: decodedToken.uid,
        email,
        displayName: decodedToken.name || email.split("@")[0] || "Shopper",
        role: isOwner ? "admin" : "customer",
        createdAt: new Date().toISOString(),
      };
      await userRef.set(newUser);
      
      // Fire & Forget Telegram Notification for New User
      import('@/services/telegramService').then(({ sendTelegramAlert }) => {
        const message = `👤 <b>NEW USER REGISTRATION</b>\n\n` +
          `<b>Name:</b> ${newUser.displayName}\n` +
          `<b>Email:</b> ${newUser.email}\n` +
          `<b>Role:</b> ${newUser.role.toUpperCase()}`;
        sendTelegramAlert("Users", message);
      }).catch(err => console.error('Failed to load telegramService:', err));
    } else {
      const existingData = userSnap.data();
      if (existingData?.role === "admin") {
        isOwner = true;
      } else if (isOwnerByEmail) {
        await userRef.update({ role: "admin" });
      }
    }

    // If admin, ensure custom claims are set
    if (isOwner) {
      await adminAuth.setCustomUserClaims(decodedToken.uid, { admin: true });
    }

    // 3. Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_IN,
    });

    // 4. Set cookie in Next.js
    (await cookies()).set(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: EXPIRES_IN / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return { success: true, isAdmin: isOwner };
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

/**
 * Validates session and checks admin privileges across claims, email list, and Firestore.
 */
export async function getSessionAndUserServer() {
  try {
    const session = await getSessionServer();
    if (!session) return null;

    const email = (session.email || "").toLowerCase().trim();
    const isAdminByEmail = isUserAdminEmail(email);
    const isAdminByClaim = session.admin === true;

    let isAdminInDb = false;
    try {
      const userSnap = await adminDb.collection("users").doc(session.uid).get();
      if (userSnap.exists && userSnap.data()?.role === "admin") {
        isAdminInDb = true;
      }
    } catch (e) {
      console.warn("Could not check Firestore user role:", e);
    }

    const isAdmin = isAdminByClaim || isAdminByEmail || isAdminInDb;

    // Auto-heal custom claim if missing for verified admin
    if (isAdmin && !isAdminByClaim) {
      try {
        await adminAuth.setCustomUserClaims(session.uid, { admin: true });
      } catch (e) {
        console.warn("Failed to auto-heal admin claim:", e);
      }
    }

    return {
      ...session,
      isAdmin,
    };
  } catch (error) {
    console.error("getSessionAndUserServer error:", error);
    return null;
  }
}
