import React from "react";
import { twMerge } from "tailwind-merge";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={twMerge(
        "animate-pulse bg-[#1A1A1A] rounded-sm border border-border",
        className
      )}
      {...props}
    />
  );
};
