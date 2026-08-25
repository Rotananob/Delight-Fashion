import React from "react";
import Link from "next/link";
import { getProducts } from "@/services/productService";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

// Server Component for Admin Product List
export default async function AdminProductsPage() {
  const products = await getProducts(); // Fetches all products (active & drafts if admin, though our current service fetches all MOCK)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-white">
            Product Management
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Manage inventory, pricing, and variants for the Phnom Penh showroom.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="gold" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters / Search */}
      <Card variant="bordered" className="p-4">
        <div className="flex items-center gap-3 bg-[#0A0A0A] border border-white/10 rounded-sm px-3 py-2">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by SKU, Title, or Category..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30"
          />
        </div>
      </Card>

      {/* Products Table */}
      <Card variant="bordered" className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white/80 whitespace-nowrap">
          <thead className="bg-[#171717] text-white/60 text-xs uppercase tracking-widest border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-white/40">
                  No products found. Start by creating your first luxury item.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0];
                return (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 bg-[#111] rounded-sm overflow-hidden shrink-0 border border-white/5">
                          {primaryImage ? (
                            <img src={primaryImage.url} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-white/20">No Img</div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <Link href={`/admin/products/${product.id}`} className="font-bold text-white uppercase tracking-wider hover:text-[#D4AF37] transition-colors truncate max-w-[200px] sm:max-w-[300px]">
                            {product.title}
                          </Link>
                          <span className="text-[11px] text-white/40">
                            ID: {product.id.split("_").pop()} • {product.availableSizes.length} Sizes
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ${product.price.toFixed(2)}
                      {product.compareAtPrice && (
                        <span className="block text-[10px] line-through text-white/30 font-normal">
                          ${product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={twMerge(
                          "font-bold",
                          product.totalStock <= 10 ? "text-rose-400" : "text-emerald-400"
                        )}>
                          {product.totalStock} units
                        </span>
                        <span className="text-[10px] text-white/40">
                          in {Object.keys(product.variants).length} variants
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.status === "active" ? "gold" : "neutral"} size="sm">
                        {product.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin/products/${product.id}`}>
                          <button className="p-2 text-white/60 hover:text-[#D4AF37] bg-[#171717] border border-white/10 rounded-sm hover:border-[#D4AF37]/50 transition-all">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-2 text-white/60 hover:text-rose-400 bg-[#171717] border border-white/10 rounded-sm hover:border-rose-400/50 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
