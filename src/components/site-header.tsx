import { CalendarPlus, LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";

import { SiteLogo } from "@/components/site-logo";
import { ButtonLink } from "@/components/ui/button-link";
import { getCurrentUser } from "@/lib/auth/session";

const navItems = [
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/#features", label: "Features" },
  { href: "/#use-cases", label: "Use cases" },
  { href: "/#impact", label: "Impact" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <SiteLogo
          iconClassName="size-9"
          priority
          textClassName="text-lg"
        />

        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-teal-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="/events"
            variant="ghost"
            size="sm"
            className="max-sm:hidden"
          >
            View Events
          </ButtonLink>
          {user ? (
            <>
              <ButtonLink
                href="/dashboard"
                variant="ghost"
                size="sm"
                className="max-sm:hidden"
              >
                <LayoutDashboard className="size-4" aria-hidden="true" />
                Dashboard
              </ButtonLink>
              <ButtonLink
                href="/dashboard/events/new"
                size="sm"
                aria-label="Create Event"
              >
                <CalendarPlus className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Create Event</span>
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink
                href="/login"
                variant="ghost"
                size="sm"
                className="max-sm:hidden"
              >
                <LogIn className="size-4" aria-hidden="true" />
                Log In
              </ButtonLink>
              <ButtonLink href="/signup" size="sm">
                Sign Up
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
