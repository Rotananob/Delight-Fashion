import React from "react";
import Link from "next/link";
import { Crown, MapPin, Phone, Clock, Send, ShieldCheck } from "lucide-react";

export const StorefrontFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-white/10 text-white/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="Delight Fashion Logo" 
                className="w-8 h-8 object-contain rounded-full border border-[#D4AF37]/30" 
              />
              <span className="text-xl font-bold tracking-[0.2em] text-white uppercase font-sans">
                DELIGHT <span className="text-[#D4AF37]">FASHION</span>
              </span>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Phnom Penh&apos;s premier destination for luxury men&apos;s clothing. Tailored structured silhouettes, modern outerwear, and refined daily wear.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                100% Guaranteed Premium Quality
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white border-l-2 border-[#D4AF37] pl-3">
              Collections
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-medium">
              <li>
                <Link href="/products?filter=new" className="hover:text-[#D4AF37] transition-colors">
                  New Arrivals (2026 Season)
                </Link>
              </li>
              <li>
                <Link href="/products?category=t-shirts" className="hover:text-[#D4AF37] transition-colors">
                  Luxury Men&apos;s T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=jackets" className="hover:text-[#D4AF37] transition-colors">
                  Outerwear &amp; Bomber Jackets
                </Link>
              </li>
              <li>
                <Link href="/products?category=pants" className="hover:text-[#D4AF37] transition-colors">
                  Tailored Trousers &amp; Pants
                </Link>
              </li>
              <li>
                <Link href="/products?category=inner-work" className="hover:text-[#D4AF37] transition-colors">
                  Inner &amp; Work Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* Showroom / Phnom Penh Location */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white border-l-2 border-[#D4AF37] pl-3">
              Phnom Penh Showroom
            </h4>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  St 271, Sangkat Tumnop Teuk, Khan Chamkar Mon, Phnom Penh, Cambodia
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+855 (0) 12 345 678 / 098 765 432</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Open Daily: 8:30 AM – 8:30 PM</span>
              </div>
            </div>
          </div>

          {/* Payment & Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white border-l-2 border-[#D4AF37] pl-3">
              Cambodia Payment &amp; Support
            </h4>
            <p className="text-xs text-white/60">
              We accept local instant payments via ABA Bank QR, PayWay, and Cash on Delivery (COD) across Phnom Penh and all provinces.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://t.me/DelightFashionKH"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#229ED9]/15 border border-[#229ED9]/30 text-[#229ED9] hover:bg-[#229ED9]/25 text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Telegram Support
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Delight Fashion Co., Ltd. Phnom Penh, Cambodia. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/admin/dashboard" className="text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors font-medium">
              Shop Owner Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
