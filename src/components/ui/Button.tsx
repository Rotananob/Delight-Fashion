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
      "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none tracking-wide";

    const variantStyles = {
      primary:
        "bg-black text-white hover:bg-gray-800 font-semibold",
      gold:
        "bg-black text-white hover:bg-gray-900 shadow-md font-bold",
      secondary:
        "bg-white border border-gray-200 text-black hover:bg-gray-50 font-semibold",
      outline:
        "border border-gray-200 text-black hover:bg-gray-100",
      ghost: "text-gray-800 hover:text-black hover:bg-gray-100",
    };

    const sizeStyles = {
      sm: "text-xs sm:text-sm px-4 py-2.5 rounded-sm gap-1.5 leading-normal font-khmer",
      md: "text-sm sm:text-base px-6 py-3 rounded-sm gap-2 leading-normal font-khmer",
      lg: "text-base sm:text-lg px-8 py-4 rounded-sm gap-2.5 uppercase tracking-wider leading-relaxed font-khmer",
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
