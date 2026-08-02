"use server";

import "server-only";
import { getSessionServer } from "./authActions";
import { adminDb } from "@/services/firebase/admin";
import { UserAddress, UserProfile } from "@/types";

/**
 * Get the current user's profile from Firestore.
 */
export async function getUserProfileAction() {
  try {
    const session = await getSessionServer();
    if (!session?.uid) throw new Error("Unauthorized: Please sign in");

    const userDoc = await adminDb.collection("users").doc(session.uid).get();
    
    if (!userDoc.exists) {
      return { success: false, error: "User profile not found in database." };
    }

    return { success: true, profile: userDoc.data() as UserProfile };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Save or update an address in the user's profile.
 */
export async function saveUserAddressAction(address: UserAddress) {
  try {
    const session = await getSessionServer();
    if (!session?.uid) throw new Error("Unauthorized: Please sign in");

    const userRef = adminDb.collection("users").doc(session.uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error("User profile not found.");
    }

    const userData = userDoc.data() as UserProfile;
    let addresses = userData.savedAddresses || [];

    // If this is set to default, unset default on all others
    if (address.isDefault) {
      addresses = addresses.map(addr => ({ ...addr, isDefault: false }));
    }

    const existingIndex = addresses.findIndex(a => a.id === address.id);
    if (existingIndex >= 0) {
      // Update
      addresses[existingIndex] = address;
    } else {
      // Add new
      // If it's the first address, automatically make it default
      if (addresses.length === 0) address.isDefault = true;
      addresses.push(address);
    }

    await userRef.update({ savedAddresses: addresses });
    return { success: true, addresses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete an address from the user's profile.
 */
export async function deleteUserAddressAction(addressId: string) {
  try {
    const session = await getSessionServer();
    if (!session?.uid) throw new Error("Unauthorized: Please sign in");

    const userRef = adminDb.collection("users").doc(session.uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error("User profile not found.");
    }

    const userData = userDoc.data() as UserProfile;
    let addresses = userData.savedAddresses || [];

    const addressToDelete = addresses.find(a => a.id === addressId);
    addresses = addresses.filter(a => a.id !== addressId);

    // If we deleted the default address and there are other addresses left, make the first one default
    if (addressToDelete?.isDefault && addresses.length > 0) {
      addresses[0].isDefault = true;
    }

    await userRef.update({ savedAddresses: addresses });
    return { success: true, addresses };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
