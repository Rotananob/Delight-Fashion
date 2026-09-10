"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import { ProductQuickViewModal } from "./ProductQuickViewModal";
import { useCart } from "@/features/cart/CartContext";
import { motion } from "framer-motion";

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
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-12 md:mb-16 text-center"
        >
          <span className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3">
            Signature Pieces
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-black">
            Featured Collection
          </h2>
          <div className="w-12 h-[2px] bg-black mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <ProductCard
                product={product}
                onQuickView={handleQuickView}
                onAddToCart={(p, s, c) => handleAddToCart(p, s, c, 1)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-200 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-12 md:mb-16 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-black">
            Latest Arrivals
          </h2>
          <div className="w-12 h-[1px] bg-black/50 mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-12">
          {allProducts.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <ProductCard
                product={product}
                onQuickView={handleQuickView}
                onAddToCart={(p, s, c) => handleAddToCart(p, s, c, 1)}
              />
            </motion.div>
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
