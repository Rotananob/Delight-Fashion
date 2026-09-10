"use client";

import React, { useState } from "react";
import { StorefrontHeader } from "./StorefrontHeader";
import { StorefrontFooter } from "./StorefrontFooter";
import { MobileDrawer } from "./MobileDrawer";
import { CartDrawer } from "./CartDrawer";
import { CheckoutModal } from "./CheckoutModal";
import { AuthModal } from "@/features/auth/AuthModal";
import { useCart } from "@/features/cart/CartContext";
import { Order } from "@/types";
import { LiveSearchModal } from "./LiveSearchModal";

export interface StorefrontLayoutShellProps {
  children: React.ReactNode;
}

export const StorefrontLayoutShell: React.FC<StorefrontLayoutShellProps> = ({
  children,
}) => {
  const { itemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOrderSuccess = (order: Order) => {
    console.log("Order submitted successfully:", order);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-black selection:text-white">
      <StorefrontHeader
        cartItemCount={itemCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 w-full">{children}</main>

      <StorefrontFooter />

      {/* Slide-over Drawers & Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      <LiveSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};
