import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  HandHeart,
  Megaphone,
  QrCode,
  UsersRound,
} from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { calculateEventImpact } from "@/lib/events/analytics";
import { formatEventDateRange } from "@/lib/events/format";
import { createClient } from "@/lib/supabase/server";

type ImpactPageProps = {
  params: Promise<{ id: string }>;
};

type MetricCardProps = {
  label: string;
  value: string | number;
  helper: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

function MetricCard({ label, value, helper, icon: Icon }: MetricCardProps) {
  return (
    <SurfaceCard>
      <div className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
        <Icon className="size-5" aria-hidden={true} />
      </div>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
      <p className="mt-2 leading-7 text-slate-600">{helper}</p>
    </SurfaceCard>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  const cappedValue = Math.max(0, Math.min(value, 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm font-semibold text-slate-700">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 rounded-lg bg-slate-100">
        <div
          className="h-3 rounded-lg bg-teal-700"
          style={{ width: `${cappedValue}%` }}
        />
      </div>
    </div>
  );
}

export default async function ImpactPage({ params }: ImpactPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/events/${id}/impact`);
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

  const [{ data: rsvps }, { data: volunteers }] = await Promise.all([
    supabase
      .from("rsvps")
      .select("id, guests, checked_in")
      .eq("event_id", event.id),
    supabase.from("volunteers").select("id").eq("event_id", event.id),
  ]);
  const impact = calculateEventImpact(event, rsvps ?? [], volunteers ?? []);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Impact Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                {event.title}
              </h1>
              <p className="mt-3 flex items-center gap-2 leading-7 text-slate-600">
                <CalendarClock className="size-4" aria-hidden="true" />
                {formatEventDateRange(event.start_time, event.end_time)}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink href={`/dashboard/events/${event.id}`} variant="outline">
                Manage Event
              </ButtonLink>
              <ButtonLink
                href={`/dashboard/events/${event.id}/check-in`}
                variant="outline"
              >
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
              {event.published ? (
                <ButtonLink href={`/events/${event.id}`} target="_blank">
                  Public Page
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              helper="People who submitted the RSVP form."
              icon={ClipboardList}
              label="Total RSVPs"
              value={impact.rsvpCount}
            />
            <MetricCard
              helper="RSVP submitters plus their listed guests."
              icon={UsersRound}
              label="Expected Attendees"
              value={impact.expectedAttendees}
            />
            <MetricCard
              helper="Volunteer signups collected so far."
              icon={HandHeart}
              label="Volunteers"
              value={impact.volunteerCount}
            />
            <MetricCard
              helper="Updates from the organizer check-in page."
              icon={CheckCircle2}
              label="Checked In"
              value={impact.checkedInAttendees}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <SurfaceCard>
              <h2 className="text-xl font-semibold text-slate-950">
                Attendance
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Attendance percentage compares checked-in attendees against
                expected attendees. Use the check-in page during the event to
                keep this number current.
              </p>
              <div className="mt-6 space-y-5">
                <ProgressBar
                  label="Attendance percentage"
                  value={impact.attendancePercentage}
                />
                {impact.capacityPercentage !== null ? (
                  <ProgressBar
                    label="Capacity reserved"
                    value={impact.capacityPercentage}
                  />
                ) : null}
                {impact.volunteerCoveragePercentage !== null ? (
                  <ProgressBar
                    label="Volunteer slots filled"
                    value={impact.volunteerCoveragePercentage}
                  />
                ) : null}
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-[#fff1ed] text-[#b5482d]">
                <BarChart3 className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">
                Basic Impact Summary
              </h2>
              <p className="mt-3 leading-8 text-slate-600">{impact.summary}</p>
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
                This impact summary is based on event logistics and attendance
                records only. It is not medical advice or a clinical outcome
                report.
              </p>
            </SurfaceCard>
          </div>
        </div>
      </main>
    </>
  );
}
