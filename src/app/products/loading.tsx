import React from "react";
import { StorefrontLayoutShell } from "@/components/storefront/StorefrontLayoutShell";
import { ProductSkeleton } from "@/components/storefront/ProductSkeleton";

export default function LoadingProducts() {
  return (
    <StorefrontLayoutShell>
      <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3 mb-4">
                Collections
              </h3>
              <div className="flex flex-col gap-4">
                <div className="w-24 h-4 bg-white/10 animate-pulse rounded" />
                <div className="w-32 h-4 bg-white/10 animate-pulse rounded" />
                <div className="w-20 h-4 bg-white/10 animate-pulse rounded" />
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-2">
              <div className="w-48 h-8 bg-white/10 animate-pulse rounded" />
              <div className="w-24 h-4 bg-white/10 animate-pulse rounded" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayoutShell>
  );
}
