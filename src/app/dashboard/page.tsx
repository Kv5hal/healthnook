import {
  CalendarPlus,
  ClipboardList,
  ExternalLink,
  Pencil,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/(auth)/actions";
import { AuthMessage } from "@/components/auth-message";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SubmitButton } from "@/components/ui/submit-button";
import { getCountsForEvent, getSignupCountsByEvent } from "@/lib/events/counts";
import { formatEventDateRange } from "@/lib/events/format";
import { createClient } from "@/lib/supabase/server";

type DashboardPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name, description, contact_email, website_url")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!organization) {
    redirect("/onboarding/organization");
  }

  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_type, start_time, end_time, location, published")
    .eq("organization_id", organization.id)
    .order("start_time", { ascending: true });

  const eventList = events ?? [];
  const countsByEvent = await getSignupCountsByEvent(
    supabase,
    eventList.map((event) => event.id),
  );
  const publishedCount = eventList.filter((event) => event.published).length;
  const draftCount = eventList.length - publishedCount;
  const totalRsvps = eventList.reduce(
    (sum, event) => sum + getCountsForEvent(countsByEvent, event.id).rsvps,
    0,
  );
  const totalVolunteers = eventList.reduce(
    (sum, event) => sum + getCountsForEvent(countsByEvent, event.id).volunteers,
    0,
  );

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Organizer Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                {organization.name}
              </h1>
              <p className="mt-3 max-w-3xl leading-8 text-slate-600">
                {organization.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink href="/dashboard/events/new">
                <CalendarPlus className="size-4" aria-hidden="true" />
                Create Event
              </ButtonLink>
              <form action={signOutAction}>
                <SubmitButton variant="secondary">Log Out</SubmitButton>
              </form>
            </div>
          </div>

          <AuthMessage error={params.error} message={params.message} />

          <div className="grid gap-4 md:grid-cols-3">
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <UsersRound className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                Organization Ready
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                Contact email: {organization.contact_email}
              </p>
              {organization.website_url ? (
                <a
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
                  href={organization.website_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open public link
                  <ExternalLink className="size-4" aria-hidden="true" />
                </a>
              ) : null}
            </SurfaceCard>

            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <ClipboardList className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                Event Status
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                {publishedCount} published | {draftCount} draft
              </p>
            </SurfaceCard>

            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-[#fff1ed] text-[#b5482d]">
                <UserCheck className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                Signups Received
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                {totalRsvps} RSVPs | {totalVolunteers} volunteers
              </p>
            </SurfaceCard>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Your Events
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Manage drafts and published event pages for your organization.
                </p>
              </div>
              <ButtonLink href="/dashboard/events/new" size="sm">
                <CalendarPlus className="size-4" aria-hidden="true" />
                New Event
              </ButtonLink>
            </div>

            {eventList.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-lg font-semibold text-slate-950">
                  No events yet.
                </h3>
                <p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">
                  Create your first health event as a draft, then publish it
                  when the details are ready.
                </p>
                <div className="mt-5">
                  <ButtonLink href="/dashboard/events/new">
                    <CalendarPlus className="size-4" aria-hidden="true" />
                    Create Event
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {eventList.map((event) => (
                  <article
                    className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                    key={event.id}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-950">
                          {event.title}
                        </h3>
                        <EventStatusBadge
                          published={event.published}
                          startTime={event.start_time}
                        />
                      </div>
                      <p className="mt-2 text-sm font-medium text-teal-700">
                        {event.event_type}
                      </p>
                      <p className="mt-2 leading-7 text-slate-600">
                        {formatEventDateRange(event.start_time, event.end_time)}{" "}
                        | {event.location}
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-500">
                        {getCountsForEvent(countsByEvent, event.id).rsvps} RSVPs
                        | {getCountsForEvent(countsByEvent, event.id).volunteers}{" "}
                        volunteers
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <ButtonLink
                        href={`/dashboard/events/${event.id}`}
                        variant="outline"
                        size="sm"
                      >
                        Manage
                      </ButtonLink>
                      <ButtonLink
                        href={`/dashboard/events/${event.id}/edit`}
                        variant="ghost"
                        size="sm"
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                        Edit
                      </ButtonLink>
                      {event.published ? (
                        <ButtonLink
                          href={`/events/${event.id}`}
                          variant="ghost"
                          size="sm"
                        >
                          Public Page
                        </ButtonLink>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
