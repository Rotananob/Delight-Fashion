"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { useCart } from "@/features/cart/CartContext";
import { motion } from "framer-motion";

export const CatalogClient: React.FC<{ products: Product[] }> = ({ products }) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <h2 className="text-xl font-bold uppercase tracking-wide text-black mb-2">No Products Found</h2>
        <p className="text-sm text-gray-500">This collection is currently being updated. Check back soon.</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-12">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
          >
            <ProductCard
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
              onAddToCart={(p, size, color) => addItem(p, size, color, 1)}
            />
          </motion.div>
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
