"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eye, ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/features/wishlist/WishlistContext";

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
  const { toggleItem, isInWishlist } = useWishlist();
  const primaryImage =
    product.images?.find((img) => img.isPrimary) || 
    (product.images?.length > 0 ? product.images[0] : null);
  
  const fallbackImageUrl = "/logo.jpg";
  const firstSize = product.availableSizes?.[0] || "M";
  const firstColor = product.availableColors?.[0] || "Black";
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <Card variant="hover" className="group flex flex-col h-full bg-white overflow-hidden">
        {/* Product Image Box */}
        <div className="relative aspect-[3/4] w-full bg-[#1A1A1A] overflow-hidden">
          <Link href={`/products/${product.slug}`} className="block w-full h-full relative">
            <Image
              src={primaryImage?.url || fallbackImageUrl}
              alt={primaryImage?.alt || product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </Link>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none z-10">
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

          {/* Wishlist Heart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleItem(product);
            }}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-foreground hover:bg-black/50 transition-colors"
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`w-4 h-4 ${inWishlist ? "fill-current text-rose-500" : ""}`}
            />
          </button>

          {/* Quick View Button on Hover (Slide up effect) */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4">
            <div className="flex gap-2 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
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
        <div className="p-4 flex flex-col flex-1 justify-between gap-3 relative z-10 bg-white">
          <div className="flex flex-col gap-1">
            {/* Colors / Sizes info */}
            <div className="flex items-center justify-between text-[11px] text-foreground/50 uppercase tracking-wider">
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
              className="text-sm font-bold uppercase tracking-wider text-foreground group-hover:text-[#D4AF37] transition-colors line-clamp-2"
            >
              {product.title}
            </Link>
          </div>

          {/* Price and Mobile Add Button */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-[#D4AF37]">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-foreground/40 line-through">
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
    </motion.div>
  );
};
