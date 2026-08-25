"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/features/cart/CartContext";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, ChevronRight, Check } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ProductReviews } from "./ProductReviews";
import { ProductCard } from "./ProductCard";
import { ProductQuickViewModal } from "./ProductQuickViewModal";

export const ProductDetailClient: React.FC<{ product: Product, relatedProducts?: Product[] }> = ({ product, relatedProducts = [] }) => {
  const { addItem } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(
    product.images.find(i => i.isPrimary) || product.images[0]
  );
  
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(product.availableColors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleQuickView = (p: Product) => {
    setQuickViewProduct(p);
  };

  const handleRelatedAddToCart = (
    p: Product,
    size: string,
    color: string,
    qty = 1
  ) => {
    addItem(p, size, color, qty);
  };

  // Check Variant Stock
  const variantKey = `${selectedSize}-${selectedColor}`;
  const variant = product.variants[variantKey];
  const inStock = variant ? variant.stock > 0 : product.totalStock > 0;
  const stockCount = variant ? variant.stock : 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Simulate slight network delay for premium feel
    await new Promise(r => setTimeout(r, 400));
    
    addItem(product, selectedSize, selectedColor, quantity);
    
    setIsAdding(false);
    alert("Added to Cart!"); // Basic feedback since Cart drawer isn't auto-toggling
  };

  return (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">
        {/* Media Gallery */}
        <div className="flex-1 flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 no-scrollbar">
            {product.images.map(img => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={twMerge(
                  "relative aspect-[3/4] w-20 md:w-full shrink-0 border-2 transition-all",
                  selectedImage?.id === img.id ? "border-[#D4AF37]" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
        
        {/* Main Image */}
        <div className="flex-1 aspect-[3/4] relative bg-[#111] overflow-hidden">
          {selectedImage ? (
            <img src={selectedImage.url} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">No Image</div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col gap-8 shrink-0">
        <div className="flex flex-col gap-2">
          {product.isFeatured && (
            <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">
              Signature Collection
            </span>
          )}
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white leading-tight">
            {product.title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-2xl font-light text-white">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-sm line-through text-white/40">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        <p className="text-sm text-white/70 leading-relaxed">
          {product.description}
        </p>

        <div className="flex flex-col gap-6 pt-6 border-t border-white/10">
          
          {/* Colors */}
          {product.availableColors.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">Color</span>
                <span className="text-[11px] text-white/40">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.availableColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={twMerge(
                      "px-4 py-2 border text-xs font-semibold uppercase tracking-wider transition-all",
                      selectedColor === c
                        ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
                        : "border-white/20 text-white/60 hover:border-white/50 hover:text-white"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.availableSizes.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">Size</span>
                <button className="text-[10px] uppercase tracking-widest text-[#D4AF37] hover:underline underline-offset-4">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.availableSizes.map(s => {
                  const variantObj = product.variants[`${s}-${selectedColor}`];
                  const hasStock = variantObj ? variantObj.stock > 0 : true;
                  
                  return (
                    <button
                      key={s}
                      disabled={!hasStock}
                      onClick={() => setSelectedSize(s)}
                      className={twMerge(
                        "py-3 border text-sm font-bold transition-all flex items-center justify-center",
                        !hasStock 
                          ? "opacity-30 cursor-not-allowed border-white/10 text-white/30"
                          : selectedSize === s
                            ? "border-white text-black bg-white"
                            : "border-white/20 text-white/60 hover:border-white/60"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-white/20 h-12">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(stockCount || 10, quantity + 1))}
                  className="w-12 h-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
                  disabled={quantity >= stockCount}
                >
                  +
                </button>
              </div>
              <Button
                variant="gold"
                size="lg"
                className="flex-1 h-12"
                onClick={handleAddToCart}
                disabled={!inStock || isAdding}
                isLoading={isAdding}
                leftIcon={inStock && !isAdding ? <ShoppingBag className="w-4 h-4" /> : undefined}
              >
                {inStock ? "Add to Bag" : "Out of Stock"}
              </Button>
            </div>

            {!inStock ? (
              <span className="text-xs text-rose-400 font-medium">This variant is currently unavailable.</span>
            ) : stockCount > 0 && stockCount <= 5 ? (
              <span className="text-xs text-[#D4AF37] font-medium flex items-center gap-1">
                Only {stockCount} items left in stock.
              </span>
            ) : null}
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs text-white/60">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Authentic Guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Free Delivery in Phnom Penh over $100</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>COD & ABA PayWay Accepted</span>
            </div>
          </div>

        </div>
      </div>
      </div>
      
      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="w-full pt-16 border-t border-white/5">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
              You May Also Like
            </h2>
            <div className="w-12 h-[1px] bg-[#D4AF37]/50 mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={handleQuickView}
                onAddToCart={(prod, s, c) => handleRelatedAddToCart(prod, s, c, 1)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Product Reviews Section placed below the main product details */}
      <div className="w-full">
        <ProductReviews productId={product.id} />
      </div>

      {/* Quick View Modal for Related Products */}
      <ProductQuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleRelatedAddToCart}
      />
    </div>
  );
};
