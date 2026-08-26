"use client";

import React from "react";
import { Menu, Bell, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
  unreadOrderCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onOpenMobileMenu,
  unreadOrderCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-20 w-full bg-[#0A0A0A]/90 backdrop-blur-md border-b border-border px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-foreground/80 hover:text-[#D4AF37] transition-colors"
          aria-label="Toggle admin menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Delight Fashion Admin Panel
          </span>
          <Badge variant="neutral" size="sm" className="hidden sm:inline-flex">
            CAMBODIA HQ
          </Badge>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-gray-50 border border-border text-xs font-semibold text-foreground/80 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors uppercase tracking-wider"
        >
          <span>View Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Telegram Alert / Order Notification Bell */}
        <Link
          href="/admin/orders"
          className="relative p-2 text-foreground/80 hover:text-[#D4AF37] transition-colors rounded-sm bg-black/5"
          title="New Telegram Order Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadOrderCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0A0A0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {unreadOrderCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
