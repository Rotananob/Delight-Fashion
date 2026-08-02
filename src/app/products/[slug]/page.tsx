import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/productService";
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
      <div className="border-b border-white/5 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold text-white/40">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-white transition-colors">Products</a>
          <span>/</span>
          <span className="text-[#D4AF37]">{product.title}</span>
        </div>
      </div>

      <div className="pt-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ProductDetailClient product={product} />
      </div>
    </StorefrontLayoutShell>
  );
}
