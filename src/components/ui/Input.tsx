import React from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs sm:text-sm font-medium tracking-wider text-foreground/80 uppercase select-none leading-loose font-khmer"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-foreground/40 pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              "w-full bg-white border border-border rounded-sm px-4 py-3 sm:py-3.5 text-base leading-relaxed text-foreground placeholder:text-foreground/30 transition-all duration-200 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-50 disabled:cursor-not-allowed font-khmer",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-foreground/40">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <span className="text-xs text-rose-400 font-normal">{error}</span>
        )}
        {!error && helperText && (
          <span className="text-xs text-foreground/40 font-normal">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
