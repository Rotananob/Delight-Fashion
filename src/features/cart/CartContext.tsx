"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, OrderItem } from "@/types";

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
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
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

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn("localStorage cart save error:", e);
      }
    }
  }, [items, isLoaded]);

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
