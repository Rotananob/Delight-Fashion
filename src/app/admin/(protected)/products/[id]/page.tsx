import React from "react";
import { notFound } from "next/navigation";
import { getProductById } from "@/services/productService";
import { ProductEditor } from "@/components/admin/ProductEditor";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }

  return <ProductEditor initialProduct={product} />;
}
