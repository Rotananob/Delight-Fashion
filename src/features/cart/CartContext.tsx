"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, OrderItem } from "@/types";
import { useAuth } from "@/features/auth/AuthContext";
import { getCloudCartAction, syncCloudCartAction } from "@/app/actions/cartActions";

export interface CartContextType {
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  addItem: (product: Product, size: string, color: string, qty?: number) => void;
  removeItem: (productId: string, variantKey: string) => void;
  updateQuantity: (productId: string, variantKey: string, qty: number) => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = "delight_fashion_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // 1. Load from localStorage immediately on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("localStorage cart load error:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Handle Logout Reset
  useEffect(() => {
    if (!user) {
      setIsCloudSynced(false);
    }
  }, [user]);

  // 2. When a user is authenticated, fetch their cloud cart and merge
  useEffect(() => {
    let active = true;

    const syncWithCloud = async () => {
      // Only do this once per session when user becomes available
      if (user && isLoaded && !isCloudSynced) {
        try {
          const res = await getCloudCartAction();
          if (res.success && active) {
            const cloudItems = res.items || [];
            
            // Merge Logic: Local + Cloud
            // If the item exists in both, take the maximum quantity to prevent infinite addition on reload
            const mergedMap = new Map<string, OrderItem>();
            
            // Add cloud items first
            cloudItems.forEach(item => {
              mergedMap.set(item.variantKey, item);
            });

            // Add local items
            // Need to use the current state of items, not from the closure if it changed, 
            // but `items` is in the dependency array (implicitly via set state, wait, we don't put it in deps to avoid loops)
            items.forEach(item => {
              if (mergedMap.has(item.variantKey)) {
                const existing = mergedMap.get(item.variantKey)!;
                existing.quantity = Math.max(existing.quantity, item.quantity);
              } else {
                mergedMap.set(item.variantKey, item);
              }
            });

            const mergedItems = Array.from(mergedMap.values());
            
            setItems(mergedItems);
            setIsCloudSynced(true);
            
            // Push merged cart back to cloud
            await syncCloudCartAction(mergedItems);
          }
        } catch (error) {
          console.error("Cloud cart sync error:", error);
        }
      }
    };

    syncWithCloud();

    return () => { active = false; };
  // We explicitly DO NOT include `items` here so it doesn't re-run the initial sync continuously
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoaded, isCloudSynced]);

  // 3. Save to localStorage AND Cloud whenever items change
  useEffect(() => {
    if (isLoaded) {
      // Always save to local storage for speed
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn("localStorage cart save error:", e);
      }

      // If user is logged in, debounce save to cloud (wait 1 second after last click)
      if (user && isCloudSynced) {
        const timeoutId = setTimeout(() => {
          syncCloudCartAction(items).catch(err => console.error("Failed to sync cart:", err));
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [items, isLoaded, user, isCloudSynced]);

  const addItem = (
    product: Product,
    size: string,
    color: string,
    qty = 1
  ) => {
    const variantKey = `${size}-${color}`;
    const primaryImg =
      product.images.find((img) => img.isPrimary)?.url ||
      product.images[0]?.url ||
      "";
    const variantObj = product.variants[variantKey];
    const sku = variantObj?.sku || `${product.slug}-${variantKey}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === product.id && i.variantKey === variantKey
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + qty,
        };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          variantKey,
          size,
          color,
          sku,
          price: product.price,
          quantity: qty,
          imageUrl: primaryImg,
        },
      ];
    });
  };

  const removeItem = (productId: string, variantKey: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.productId === productId && i.variantKey === variantKey)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    variantKey: string,
    qty: number
  ) => {
    if (qty <= 0) {
      removeItem(productId, variantKey);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantKey === variantKey
          ? { ...i, quantity: qty }
          : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.warn("Clear cart storage error:", e);
    }
  };

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0
  );
  // Free delivery in Phnom Penh / Cambodia for orders over $100, otherwise $3
  const shippingFee = subtotal === 0 ? 0 : subtotal >= 100 ? 0 : 3.0;
  const totalAmount = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        shippingFee,
        totalAmount,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
