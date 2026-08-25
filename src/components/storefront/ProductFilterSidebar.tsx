"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

const SIZES = ["S", "M", "L", "XL"];
const COLORS = ["Black", "White", "Gold", "Navy"];

function FilterSidebarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSize = searchParams.get("size");
  const currentColor = searchParams.get("color");

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-8 mt-10 border-t border-white/10 pt-8">
      {/* Size Filter */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isSelected = currentSize === size;
            return (
              <button
                key={size}
                onClick={() => updateFilters("size", isSelected ? null : size)}
                className={twMerge(
                  "w-10 h-10 flex items-center justify-center border text-sm font-medium transition-colors",
                  isSelected
                    ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                    : "border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Color</h3>
        <div className="flex flex-col gap-2">
          {COLORS.map((color) => {
            const isSelected = currentColor === color;
            return (
              <label key={color} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => updateFilters("color", isSelected ? null : color)}
                  className="hidden"
                />
                <div
                  className={twMerge(
                    "w-5 h-5 border rounded-sm flex items-center justify-center transition-colors",
                    isSelected
                      ? "border-[#D4AF37] bg-[#D4AF37]"
                      : "border-white/30 group-hover:border-[#D4AF37]"
                  )}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={twMerge(
                    "text-sm transition-colors",
                    isSelected ? "text-[#D4AF37]" : "text-white/70 group-hover:text-white"
                  )}
                >
                  {color}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const ProductFilterSidebar = () => {
  return (
    <Suspense fallback={<div className="h-40 w-full animate-pulse bg-white/5 rounded-md mt-10"></div>}>
      <FilterSidebarContent />
    </Suspense>
  );
};
