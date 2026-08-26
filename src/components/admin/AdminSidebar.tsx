"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Store,
  Crown,
  X,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/Badge";

export interface AdminSidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onCloseMobile,
}) => {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-border w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <img 
            src="/logo.jpg" 
            alt="Delight Fashion Logo" 
            className="w-8 h-8 object-contain rounded-full border border-[#D4AF37]/30" 
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.2em] text-foreground uppercase">
              DELIGHT <span className="text-[#D4AF37]">ADMIN</span>
            </span>
            <span className="text-[9px] text-foreground/50 tracking-widest uppercase">
              Phnom Penh Showroom
            </span>
          </div>
        </Link>

        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 text-foreground/60 hover:text-[#D4AF37]"
          aria-label="Close admin menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Admin Role Tag */}
      <div className="px-6 py-3 bg-white border-b border-border flex items-center justify-between">
        <span className="text-xs text-foreground/60">Access Level</span>
        <Badge variant="gold" size="sm">
          SHOP OWNER
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onCloseMobile}
              className={twMerge(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-widest transition-all duration-200",
                isActive
                  ? "bg-[#D4AF37] text-[#0A0A0A] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                  : "text-foreground/70 hover:text-[#D4AF37] hover:bg-black/5"
              )}
            >
              <Icon className={twMerge("w-4 h-4", isActive ? "text-[#0A0A0A]" : "text-[#D4AF37]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Storefront Link */}
      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground/60 hover:text-[#D4AF37] hover:bg-black/5 rounded-sm transition-colors"
        >
          <Store className="w-4 h-4 text-[#D4AF37]" />
          <span>Exit to Storefront</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Modal/Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
