import React from "react";
import { StorefrontLayoutShell } from "@/components/storefront/StorefrontLayoutShell";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ProductQuickViewModal } from "@/components/storefront/ProductQuickViewModal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getStoreJsonLd } from "@/utils/seo";
import { getProducts } from "@/services/productService";
import { Product } from "@/types";
import { StorefrontHomeClient } from "@/components/storefront/StorefrontHomeClient";

// Server Component for fetching initial data and rendering SEO
export default async function HomePage() {
  // Fetch featured products and new arrivals directly on the server
  const featuredProducts = await getProducts({ featuredOnly: true });
  const allProducts = await getProducts();

  return (
    <StorefrontLayoutShell>
      {/* Global E-Commerce SEO Rich Snippets */}
      <JsonLd data={getStoreJsonLd()} />

      <HeroSection />

      {/* Interactive Client Component for Product Grids & Quick View logic */}
      <StorefrontHomeClient
        featuredProducts={featuredProducts}
        allProducts={allProducts}
      />
    </StorefrontLayoutShell>
  );
}
