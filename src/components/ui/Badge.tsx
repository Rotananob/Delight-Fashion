import React from "react";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "gold" | "dark" | "outline" | "success" | "danger" | "neutral";
  size?: "sm" | "md";
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "gold",
  size = "sm",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium uppercase tracking-wider rounded-sm select-none";

  const variantStyles = {
    gold:
      "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.1)]",
    dark: "bg-gray-50 text-foreground/90 border border-border",
    outline: "border border-white/20 text-foreground/80 bg-transparent",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    neutral: "bg-black/10 text-foreground/70 border border-border",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
