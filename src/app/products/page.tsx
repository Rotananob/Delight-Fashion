import React from "react";
import { StorefrontLayoutShell } from "@/components/storefront/StorefrontLayoutShell";
import { getProducts, getCategories } from "@/services/productService";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { StorefrontHomeClient } from "@/components/storefront/StorefrontHomeClient";
import { ProductCard } from "@/components/storefront/ProductCard";
import { CatalogClient } from "@/components/storefront/CatalogClient";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filter?: string }>;
}) {
  const params = await searchParams;
  let title = "Shop All Collections | Delight Fashion";
  if (params.category) {
    title = `${params.category.toUpperCase()} Collection | Delight Fashion`;
  } else if (params.filter === "new") {
    title = "New Arrivals 2026 | Delight Fashion";
  }

  return generateSeoMetadata({
    title,
    description: "Explore the complete luxury men's wear collection at Delight Fashion Phnom Penh.",
  });
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const categories = await getCategories();
  
  // Fetch filtered products
  const products = await getProducts({
    categorySlug: params.category,
    featuredOnly: params.filter === "featured",
  });

  // Basic sorting simulation (new arrivals)
  if (params.filter === "new") {
    products.reverse(); // Mock new arrivals logic
  }

  return (
    <StorefrontLayoutShell>
      <div className="pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Categories (Desktop) */}
          <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3 mb-4">
                Collections
              </h3>
              <ul className="flex flex-col gap-2">
                <li>
                  <a href="/products" className={`text-sm font-semibold uppercase tracking-wider transition-colors ${!params.category && !params.filter ? "text-[#D4AF37]" : "text-white/60 hover:text-white"}`}>
                    All Products
                  </a>
                </li>
                <li>
                  <a href="/products?filter=new" className={`text-sm font-semibold uppercase tracking-wider transition-colors ${params.filter === "new" ? "text-[#D4AF37]" : "text-white/60 hover:text-white"}`}>
                    New Arrivals
                  </a>
                </li>
                {categories.map(c => (
                  <li key={c.id}>
                    <a href={`/products?category=${c.slug}`} className={`text-sm font-semibold uppercase tracking-wider transition-colors ${params.category === c.slug ? "text-[#D4AF37]" : "text-white/60 hover:text-white"}`}>
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid Client */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col">
              <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white">
                {params.category ? categories.find(c => c.slug === params.category)?.name : (params.filter === "new" ? "New Arrivals" : "All Products")}
              </h1>
              <p className="text-sm text-white/50 mt-2">
                Showing {products.length} {products.length === 1 ? "result" : "results"}
              </p>
            </div>
            
            <CatalogClient products={products} />
          </div>
        </div>
      </div>
    </StorefrontLayoutShell>
  );
}
