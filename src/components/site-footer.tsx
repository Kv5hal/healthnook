import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <SiteLogo iconClassName="size-8" iconSize={32} />

        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/about" className="hover:text-teal-700">
            About
          </Link>
          <Link href="/#features" className="hover:text-teal-700">
            Features
          </Link>
          <Link href="/#use-cases" className="hover:text-teal-700">
            Use cases
          </Link>
          <Link href="/#impact" className="hover:text-teal-700">
            Impact
          </Link>
        </div>
      </div>
    </footer>
  );
}
