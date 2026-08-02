"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductImage, ProductVariant } from "@/types";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUploadWidget } from "./ImageUploadWidget";
import { createProductAction, updateProductAction } from "@/app/actions/productActions";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export interface ProductEditorProps {
  initialProduct?: Product;
}

export const ProductEditor: React.FC<ProductEditorProps> = ({ initialProduct }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialProduct?.title || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.categoryId || "cat_tshirts");
  const [price, setPrice] = useState(initialProduct?.price.toString() || "");
  const [compareAtPrice, setCompareAtPrice] = useState(initialProduct?.compareAtPrice?.toString() || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [status, setStatus] = useState<"active" | "draft" | "archived">(initialProduct?.status || "active");
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
  
  // Media State
  const [images, setImages] = useState<ProductImage[]>(initialProduct?.images || []);

  // Variants State
  const [sizesStr, setSizesStr] = useState(initialProduct?.availableSizes.join(", ") || "S, M, L");
  const [colorsStr, setColorsStr] = useState(initialProduct?.availableColors.join(", ") || "Black, White");
  const [variants, setVariants] = useState<Record<string, ProductVariant>>(initialProduct?.variants || {});

  // Generate Matrix
  const handleGenerateMatrix = () => {
    const sizeArr = sizesStr.split(",").map((s) => s.trim()).filter(Boolean);
    const colorArr = colorsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const newVariants: Record<string, ProductVariant> = {};

    sizeArr.forEach((s) => {
      colorArr.forEach((c) => {
        const key = `${s}-${c}`;
        newVariants[key] = variants[key] || {
          size: s,
          color: c,
          stock: 0,
          sku: `${slug || "PROD"}-${s}-${c}`.toUpperCase(),
        };
      });
    });
    setVariants(newVariants);
  };

  const handleVariantChange = (key: string, field: keyof ProductVariant, value: string | number) => {
    setVariants((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    
    // Calculate total stock from variants
    const totalStock = Object.values(variants).reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
    const sizeArr = sizesStr.split(",").map((s) => s.trim()).filter(Boolean);
    const colorArr = colorsStr.split(",").map((s) => s.trim()).filter(Boolean);

    const productData: Omit<Product, "id" | "createdAt"> = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoryId,
      price: parseFloat(price) || 0,
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
      description,
      images,
      variants,
      availableSizes: sizeArr,
      availableColors: colorArr,
      totalStock,
      status,
      isFeatured,
      isBestSeller: initialProduct?.isBestSeller || false,
    };

    try {
      if (initialProduct?.id) {
        await updateProductAction(initialProduct.id, productData);
      } else {
        await createProductAction(productData);
      }
      router.push("/admin/products");
    } catch (error) {
      alert("Failed to save product.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2 bg-[#111] hover:bg-white/5 border border-white/10 rounded-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold uppercase tracking-widest text-white">
            {initialProduct ? "Edit Product" : "Create New Product"}
          </h1>
        </div>
        <Button variant="gold" size="md" onClick={handleSave} isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Details */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card variant="bordered" className="p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3">
              Basic Information
            </h2>
            <div className="flex flex-col gap-4">
              <Input label="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Royal Crest Heavyweight Tee" required />
              <Input label="URL Slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. royal-crest-tee" />
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Description</label>
                <textarea
                  className="w-full bg-[#111111] border border-white/10 focus:border-[#D4AF37] outline-none rounded-sm px-3.5 py-2.5 text-sm text-white min-h-[120px] resize-y"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Luxurious men's tee designed in Phnom Penh..."
                />
              </div>
            </div>
          </Card>

          <Card variant="bordered" className="p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3">
              Media & Assets
            </h2>
            <ImageUploadWidget images={images} onChange={setImages} maxImages={6} />
          </Card>

          <Card variant="bordered" className="p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
                SKU & Variants Matrix
              </h2>
              <Button variant="outline" size="sm" onClick={handleGenerateMatrix}>
                Generate Matrix
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Available Sizes (comma separated)" value={sizesStr} onChange={(e) => setSizesStr(e.target.value)} placeholder="S, M, L, XL" />
              <Input label="Available Colors (comma separated)" value={colorsStr} onChange={(e) => setColorsStr(e.target.value)} placeholder="Black, Gold, Navy" />
            </div>

            {Object.keys(variants).length > 0 && (
              <div className="mt-4 border border-white/10 rounded-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-[#171717] text-white/50 uppercase tracking-widest">
                    <tr>
                      <th className="px-4 py-3">Variant (Size - Color)</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Stock Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {Object.entries(variants).map(([key, v]) => (
                      <tr key={key} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-semibold">{v.size} - {v.color}</td>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleVariantChange(key, "sku", e.target.value)}
                            className="bg-[#0A0A0A] border border-white/10 rounded-sm px-2 py-1.5 w-full outline-none focus:border-[#D4AF37]"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="0"
                            value={v.stock}
                            onChange={(e) => handleVariantChange(key, "stock", parseInt(e.target.value) || 0)}
                            className="bg-[#0A0A0A] border border-white/10 rounded-sm px-2 py-1.5 w-24 outline-none focus:border-[#D4AF37]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Pricing & Organization */}
        <div className="flex flex-col gap-6">
          <Card variant="bordered" className="p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3">
              Pricing ($USD)
            </h2>
            <div className="flex flex-col gap-4">
              <Input label="Selling Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
              <Input label="Compare-At Price (Optional)" type="number" step="0.01" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} />
            </div>
          </Card>

          <Card variant="bordered" className="p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3">
              Organization
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-[#111111] border border-white/10 focus:border-[#D4AF37] outline-none rounded-sm px-3.5 py-2.5 text-sm text-white"
                >
                  <option value="cat_tshirts">T-Shirts</option>
                  <option value="cat_jackets">Jackets & Outerwear</option>
                  <option value="cat_pants">Pants & Trousers</option>
                  <option value="cat_inner_work">Inner & Work Wear</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-semibold text-white/60 uppercase tracking-widest">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#111111] border border-white/10 focus:border-[#D4AF37] outline-none rounded-sm px-3.5 py-2.5 text-sm text-white"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="draft">Draft (Hidden)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <label className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:bg-white/10 transition-colors">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Feature on Homepage</span>
                  <span className="text-[10px] text-white/50">Display in Signature Pieces grid</span>
                </div>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
