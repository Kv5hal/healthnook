import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function SubmitButton({
  className,
  children,
  variant = "primary",
  ...props
}: SubmitButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary"
          ? "border-transparent bg-teal-700 text-white shadow-sm shadow-teal-950/10 hover:bg-teal-800 focus-visible:outline-teal-700"
          : "border-slate-200 bg-white text-slate-900 hover:border-teal-200 hover:bg-teal-50 focus-visible:outline-teal-700",
        className,
      )}
      type="submit"
      {...props}
    >
      {children}
    </button>
  );
}
