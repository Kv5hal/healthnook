import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  iconClassName?: string;
  iconSize?: number;
  priority?: boolean;
  textClassName?: string;
};

export function SiteLogo({
  className,
  iconClassName,
  iconSize = 36,
  priority = false,
  textClassName,
}: SiteLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex min-w-0 items-center gap-2 font-semibold text-slate-950",
        className,
      )}
      aria-label="HealthNook home"
    >
      <Image
        alt=""
        aria-hidden="true"
        className={cn("shrink-0", iconClassName)}
        height={iconSize}
        priority={priority}
        src="/icon.png"
        width={iconSize}
      />
      <span className={cn("tracking-normal", textClassName)}>HealthNook</span>
    </Link>
  );
}
