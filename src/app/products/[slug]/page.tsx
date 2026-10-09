import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/services/productService";
import { StorefrontLayoutShell } from "@/components/storefront/StorefrontLayoutShell";
import { generateSeoMetadata } from "@/utils/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductDetailClient } from "@/components/storefront/ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return generateSeoMetadata({
      title: "Product Not Found | Delight Fashion",
      description: "The requested item could not be found.",
    });
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

  return generateSeoMetadata({
    title: `${product.title} | Delight Fashion`,
    description: product.description.substring(0, 160),
    ogImage: primaryImage?.url,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products (same category, exclude current)
  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4); // Limit to 4 related products

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.images.map(img => img.url),
    "description": product.description,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "url": `https://delightfashion.com.kh/products/${product.slug}`,
      "priceCurrency": "USD",
      "price": product.price.toString(),
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    }
  };

  return (
    <StorefrontLayoutShell>
      <JsonLd data={schema} />
      
      {/* Breadcrumbs */}
      <div className="border-b border-gray-200 bg-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-gray-400">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black transition-colors">Products</Link>
          <span>/</span>
          <span className="text-black font-bold truncate max-w-[200px] sm:max-w-none">{product.title}</span>
        </div>
      </div>

      <div className="pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </div>
    </StorefrontLayoutShell>
  );
}
