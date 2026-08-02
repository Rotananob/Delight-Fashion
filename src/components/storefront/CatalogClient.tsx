"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { useCart } from "@/features/cart/CartContext";

export const CatalogClient: React.FC<{ products: Product[] }> = ({ products }) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-bold uppercase tracking-widest text-white mb-2">No Products Found</h2>
        <p className="text-sm text-white/50">This collection is currently being updated. Check back soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
            onAddToCart={(p, size, color) => addItem(p, size, color, 1)}
          />
        ))}
      </div>

      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, size, color, qty) => addItem(p, size, color, qty)}
      />
    </>
  );
};
