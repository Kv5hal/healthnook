import { HeartPulse } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-slate-950"
          aria-label="HealthNook home"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-teal-700 text-white">
            <HeartPulse className="size-4" aria-hidden="true" />
          </span>
          HealthNook
        </Link>

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
