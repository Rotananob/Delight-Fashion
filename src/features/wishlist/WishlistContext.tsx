"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Product } from "@/types";
import { useAuth } from "@/features/auth/AuthContext";
import { db } from "@/services/firebase/client";
import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  // Load from Firestore when user changes
  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const loadWishlist = async () => {
      try {
        const wishlistRef = collection(db, `users/${user.id}/wishlist`);
        const snapshot = await getDocs(wishlistRef);
        const loadedItems = snapshot.docs.map(doc => doc.data() as Product);
        setItems(loadedItems);
      } catch (err) {
        console.warn("Failed to load wishlist from Firestore:", err);
      }
    };

    loadWishlist();
  }, [user]);

  const requireAuth = () => {
    if (!user) {
      alert("Please sign in to add items to your wishlist.");
      router.push("/login");
      return false;
    }
    return true;
  }

  const addItem = async (product: Product) => {
    if (!requireAuth()) return;
    
    setItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });

    try {
      const docRef = doc(db, `users/${user!.id}/wishlist`, product.id);
      await setDoc(docRef, product);
    } catch (err) {
      console.error("Failed to add to Firestore wishlist:", err);
    }
  };

  const removeItem = async (productId: string) => {
    if (!requireAuth()) return;

    setItems((prev) => prev.filter((item) => item.id !== productId));

    try {
      const docRef = doc(db, `users/${user!.id}/wishlist`, productId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Failed to remove from Firestore wishlist:", err);
    }
  };

  const toggleItem = (product: Product) => {
    const exists = items.some((item) => item.id === product.id);
    if (exists) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const clearWishlist = async () => {
    if (!requireAuth()) return;
    
    const previousItems = [...items];
    setItems([]);

    try {
      for (const item of previousItems) {
        const docRef = doc(db, `users/${user!.id}/wishlist`, item.id);
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.error("Failed to clear Firestore wishlist:", err);
    }
  };

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      clearWishlist,
    }),
    [items, user]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
