import { CheckCircle2, QrCode, Search, Undo2, UsersRound } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { setRsvpCheckInAction } from "./actions";
import { AuthMessage } from "@/components/auth-message";
import { EventQrCode } from "@/components/events/event-qr-code";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { TextInput } from "@/components/ui/form-field";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SubmitButton } from "@/components/ui/submit-button";
import { getSignupCountsForEvent } from "@/lib/events/counts";
import { formatShortDateTime } from "@/lib/events/format";
import { createClient } from "@/lib/supabase/server";
import { getAppOrigin } from "@/lib/url";

type CheckInPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
    q?: string;
  }>;
};

export default async function CheckInPage({
  params,
  searchParams,
}: CheckInPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/events/${id}/check-in`);
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

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("id, name, email, phone, guests, checked_in, checked_in_at, created_at")
    .eq("event_id", event.id)
    .order("created_at", { ascending: true });

  const search = query.q?.trim().toLowerCase() ?? "";
  const rsvpList = (rsvps ?? []).filter((rsvp) => {
    if (!search) {
      return true;
    }

    return [rsvp.name, rsvp.email, rsvp.phone ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });
  const counts = await getSignupCountsForEvent(supabase, event.id);
  const origin = await getAppOrigin();
  const publicEventUrl = `${origin}/events/${event.id}`;

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                  QR Check-In
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
                Search RSVP records and mark attendees as checked in when they
                arrive. The QR code points to the public event page for easy
                sharing.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink href={`/dashboard/events/${event.id}`} variant="outline">
                Manage Event
              </ButtonLink>
              <ButtonLink href={`/dashboard/events/${event.id}/impact`}>
                Impact
              </ButtonLink>
            </div>
          </div>

          <AuthMessage error={query.error} message={query.message} />

          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <QrCode className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">
                Public Event QR
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Use this QR on flyers, slides, or at the front desk so visitors
                can open the public event page.
              </p>
              <div className="mt-5">
                <EventQrCode title={event.title} url={publicEventUrl} />
              </div>
            </SurfaceCard>

            <SurfaceCard>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-teal-50 p-4">
                  <p className="text-sm font-semibold text-teal-800">RSVPs</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {counts.rsvps}
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-800">
                    RSVP records checked in
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {counts.checkedIn}
                  </p>
                </div>
                <div className="rounded-lg bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">
                    Waiting
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">
                    {Math.max(counts.rsvps - counts.checkedIn, 0)}
                  </p>
                </div>
              </div>

              <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]" method="get">
                <TextInput
                  defaultValue={query.q ?? ""}
                  label="Search attendees"
                  name="q"
                  placeholder="Name, email, or phone"
                  type="search"
                />
                <div className="flex items-end">
                  <SubmitButton variant="secondary">
                    <Search className="size-4" aria-hidden="true" />
                    Search
                  </SubmitButton>
                </div>
              </form>
            </SurfaceCard>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Attendee Check-In
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {rsvpList.length} records shown
                  {search ? ` for "${search}"` : ""}.
                </p>
              </div>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <UsersRound className="size-4" aria-hidden="true" />
                Guests are tracked on RSVP records
              </p>
            </div>

            <div className="mt-5 space-y-3">
              {rsvpList.length === 0 ? (
                <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  No RSVP records match this search.
                </p>
              ) : (
                rsvpList.map((rsvp) => {
                  const action = setRsvpCheckInAction.bind(
                    null,
                    event.id,
                    rsvp.id,
                    !rsvp.checked_in,
                    `/dashboard/events/${event.id}/check-in${
                      query.q ? `?q=${encodeURIComponent(query.q)}` : ""
                    }`,
                  );

                  return (
                    <article
                      className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                      key={rsvp.id}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-950">
                            {rsvp.name}
                          </h3>
                          {rsvp.checked_in ? (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                              <CheckCircle2 className="size-3" aria-hidden="true" />
                              Checked in
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          {rsvp.email}
                          {rsvp.phone ? ` | ${rsvp.phone}` : ""}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Guests: {rsvp.guests} | Checked in:{" "}
                          {formatShortDateTime(rsvp.checked_in_at)}
                        </p>
                      </div>
                      <form action={action}>
                        <SubmitButton
                          variant={rsvp.checked_in ? "secondary" : "primary"}
                        >
                          {rsvp.checked_in ? (
                            <>
                              <Undo2 className="size-4" aria-hidden="true" />
                              Undo
                            </>
                          ) : (
                            <>
                              <CheckCircle2
                                className="size-4"
                                aria-hidden="true"
                              />
                              Check In
                            </>
                          )}
                        </SubmitButton>
                      </form>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
