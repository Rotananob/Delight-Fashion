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
    <div className="space-y-8 mt-10 border-t border-gray-200 pt-8">
      {/* Active Filter Clear */}
      {(currentSize || currentColor) && (
        <div className="flex items-center justify-between pb-2 border-b border-gray-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Filters Active</span>
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("size");
              params.delete("color");
              router.push(`${pathname}?${params.toString()}`);
            }}
            className="text-xs text-rose-600 hover:underline uppercase font-bold tracking-wider"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Size Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const isSelected = currentSize === size;
            return (
              <button
                key={size}
                onClick={() => updateFilters("size", isSelected ? null : size)}
                className={twMerge(
                  "w-10 h-10 flex items-center justify-center border text-xs font-bold uppercase transition-all rounded-sm",
                  isSelected
                    ? "border-black bg-black text-white shadow-sm"
                    : "border-gray-200 text-black hover:border-black bg-white"
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
        <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-3">Color</h3>
        <div className="flex flex-col gap-2.5">
          {COLORS.map((color) => {
            const isSelected = currentColor === color;
            return (
              <label key={color} className="flex items-center gap-3 cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => updateFilters("color", isSelected ? null : color)}
                  className="hidden"
                />
                <div
                  className={twMerge(
                    "w-4 h-4 border rounded-sm flex items-center justify-center transition-all",
                    isSelected
                      ? "border-black bg-black"
                      : "border-gray-300 group-hover:border-black bg-white"
                  )}
                >
                  {isSelected && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
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
                    "text-xs uppercase tracking-wide transition-colors",
                    isSelected ? "text-black font-bold" : "text-gray-600 group-hover:text-black"
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
    <Suspense fallback={<div className="h-40 w-full animate-pulse bg-black/5 rounded-md mt-10"></div>}>
      <FilterSidebarContent />
    </Suspense>
  );
};
