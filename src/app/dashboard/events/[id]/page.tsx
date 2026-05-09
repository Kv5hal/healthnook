import {
  BarChart3,
  CalendarClock,
  Eye,
  MapPin,
  Megaphone,
  Pencil,
  QrCode,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { setEventPublishedAction } from "@/app/dashboard/events/actions";
import { AuthMessage } from "@/components/auth-message";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { RsvpTable, VolunteerTable } from "@/components/events/signup-tables";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SubmitButton } from "@/components/ui/submit-button";
import { calculateEventImpact } from "@/lib/events/analytics";
import { getSignupCountsForEvent } from "@/lib/events/counts";
import { formatEventDateRange } from "@/lib/events/format";
import { createClient } from "@/lib/supabase/server";

type ManageEventPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ManageEventPage({
  params,
  searchParams,
}: ManageEventPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/events/${id}`);
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!organization) {
    redirect("/onboarding/organization");
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("organization_id", organization.id)
    .maybeSingle();

  if (!event) {
    notFound();
  }

  const togglePublished = setEventPublishedAction.bind(
    null,
    event.id,
    !event.published,
    `/dashboard/events/${event.id}`,
  );
  const counts = await getSignupCountsForEvent(supabase, event.id);
  const [{ data: rsvps }, { data: volunteers }] = await Promise.all([
    supabase
      .from("rsvps")
      .select(
        "id, name, email, phone, guests, notes, checked_in, checked_in_at, created_at",
      )
      .eq("event_id", event.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("volunteers")
      .select("id, name, email, phone, preferred_role, notes, created_at")
      .eq("event_id", event.id)
      .order("created_at", { ascending: false }),
  ]);
  const rsvpList = rsvps ?? [];
  const volunteerList = volunteers ?? [];
  const impact = calculateEventImpact(event, rsvpList, volunteerList);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                  Manage Event
                </p>
                <EventStatusBadge
                  published={event.published}
                  startTime={event.start_time}
                />
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                {event.title}
              </h1>
              <p className="mt-3 max-w-3xl leading-8 text-slate-600">
                {event.description}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink
                href={`/dashboard/events/${event.id}/edit`}
                variant="outline"
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit Event
              </ButtonLink>
              {event.published ? (
                <ButtonLink href={`/events/${event.id}`} target="_blank">
                  <Eye className="size-4" aria-hidden="true" />
                  Public Page
                </ButtonLink>
              ) : null}
              <ButtonLink
                href={`/dashboard/events/${event.id}/impact`}
                variant="outline"
              >
                <BarChart3 className="size-4" aria-hidden="true" />
                Impact
              </ButtonLink>
              <ButtonLink href={`/dashboard/events/${event.id}/check-in`}>
                <QrCode className="size-4" aria-hidden="true" />
                Check-In
              </ButtonLink>
              <ButtonLink
                href={`/dashboard/events/${event.id}/outreach`}
                variant="outline"
              >
                <Megaphone className="size-4" aria-hidden="true" />
                Outreach
              </ButtonLink>
            </div>
          </div>

          <AuthMessage error={query.error} message={query.message} />

          <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <SurfaceCard>
              <h2 className="text-xl font-semibold text-slate-950">
                Event Details
              </h2>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarClock className="size-4" aria-hidden="true" />
                    Date and time
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {formatEventDateRange(event.start_time, event.end_time)}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <MapPin className="size-4" aria-hidden="true" />
                    Location
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {event.location}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-700">
                    Event type
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {event.event_type}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-700">
                    Contact
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {event.contact_email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-700">
                    Attendee cap
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {event.max_attendees ?? "No cap set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-700">
                    Volunteer slots
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {event.volunteer_slots_needed ?? "Not set"}
                  </dd>
                </div>
              </dl>
            </SurfaceCard>

            <SurfaceCard>
              <h2 className="text-xl font-semibold text-slate-950">
                Publishing
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Published events are visible on `/events` and get a shareable
                public page. Draft events stay organizer-only.
              </p>
              <form action={togglePublished} className="mt-5">
                <SubmitButton variant={event.published ? "secondary" : "primary"}>
                  {event.published ? "Move to Draft" : "Publish Event"}
                </SubmitButton>
              </form>
            </SurfaceCard>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <UsersRound className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                RSVPs
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                {counts.rsvps} RSVPs representing {impact.expectedAttendees}{" "}
                expected attendees.
              </p>
            </SurfaceCard>
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <UsersRound className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                Volunteers
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                {counts.volunteers} people have offered to volunteer.
              </p>
            </SurfaceCard>
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-[#fff1ed] text-[#b5482d]">
                <UserCheck className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                Check-In
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                {counts.checkedIn} RSVP records checked in. Open the QR
                check-in page for event-day attendance tracking.
              </p>
              <div className="mt-4">
                <ButtonLink
                  href={`/dashboard/events/${event.id}/check-in`}
                  variant="outline"
                  size="sm"
                >
                  <QrCode className="size-4" aria-hidden="true" />
                  Open Check-In
                </ButtonLink>
              </div>
            </SurfaceCard>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  RSVP List
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Private organizer view. Public visitors cannot see this list.
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {impact.expectedAttendees} expected attendees
              </p>
            </div>
            <div className="mt-5">
              <RsvpTable rsvps={rsvpList} />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Volunteer List
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Use this for role planning, outreach, and event-day staffing.
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {volunteerList.length} volunteer signups
              </p>
            </div>
            <div className="mt-5">
              <VolunteerTable volunteers={volunteerList} />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
