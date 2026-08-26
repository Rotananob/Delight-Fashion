"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { useCart } from "@/features/cart/CartContext";

export interface StorefrontHomeClientProps {
  featuredProducts: Product[];
  allProducts: Product[];
}

export const StorefrontHomeClient: React.FC<StorefrontHomeClientProps> = ({
  featuredProducts,
  allProducts,
}) => {
  const { addItem } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleAddToCart = (
    product: Product,
    size: string,
    color: string,
    qty = 1
  ) => {
    addItem(product, size, color, qty);
  };

  return (
    <>
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-2">
            Signature Pieces
          </span>
          <h2 className="text-3xl font-extrabold uppercase tracking-widest text-foreground">
            Featured Collection
          </h2>
          <div className="w-16 h-[2px] bg-[#D4AF37] mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleQuickView}
              onAddToCart={(p, s, c) => handleAddToCart(p, s, c, 1)}
            />
          ))}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
        <div className="flex flex-col items-center mb-12 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-widest text-foreground">
            Latest Arrivals
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/50 mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleQuickView}
              onAddToCart={(p, s, c) => handleAddToCart(p, s, c, 1)}
            />
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};
