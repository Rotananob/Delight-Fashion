import React from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "gold" | "bordered";
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  const baseStyles =
    "bg-[#111111] border border-white/10 rounded-sm transition-all duration-300 overflow-hidden";

  const variantStyles = {
    default: "",
    hover:
      "hover:border-[#D4AF37]/50 hover:shadow-[0_4px_25px_rgba(212,175,55,0.12)] hover:-translate-y-1",
    gold: "border-[#D4AF37]/30 bg-gradient-to-b from-[#111111] to-[#171717]",
    bordered: "border-white/15 bg-[#0A0A0A]",
  };

  return (
    <div
      className={twMerge(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};
