"use client";

import React, { useState } from "react";
import { UserProfile, UserAddress } from "@/types";
import { saveUserAddressAction, deleteUserAddressAction } from "@/app/actions/userActions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Plus, Edit, Trash2, X, Save, User } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProfileManagerClient: React.FC<{ initialProfile: UserProfile }> = ({ initialProfile }) => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<UserAddress[]>(initialProfile.savedAddresses || []);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  const [formData, setFormData] = useState<UserAddress>({
    id: "",
    fullName: "",
    phone: "",
    addressLine1: "",
    district: "",
    city: "Phnom Penh",
    isDefault: false
  });

  const handleAddNew = () => {
    setFormData({
      id: generateId(),
      fullName: initialProfile.displayName || "",
      phone: initialProfile.phone || "",
      addressLine1: "",
      district: "",
      city: "Phnom Penh",
      isDefault: addresses.length === 0
    });
    setIsEditing(true);
  };

  const handleEdit = (addr: UserAddress) => {
    setFormData(addr);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const res = await saveUserAddressAction(formData);
      if (res.success && res.addresses) {
        setAddresses(res.addresses);
        setIsEditing(false);
        router.refresh();
      } else {
        alert("Failed to save address: " + res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await deleteUserAddressAction(id);
      if (res.success && res.addresses) {
        setAddresses(res.addresses);
        router.refresh();
      } else {
        alert("Failed to delete: " + res.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      
      {/* Sidebar: Profile Info */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <Card variant="bordered" className="p-6 bg-[#111]">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center border border-white/10">
              <User className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{initialProfile.displayName}</h2>
              <p className="text-xs text-white/50">{initialProfile.email}</p>
              {initialProfile.role === "admin" && (
                <Badge variant="gold" size="sm" className="mt-2">Admin</Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-4 text-sm text-white/70">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Phone Number</span>
              <span>{initialProfile.phone || "Not provided"}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Member Since</span>
              <span>{initialProfile.createdAt ? new Date(initialProfile.createdAt).toLocaleDateString() : "Unknown"}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content: Address Book */}
      <div className="w-full md:w-2/3 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-widest text-white">Address Book</h2>
            <p className="text-sm text-white/50 mt-1">Manage your delivery addresses for faster checkout.</p>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleAddNew} leftIcon={<Plus className="w-4 h-4" />}>
              Add New
            </Button>
          )}
        </div>

        {isEditing ? (
          <Card variant="bordered" className="p-6 bg-[#111]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-6">
              {addresses.some(a => a.id === formData.id) ? "Edit Address" : "Add New Address"}
            </h3>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-white/50">Full Name *</label>
                  <input required type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-white/50">Phone Number *</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+855 12 345 678" className="bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-white/50">Street Address *</label>
                <input required type="text" value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})} placeholder="House/Bldg No, Street Name" className="bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-colors" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-white/50">District / Sangkat</label>
                  <input type="text" value={formData.district || ""} onChange={e => setFormData({...formData, district: e.target.value})} className="bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider text-white/50">City / Province *</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="bg-[#1A1A1A] border border-white/10 rounded-sm px-4 py-2.5 text-white outline-none focus:border-[#D4AF37] transition-colors" />
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-4 h-4 accent-[#D4AF37]" />
                <label htmlFor="isDefault" className="text-sm text-white/80 cursor-pointer">Set as default shipping address</label>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                <Button type="submit" variant="gold" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
                  Save Address
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving} leftIcon={<X className="w-4 h-4" />}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-[#111] border border-white/5 rounded-sm flex flex-col items-center">
                <MapPin className="w-8 h-8 text-white/20 mb-3" />
                <p className="text-white/50 text-sm">You haven't saved any addresses yet.</p>
              </div>
            ) : (
              addresses.map((addr) => (
                <div key={addr.id} className={`p-5 rounded-sm border ${addr.isDefault ? 'border-[#D4AF37]/50 bg-[#D4AF37]/5' : 'border-white/10 bg-[#111]'} flex flex-col gap-3 relative`}>
                  {addr.isDefault && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37] text-black px-2 py-0.5 rounded-sm">Default</span>
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm">{addr.fullName}</span>
                    <span className="text-xs text-white/50">{addr.phone}</span>
                  </div>
                  <div className="text-sm text-white/70 leading-relaxed border-t border-white/5 pt-2">
                    {addr.addressLine1}<br/>
                    {addr.district && `${addr.district}, `}{addr.city}
                  </div>
                  <div className="flex gap-2 mt-2 pt-3 border-t border-white/5">
                    <button onClick={() => handleEdit(addr)} className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1">
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    {!addr.isDefault && (
                      <button onClick={() => handleDelete(addr.id)} className="text-xs text-rose-500 hover:underline flex items-center gap-1 ml-auto">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
