import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function SurfaceCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
