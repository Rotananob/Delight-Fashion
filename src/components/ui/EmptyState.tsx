import React from "react";
import { LucideIcon, ShoppingBag } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = ShoppingBag,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-white/5 bg-[#111111]/50 rounded-sm">
      <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-5 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
        <Icon className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-semibold uppercase tracking-wider text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-white/60 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="gold" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
