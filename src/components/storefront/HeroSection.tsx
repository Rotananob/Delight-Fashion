"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/features/i18n/LanguageContext";

export const HeroSection: React.FC<{ onExploreClick?: () => void }> = () => {
  const { t } = useLanguage();
  return (
    <section className="relative w-full overflow-hidden bg-white border-b border-gray-200 py-16 lg:py-24">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left"
          >
            {/* Top Tagline */}
            <div className="inline-flex items-center gap-2 self-center lg:self-start px-3.5 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-black text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black uppercase leading-tight">
              {t('hero.title')} <br />
              <span className="text-black">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-500 max-w-xl leading-relaxed mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  {t('hero.shopNow')}
                </Button>
              </Link>
              <Link href="/products?filter=new" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('hero.viewLookbook')}
                </Button>
              </Link>
            </div>

            {/* Guarantee Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-200 text-left">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-black shrink-0" />
                <span className="text-xs text-gray-500 font-medium">
                  Instant COD / ABA QR
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                <span className="text-xs text-gray-500 font-medium">
                  Phnom Penh Same-Day
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2.5">
                <Crown className="w-4 h-4 text-black shrink-0" />
                <span className="text-xs text-gray-500 font-medium">
                  Luxury Tailored Fit
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Showcase Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-sm overflow-hidden border border-gray-200 shadow-sm group">
              <Image
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=80"
                alt="Delight Fashion Phnom Penh Men's Silk-Blend Tee"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-white tracking-wide font-semibold">
                    Featured Piece
                  </span>
                  <h3 className="text-lg font-bold text-white uppercase">
                    Silk-Blend Pocket Tee
                  </h3>
                </div>
                <div className="px-3 py-1.5 rounded-sm bg-white text-black font-bold text-sm">
                  $38.00
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
