import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-teal-700 text-white shadow-sm shadow-teal-950/10 hover:bg-teal-800 focus-visible:outline-teal-700",
  secondary:
    "border-white/70 bg-white text-slate-950 shadow-sm shadow-slate-950/10 hover:bg-emerald-50 focus-visible:outline-white",
  outline:
    "border-slate-200 bg-white text-slate-900 hover:border-teal-200 hover:bg-teal-50 focus-visible:outline-teal-700",
  ghost:
    "border-transparent bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline-teal-700",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
