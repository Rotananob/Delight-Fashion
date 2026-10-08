"use client";

import React from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/features/cart/CartContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    items,
    itemCount,
    subtotal,
    shippingFee,
    totalAmount,
    removeItem,
    updateQuantity,
  } = useCart();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      title={`SHOPPING BAG (${itemCount})`}
      footer={
        items.length > 0 ? (
          <div className="flex flex-col gap-4">
            {/* Subtotal & Delivery Summary */}
            <div className="flex flex-col gap-2 text-xs border-b border-border pb-3">
              <div className="flex justify-between text-foreground/70">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>Cambodia Shipping</span>
                <span className="text-black font-medium">
                  {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              {subtotal < 100 && (
                <span className="text-[10px] text-foreground/40 italic">
                  Add ${(100 - subtotal).toFixed(2)} more for Free Delivery in Phnom Penh!
                </span>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">
                Total Amount
              </span>
              <span className="text-xl font-extrabold text-black">
                ${totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Checkout Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full font-bold shadow-lg"
            >
              PROCEED TO SECURE CHECKOUT
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-foreground/50">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span>COD &amp; ABA PayWay QR (Demo Sandbox Simulation)</span>
            </div>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="YOUR BAG IS EMPTY"
          description="You haven't added any luxury items to your bag yet. Explore our Phnom Penh 2026 collection."
          actionLabel="Explore Collection"
          onAction={onClose}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantKey}`}
              className="flex gap-4 p-3 rounded-sm bg-white border border-border relative group"
            >
              {/* Image */}
              <div className="w-20 h-24 bg-gray-100 rounded-sm overflow-hidden shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground truncate">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-foreground/50 uppercase">
                    <span className="px-1.5 py-0.5 rounded-sm bg-black/5 border border-border">
                      Size: {item.size}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-sm bg-black/5 border border-border truncate">
                      {item.color}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-extrabold text-black">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  {/* Qty Counter */}
                  <div className="flex items-center border border-gray-200 rounded-sm overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantKey,
                          item.quantity - 1
                        )
                      }
                      className="p-1 text-foreground/70 hover:text-black hover:bg-black/5"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantKey,
                          item.quantity + 1
                        )
                      }
                      className="p-1 text-foreground/70 hover:text-black hover:bg-black/5"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeItem(item.productId, item.variantKey)}
                className="absolute top-2 right-2 p-1 text-foreground/30 hover:text-rose-400 transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  );
};
