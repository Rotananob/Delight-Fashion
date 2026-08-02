"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Drawer } from "@/components/ui/Drawer";
import { Crown, MapPin, Phone, ArrowRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

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
  { label: "All Men's Collection", href: "/products" },
];

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const pathname = usePathname();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="left"
      title="DELIGHT FASHION"
      footer={
        <div className="flex flex-col gap-3 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span>Phnom Penh Showroom • St 271</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>+855 (0) 12 345 678</span>
          </div>
          <button
            onClick={() => {
              onClose();
              if (onOpenAuth) onOpenAuth();
            }}
            className="w-full mt-2 py-2.5 px-4 bg-[#D4AF37] text-[#0A0A0A] font-bold text-xs rounded-sm uppercase tracking-wider hover:bg-[#E6C86E] transition-colors"
          >
            Customer Account / Login
          </button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Brand Badge */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0E0E0E] z-10">
          <div className="flex items-center gap-2">
            <img 
              src="/logo.jpg" 
              alt="Delight Fashion Logo" 
              className="w-8 h-8 object-contain rounded-full border border-[#D4AF37]/30" 
            />
            <span className="text-lg font-bold tracking-[0.2em] text-white uppercase font-sans">
              DELIGHT <span className="text-[#D4AF37]">FASHION</span>
            </span>
          </div>
        </div>

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
                    : "text-white/80 hover:text-[#D4AF37] hover:bg-white/5"
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
