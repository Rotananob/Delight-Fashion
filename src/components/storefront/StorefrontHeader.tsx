"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, Crown } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/features/i18n/LanguageContext";
import { useAuth } from "@/features/auth/AuthContext";

export interface StorefrontHeaderProps {
  cartItemCount?: number;
  onOpenCart?: () => void;
  onOpenMobileMenu?: () => void;
  onOpenSearch?: () => void;
  onOpenAuthModal?: () => void;
}

const NAV_LINKS = [
  { label: "New Arrivals", href: "/products?filter=new" },
  { label: "T-Shirts", href: "/products?category=t-shirts" },
  { label: "Jackets", href: "/products?category=jackets" },
  { label: "Pants", href: "/products?category=pants" },
  { label: "Inner & Work", href: "/products?category=inner-work" },
  { label: "Track Orders", href: "/orders" },
  { label: "All Collection", href: "/products" },
];

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({
  cartItemCount = 0,
  onOpenCart,
  onOpenMobileMenu,
  onOpenSearch,
  onOpenAuthModal,
  }) => {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={twMerge(
        "sticky top-0 z-40 w-full transition-all duration-300 border-b",
        isScrolled
          ? "bg-[#0A0A0A]/90 backdrop-blur-md border-[#D4AF37]/30 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3"
          : "bg-[#0A0A0A] border-white/10 py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Mobile Hamburger & Search Trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 text-white/80 hover:text-[#D4AF37] transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={onOpenSearch}
            className="p-2 text-white/80 hover:text-[#D4AF37] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Logo */}
        <Link
          href="/"
          className="flex flex-col items-center lg:items-start group select-none"
        >
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.jpg" 
              alt="Delight Fashion Logo" 
              width={40}
              height={40}
              className="w-10 h-10 object-contain rounded-full border border-[#D4AF37]/30 group-hover:scale-105 transition-transform duration-300" 
            />
            <span className="text-sm sm:text-xl md:text-2xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-white uppercase font-sans">
              DELIGHT <span className="text-[#D4AF37]">FASHION</span>
            </span>
          </div>
          <span className="text-[9px] tracking-[0.35em] text-white/50 uppercase -mt-1 ml-7">
            Phnom Penh • Cambodia
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href.split("?")[0]);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={twMerge(
                  "text-xs font-semibold uppercase tracking-widest transition-colors duration-200 relative py-1",
                  isActive
                    ? "text-[#D4AF37]"
                    : "text-white/80 hover:text-[#D4AF37]"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#D4AF37] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Action Buttons (Search, Account, Cart) */}
        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => setLanguage(language === 'en' ? 'km' : 'en')}
            className="p-2 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-[#D4AF37] hover:bg-white/5 rounded-sm transition-colors flex items-center gap-1"
            aria-label="Switch Language"
          >
            {language === 'en' ? 'KH' : 'EN'}
          </button>
          <button
            onClick={onOpenSearch}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs text-white/60 hover:text-[#D4AF37] hover:bg-white/5 rounded-sm transition-colors border border-white/10"
            aria-label="Search items"
          >
            <Search className="w-4 h-4 text-[#D4AF37]" />
            <span className="uppercase tracking-wider">{t('header.search')}</span>
          </button>

          <Link
            href={user ? "/profile" : "/login"}
            className="p-2 text-white/80 hover:text-[#D4AF37] hover:bg-white/5 rounded-sm transition-colors"
            aria-label="Account profile"
          >
            <User className="w-5 h-5" />
          </Link>

          <button
            onClick={onOpenCart}
            className="relative p-2 text-white/80 hover:text-[#D4AF37] hover:bg-white/5 rounded-sm transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#0A0A0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
