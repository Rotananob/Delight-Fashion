"use client";

import React, { useState } from "react";
import { Category } from "@/types";
import { 
  createCategoryAction, 
  updateCategoryAction, 
  deleteCategoryAction 
} from "@/app/actions/categoryActions";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Tags, Edit, Trash2, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";

export const CategoryManagerClient: React.FC<{ initialCategories: Category[] }> = ({ initialCategories }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: "",
    orderIndex: 0,
    isActive: true,
  });

  const handleEdit = (category: Category) => {
    setFormData(category);
    setEditingId(category.id);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      orderIndex: categories.length + 1,
      isActive: true,
    });
    setEditingId(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      // Auto generate slug only when creating new
      slug: !editingId ? generateSlug(name) : prev.slug
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert("Name and Slug are required.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        // Update
        const res = await updateCategoryAction(editingId, formData);
        if (res.success) {
          setCategories(prev => prev.map(c => c.id === editingId ? { ...c, ...formData } as Category : c));
          setIsEditing(false);
          router.refresh();
        } else {
          alert("Error: " + res.error);
        }
      } else {
        // Create
        const res = await createCategoryAction(formData as Omit<Category, "id">);
        if (res.success && res.category) {
          setCategories(prev => [...prev, res.category!]);
          setIsEditing(false);
          router.refresh();
        } else {
          alert("Error: " + res.error);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    
    try {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories(prev => prev.filter(c => c.id !== id));
        router.refresh();
      } else {
        alert("Error: " + res.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-foreground flex items-center gap-3">
          <Tags className="w-6 h-6 text-[#D4AF37]" />
          Categories
        </h1>
        {!isEditing && (
          <Button variant="gold" onClick={handleAddNew} className="gap-2">
            <Plus className="w-4 h-4" /> Add Category
          </Button>
        )}
      </div>

      {isEditing && (
        <Card variant="bordered" className="p-6 bg-white">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-foreground/50">Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="bg-[#1A1A1A] border border-border rounded-sm px-4 py-2.5 text-foreground outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-foreground/50">Slug * (ID)</label>
                <input
                  required
                  disabled={!!editingId} // Don't allow editing slug once created
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="bg-[#1A1A1A] border border-border rounded-sm px-4 py-2.5 text-foreground/70 outline-none focus:border-[#D4AF37] transition-colors disabled:opacity-50"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wider text-foreground/50">Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-[#1A1A1A] border border-border rounded-sm px-4 py-2.5 text-foreground outline-none focus:border-[#D4AF37] transition-colors h-24 resize-none"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-wider text-foreground/50">Order Index</label>
                <input
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({...formData, orderIndex: parseInt(e.target.value) || 0})}
                  className="bg-[#1A1A1A] border border-border rounded-sm px-4 py-2.5 text-foreground outline-none focus:border-[#D4AF37] transition-colors w-32"
                />
              </div>
              
              <div className="flex flex-col gap-2 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 accent-[#D4AF37]"
                  />
                  <span className="text-sm text-foreground">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button type="submit" variant="gold" isLoading={isSaving} className="gap-2">
                <Save className="w-4 h-4" /> Save
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving} className="gap-2">
                <X className="w-4 h-4" /> Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card variant="bordered" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-border text-foreground/50 uppercase tracking-widest text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Category Name</th>
                <th className="px-6 py-4 font-semibold">Slug</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/40">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.sort((a,b) => a.orderIndex - b.orderIndex).map((category: Category) => (
                  <tr key={category.id} className="hover:bg-black/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 text-foreground/60 font-mono text-xs">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4">
                      {category.isActive ? (
                        <Badge variant="success" size="sm">Active</Badge>
                      ) : (
                        <Badge variant="dark" size="sm">Draft</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-foreground/50">
                      {category.orderIndex}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-foreground/60 hover:text-[#D4AF37] hover:bg-black/5 rounded-sm transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="p-2 text-foreground/60 hover:text-rose-500 hover:bg-black/5 rounded-sm transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
