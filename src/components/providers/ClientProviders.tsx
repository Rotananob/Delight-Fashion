"use client";

import React from "react";
import { AuthProvider } from "@/features/auth/AuthContext";
import { CartProvider } from "@/features/cart/CartContext";

import { FCMProvider } from "@/features/fcm/FCMProvider";

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <CartProvider>
        <FCMProvider>{children}</FCMProvider>
      </CartProvider>
    </AuthProvider>
  );
};
