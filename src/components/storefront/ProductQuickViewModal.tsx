"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShoppingBag, Check, Plus, Minus, Crown } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface ProductQuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, qty: number) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes[0] || "M");
      setSelectedColor(product.availableColors[0] || "Black");
      setQuantity(1);
      setAddedSuccess(false);
    }
  }, [product]);

  if (!product) return null;

  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="QUICK VIEW • PHNOM PENH"
      maxWidth="xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Product Image */}
        <div className="relative aspect-[3/4] w-full bg-[#1A1A1A] rounded-sm overflow-hidden border border-border">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/30 text-xs uppercase">
              No Image
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-3 left-3">
              <Badge variant="gold" size="sm">
                FEATURED
              </Badge>
            </div>
          )}
        </div>

        {/* Right Product Details & Selectors */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-semibold">
              Delight Fashion Luxury
            </span>
            <h2 className="text-xl font-bold uppercase tracking-wider text-foreground mt-1">
              {product.title}
            </h2>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-extrabold text-[#D4AF37]">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-foreground/40 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-foreground/70 leading-relaxed border-t border-b border-border py-3">
            {product.description}
          </p>

          {/* Size Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Select Size
            </span>
            <div className="flex flex-wrap gap-2">
              {product.availableSizes.map((size) => {
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={twMerge(
                      "px-3.5 py-2 rounded-sm text-xs font-bold transition-all border",
                      isActive
                        ? "bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                        : "bg-transparent text-foreground/80 border-white/20 hover:border-[#D4AF37]/60"
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Select Color
            </span>
            <div className="flex flex-wrap gap-2">
              {product.availableColors.map((color) => {
                const isActive = selectedColor === color;
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={twMerge(
                      "px-3.5 py-2 rounded-sm text-xs font-semibold transition-all border",
                      isActive
                        ? "bg-white text-[#0A0A0A] border-white font-bold"
                        : "bg-transparent text-foreground/80 border-white/20 hover:border-white"
                    )}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Quantity
            </span>
            <div className="flex items-center border border-white/20 rounded-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-foreground/80 hover:text-[#D4AF37] hover:bg-black/5 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-xs font-bold text-foreground select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 text-foreground/80 hover:text-[#D4AF37] hover:bg-black/5 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="pt-4">
            <Button
              variant="gold"
              size="lg"
              onClick={handleAdd}
              disabled={addedSuccess}
              leftIcon={
                addedSuccess ? (
                  <Check className="w-4 h-4 text-[#0A0A0A]" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )
              }
              className="w-full font-bold shadow-[0_0_25px_rgba(212,175,55,0.3)]"
            >
              {addedSuccess ? "ADDED TO BAG" : "ADD TO SHOPPING BAG"}
            </Button>
          </div>

          {/* Cambodia Delivery Note */}
          <div className="flex items-center gap-2 text-[11px] text-foreground/50 justify-center">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>
              Phnom Penh Same-Day Delivery • Instant COD &amp; ABA PayWay QR (Demo Sandbox)
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
