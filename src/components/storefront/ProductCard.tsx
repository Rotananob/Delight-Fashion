"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eye, ShoppingBag } from "lucide-react";

export interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];
  const firstSize = product.availableSizes[0] || "M";
  const firstColor = product.availableColors[0] || "Black";

  return (
    <Card variant="hover" className="group flex flex-col h-full bg-[#111111]">
      {/* Product Image Box */}
      <div className="relative aspect-[3/4] w-full bg-[#1A1A1A] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-xs uppercase">
              No Image
            </div>
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isFeatured && (
            <Badge variant="gold" size="sm">
              FEATURED
            </Badge>
          )}
          {product.isBestSeller && !product.isFeatured && (
            <Badge variant="dark" size="sm" className="bg-[#D4AF37] text-black">
              BEST SELLER
            </Badge>
          )}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <Badge variant="danger" size="sm">
              SAVE ${(product.compareAtPrice - product.price).toFixed(0)}
            </Badge>
          )}
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onQuickView(product)}
              leftIcon={<Eye className="w-3.5 h-3.5" />}
              className="flex-1 text-xs"
            >
              Quick View
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={() => onAddToCart(product, firstSize, firstColor)}
              leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
              className="flex-1 text-xs"
            >
              Add to Bag
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Box */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col gap-1">
          {/* Colors / Sizes info */}
          <div className="flex items-center justify-between text-[11px] text-white/50 uppercase tracking-wider">
            <span>
              {product.availableSizes.length} {product.availableSizes.length === 1 ? "Size" : "Sizes"}
            </span>
            <span>
              {product.availableColors.length} {product.availableColors.length === 1 ? "Color" : "Colors"}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2"
          >
            {product.title}
          </Link>
        </div>

        {/* Price and Mobile Add Button */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-[#D4AF37]">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-white/40 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product, firstSize, firstColor)}
            className="lg:hidden p-2 rounded-sm bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#0A0A0A] transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  );
};
