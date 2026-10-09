"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { Crown, MapPin, Phone, ArrowRight, User, Package, LogOut } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAuth } from "@/features/auth/AuthContext";

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

const NAV_ITEMS = [
  { label: "New Arrivals", href: "/products?filter=new" },
  { label: "T-Shirts", href: "/products?category=t-shirts" },
  { label: "Jackets & Outerwear", href: "/products?category=jackets" },
  { label: "Pants & Trousers", href: "/products?category=pants" },
  { label: "Inner & Work Wear", href: "/products?category=inner-work" },
  { label: "Track Orders", href: "/orders" },
  { label: "All Men's Collection", href: "/products" },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      title="DELIGHT FASHION"
      footer={
        <div className="flex flex-col gap-3 text-xs text-foreground/70">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>Phnom Penh Showroom • St 271</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>+855 (0) 12 345 678</span>
          </div>

          {user ? (
            <div className="mt-2 pt-3 border-t border-border flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-black truncate max-w-[180px]">
                  {user.displayName || user.email}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">
                  {user.role === "admin" ? "Admin" : "Customer"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-black text-center font-bold text-[11px] rounded-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  Profile
                </Link>
                <Link
                  href="/orders"
                  onClick={onClose}
                  className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-black text-center font-bold text-[11px] rounded-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Package className="w-3.5 h-3.5" />
                  Orders
                </Link>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-1 py-2 px-3 text-red-600 hover:bg-red-50 text-[11px] font-bold rounded-sm uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                if (onOpenAuth) onOpenAuth();
              }}
              className="w-full mt-2 py-2.5 px-4 bg-[#D4AF37] text-[#0A0A0A] font-bold text-xs rounded-sm uppercase tracking-wider hover:bg-[#E6C86E] transition-colors"
            >
              Customer Account / Login
            </button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Brand Badge */}
        <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.jpg" 
              alt="Delight Fashion Logo" 
              className="w-8 h-8 object-contain rounded-full border border-[#D4AF37]/30" 
            />
            <span className="text-base sm:text-lg font-bold tracking-[0.1em] sm:tracking-[0.2em] text-foreground uppercase font-sans">
              DELIGHT <span className="text-[#D4AF37]">FASHION</span>
            </span>
          </div>
        </div>

        {/* Admin Quick Banner (If user has Admin role) */}
        {user?.role === "admin" && (
          <div className="px-3">
            <Link
              href="/admin/dashboard"
              onClick={onClose}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider bg-black text-[#D4AF37] border border-[#D4AF37]/60 shadow-sm transition-all hover:bg-[#D4AF37] hover:text-black"
            >
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#D4AF37]" />
                <span>Admin Portal</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Links */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={twMerge(
                  "flex items-center justify-between px-3 py-3 rounded-sm text-sm font-semibold uppercase tracking-wider transition-colors",
                  isActive
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] border-l-2 border-[#D4AF37]"
                    : "text-foreground/80 hover:text-[#D4AF37] hover:bg-black/5"
                )}
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]/50" />
              </Link>
            );
          })}
        </nav>
      </div>
    </Drawer>
  );
};
