"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A0A0A] disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-wide";

    const variantStyles = {
      primary:
        "bg-[#D4AF37] text-[#0A0A0A] hover:bg-[#E6C86E] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] font-semibold",
      gold:
        "bg-gradient-to-r from-[#D4AF37] via-[#E6C86E] to-[#B59020] text-[#0A0A0A] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] font-bold",
      secondary:
        "bg-white text-[#0A0A0A] hover:bg-gray-100 hover:shadow-lg font-semibold",
      outline:
        "border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]",
      ghost: "text-white/80 hover:text-[#D4AF37] hover:bg-white/5",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-2 rounded-sm gap-1.5",
      md: "text-sm px-5 py-2.5 rounded-sm gap-2",
      lg: "text-base px-7 py-3.5 rounded-sm gap-2.5 uppercase tracking-wider",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
        disabled={disabled || isLoading}
        className={twMerge(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
