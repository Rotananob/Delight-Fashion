"use client";

import React from "react";
import { AuthProvider } from "@/features/auth/AuthContext";
import { CartProvider } from "@/features/cart/CartContext";

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
};
