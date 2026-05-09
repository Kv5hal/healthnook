import { Home, Search } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[calc(100svh-8rem)] items-center bg-[#f6fbf9] px-4 py-16 sm:px-6 lg:px-8">
        <SurfaceCard className="mx-auto w-full max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
            Page Not Found
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
            This HealthNook page is not available.
          </h1>
          <p className="mt-4 leading-8 text-slate-600">
            The event may be unpublished, the link may have changed, or the page
            may not exist yet.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/">
              <Home className="size-4" aria-hidden="true" />
              Home
            </ButtonLink>
            <ButtonLink href="/events" variant="secondary">
              <Search className="size-4" aria-hidden="true" />
              View Events
            </ButtonLink>
          </div>
        </SurfaceCard>
      </main>
      <SiteFooter />
    </>
  );
}
