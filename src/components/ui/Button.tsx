"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center gap-3 rounded-full px-8 py-4 font-display font-bold uppercase tracking-wider text-sm transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer";

  const variants: Record<Variant, string> = {
    primary:
      "bg-gradient-to-r from-red to-[#ff5b3a] text-white shadow-[0_10px_30px_rgba(224,38,29,0.35)] hover:shadow-[0_14px_36px_rgba(224,38,29,0.5)]",
    ghost:
      "bg-transparent border border-line text-foreground hover:border-gold/50 hover:text-gold",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function EyebrowBadge({ children }: { children: ReactNode }) {
  return (
    <div className="eyebrow-line mb-4 inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.28em] text-gold">
      {children}
    </div>
  );
}
