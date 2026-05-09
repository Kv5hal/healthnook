import { CalendarClock, MapPin } from "lucide-react";

import { EventStatusBadge } from "@/components/events/event-status-badge";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { formatEventDateRange } from "@/lib/events/format";
import { createClient } from "@/lib/supabase/server";

type OrganizationRelation = { name: string } | { name: string }[] | null;

function getOrganizationName(organization: OrganizationRelation) {
  if (Array.isArray(organization)) {
    return organization[0]?.name ?? "Community organizer";
  }

  return organization?.name ?? "Community organizer";
}

export default async function PublicEventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select(
      "id, title, event_type, description, start_time, end_time, location, published, organizations(name)",
    )
    .eq("published", true)
    .order("start_time", { ascending: true });

  const eventList = events ?? [];

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9]">
        <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Public Events
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-slate-950">
              Find health events shared by local community groups.
            </h1>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">
              Browse published HealthNook events. RSVP and volunteer signup
              forms will be added in Phase 5.
            </p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eventList.length === 0 ? (
              <SurfaceCard className="md:col-span-2 lg:col-span-3">
                <h2 className="text-xl font-semibold text-slate-950">
                  No published events yet.
                </h2>
                <p className="mt-2 leading-7 text-slate-600">
                  Once organizers publish events, they will appear here.
                </p>
              </SurfaceCard>
            ) : (
              eventList.map((event) => (
                <SurfaceCard key={event.id} className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <EventStatusBadge
                      published={event.published}
                      startTime={event.start_time}
                    />
                    <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      {event.event_type}
                    </span>
                  </div>
                  <h2 className="mt-5 text-xl font-semibold text-slate-950">
                    {event.title}
                  </h2>
                  <p className="mt-2 text-sm font-medium text-teal-700">
                    {getOrganizationName(event.organizations)}
                  </p>
                  <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                    {event.description}
                  </p>
                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <p className="flex gap-2">
                      <CalendarClock
                        className="mt-0.5 size-4 shrink-0 text-teal-700"
                        aria-hidden="true"
                      />
                      {formatEventDateRange(event.start_time, event.end_time)}
                    </p>
                    <p className="flex gap-2">
                      <MapPin
                        className="mt-0.5 size-4 shrink-0 text-teal-700"
                        aria-hidden="true"
                      />
                      {event.location}
                    </p>
                  </div>
                  <div className="mt-6">
                    <ButtonLink href={`/events/${event.id}`} variant="outline">
                      View Event
                    </ButtonLink>
                  </div>
                </SurfaceCard>
              ))
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
