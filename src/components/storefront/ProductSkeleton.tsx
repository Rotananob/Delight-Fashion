import React from "react";
import { Card } from "@/components/ui/Card";

export const ProductSkeleton: React.FC = () => {
  return (
    <Card variant="default" className="flex flex-col h-full bg-white animate-pulse">
      {/* Product Image Box Skeleton */}
      <div className="relative aspect-[3/4] w-full bg-black/5 overflow-hidden">
        {/* Top Badges Skeleton */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <div className="w-16 h-5 bg-black/10 rounded-sm"></div>
        </div>
      </div>

      {/* Product Details Box Skeleton */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div className="flex flex-col gap-2">
          {/* Colors / Sizes info Skeleton */}
          <div className="flex items-center justify-between">
            <div className="w-10 h-3 bg-black/5 rounded-sm"></div>
            <div className="w-12 h-3 bg-black/5 rounded-sm"></div>
          </div>

          {/* Title Skeleton */}
          <div className="w-3/4 h-4 bg-black/10 rounded-sm mt-1"></div>
          <div className="w-1/2 h-4 bg-black/10 rounded-sm"></div>
        </div>

        {/* Price Skeleton */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="w-16 h-5 bg-black/10 rounded-sm mt-2"></div>
          <div className="lg:hidden w-8 h-8 bg-black/5 rounded-sm mt-2"></div>
        </div>
      </div>
    </Card>
  );
};
