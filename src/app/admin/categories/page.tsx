import React from "react";
import { getCategoriesAction } from "@/app/actions/categoryActions";
import { CategoryManagerClient } from "@/components/admin/CategoryManagerClient";

export const metadata = {
  title: "Categories Management | Delight Fashion Admin",
};

export default async function AdminCategoriesPage() {
  const res = await getCategoriesAction();

  if (!res.success) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-rose-500">Failed to load categories</h1>
        <p className="text-white/60">{res.error}</p>
      </div>
    );
  }

  const categories = res.categories || [];

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <CategoryManagerClient initialCategories={categories} />
    </div>
  );
}
