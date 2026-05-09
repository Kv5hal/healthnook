import {
  Accessibility,
  CalendarClock,
  ClipboardCheck,
  HandHeart,
  Languages,
  Mail,
  Megaphone,
  MapPin,
  QrCode,
} from "lucide-react";
import { notFound } from "next/navigation";

import { createRsvpAction, createVolunteerAction } from "./actions";
import { AuthMessage } from "@/components/auth-message";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { RsvpForm } from "@/components/events/rsvp-form";
import { VolunteerForm } from "@/components/events/volunteer-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { formatEventDateRange } from "@/lib/events/format";
import { createClient } from "@/lib/supabase/server";

type PublicEventPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

type OrganizationRelation =
  | {
      name: string;
      description: string;
      contact_email: string;
      website_url: string | null;
    }
  | {
      name: string;
      description: string;
      contact_email: string;
      website_url: string | null;
    }[]
  | null;

function getOrganization(organization: OrganizationRelation) {
  if (Array.isArray(organization)) {
    return organization[0] ?? null;
  }

  return organization;
}

export default async function PublicEventPage({
  params,
  searchParams,
}: PublicEventPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select(
      "*, organizations(name, description, contact_email, website_url)",
    )
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (!event) {
    notFound();
  }

  const organization = getOrganization(event.organizations);
  const rsvpAction = createRsvpAction.bind(null, event.id);
  const volunteerAction = createVolunteerAction.bind(null, event.id);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: ownedOrganization } = user
    ? await supabase
        .from("organizations")
        .select("id")
        .eq("id", event.organization_id)
        .eq("owner_id", user.id)
        .maybeSingle()
    : { data: null };
  const isOrganizerOwner = Boolean(ownedOrganization);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9]">
        <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <EventStatusBadge
                  published={event.published}
                  startTime={event.start_time}
                />
                <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {event.event_type}
                </span>
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950">
                {event.title}
              </h1>
              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                {event.description}
              </p>
            </div>
            <SurfaceCard>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Organized By
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                {organization?.name ?? "Community organizer"}
              </h2>
              {organization?.description ? (
                <p className="mt-3 leading-7 text-slate-600">
                  {organization.description}
                </p>
              ) : null}
            </SurfaceCard>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 w-full max-w-7xl">
            <AuthMessage error={query.error} message={query.message} />
          </div>

          <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
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
                    Attendee cap
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {event.max_attendees ?? "No cap set"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-slate-700">
                    Volunteers needed
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {event.volunteer_slots_needed ?? "Not set"}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Mail className="size-4" aria-hidden="true" />
                    Contact
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {event.contact_email}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Languages className="size-4" aria-hidden="true" />
                    Language notes
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {event.language_notes ?? "No language notes added yet."}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Accessibility className="size-4" aria-hidden="true" />
                    Accessibility notes
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {event.accessibility_notes ??
                      "No accessibility notes added yet."}
                  </p>
                </div>
              </div>
            </SurfaceCard>

            <div className="space-y-4">
              {isOrganizerOwner ? (
                <SurfaceCard>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                    Organizer Tools
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-slate-950">
                    Manage this event
                  </h2>
                  <p className="mt-3 leading-7 text-slate-600">
                    This section is visible because you own this event.
                  </p>
                  <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                    <ButtonLink
                      href={`/dashboard/events/${event.id}`}
                      variant="outline"
                      size="sm"
                    >
                      Manage
                    </ButtonLink>
                    <ButtonLink
                      href={`/dashboard/events/${event.id}/check-in`}
                      variant="outline"
                      size="sm"
                    >
                      <QrCode className="size-4" aria-hidden="true" />
                      Check-In
                    </ButtonLink>
                    <ButtonLink
                      href={`/dashboard/events/${event.id}/outreach`}
                      variant="outline"
                      size="sm"
                    >
                      <Megaphone className="size-4" aria-hidden="true" />
                      Outreach
                    </ButtonLink>
                  </div>
                </SurfaceCard>
              ) : null}
              <SurfaceCard>
                <div className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <ClipboardCheck className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">
                  RSVP
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Let the organizer know you plan to attend. You can include
                  guests and basic logistics notes.
                </p>
                <div className="mt-5">
                  <RsvpForm action={rsvpAction} />
                </div>
              </SurfaceCard>
              <SurfaceCard>
                <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <HandHeart className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-slate-950">
                  Volunteer
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Offer to help with setup, check-in, translation, outreach, or
                  other event-day support.
                </p>
                <div className="mt-5">
                  <VolunteerForm action={volunteerAction} />
                </div>
              </SurfaceCard>
              <SurfaceCard>
                <h2 className="text-xl font-semibold text-slate-950">
                  Community awareness note
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  This event information is for community awareness and
                  logistics only, not medical advice.
                </p>
              </SurfaceCard>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
