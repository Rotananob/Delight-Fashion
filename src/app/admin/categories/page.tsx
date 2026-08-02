"use client";

import React, { useState, useEffect } from "react";
import { getCategories } from "@/services/productService";
import { Category } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await getCategories();
      setCategories(cats.sort((a, b) => a.orderIndex - b.orderIndex));
      setIsLoading(false);
    };
    fetchCats();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-white">
            Categories
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Organize the Phnom Penh catalog into distinct luxury collections.
          </p>
        </div>
        <Button variant="gold" size="md" leftIcon={<Plus className="w-4 h-4" />}>
          New Category
        </Button>
      </div>

      <Card variant="bordered" className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white/80 whitespace-nowrap">
          <thead className="bg-[#171717] text-white/60 text-xs uppercase tracking-widest border-b border-white/10">
            <tr>
              <th className="px-6 py-4 font-semibold">Category Details</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Sort Order</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-white/40">Loading categories...</td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-white/40">No categories found.</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white uppercase tracking-wider">{cat.name}</span>
                      <span className="text-[11px] text-white/40 mt-0.5">/{cat.slug}</span>
                      <span className="text-xs text-white/60 mt-1 truncate max-w-sm">{cat.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={cat.isActive ? "gold" : "neutral"} size="sm">
                      {cat.isActive ? "ACTIVE" : "HIDDEN"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#0A0A0A] border border-white/10 rounded-sm font-mono text-xs">
                      {cat.orderIndex}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-white/60 hover:text-[#D4AF37] bg-[#171717] border border-white/10 rounded-sm hover:border-[#D4AF37]/50 transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-white/60 hover:text-rose-400 bg-[#171717] border border-white/10 rounded-sm hover:border-rose-400/50 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
