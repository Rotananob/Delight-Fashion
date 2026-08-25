"use client";

import React from "react";
import { AuthProvider } from "@/features/auth/AuthContext";
import { CartProvider } from "@/features/cart/CartContext";
import { FCMProvider } from "@/features/fcm/FCMProvider";
import { LanguageProvider } from "@/features/i18n/LanguageContext";
import { WishlistProvider } from "@/features/wishlist/WishlistContext";

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <FCMProvider>{children}</FCMProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};
