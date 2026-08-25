"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Search as SearchIcon, Loader2 } from "lucide-react";
import { Product } from "@/types";
import { getProducts } from "@/services/productService";
import { ProductCard } from "./ProductCard";
import { twMerge } from "tailwind-merge";

export interface LiveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveSearchModal: React.FC<LiveSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
    } else {
      // Focus input when opened
      setTimeout(() => {
        document.getElementById("live-search-input")?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const products = await getProducts({ searchQuery: query });
        setResults(products);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0A0A0A]/95 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full border-b border-white/10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <SearchIcon className="w-6 h-6 text-white/50" />
          <input
            id="live-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent border-none outline-none text-xl sm:text-3xl text-white placeholder:text-white/30"
          />
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-[#D4AF37] transition-colors rounded-full hover:bg-white/5"
            aria-label="Close search"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p>Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <div key={product.id} onClick={onClose}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : query.trim() !== "" ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <p className="text-xl">No products found for "{query}"</p>
              <p className="text-sm mt-2">Try checking your spelling or using more general terms</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <p className="text-xl">Start typing to search products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
