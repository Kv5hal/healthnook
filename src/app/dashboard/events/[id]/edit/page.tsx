import { notFound, redirect } from "next/navigation";

import { updateEventAction } from "@/app/dashboard/events/actions";
import { AuthMessage } from "@/components/auth-message";
import { EventForm } from "@/components/events/event-form";
import { SiteHeader } from "@/components/site-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { createClient } from "@/lib/supabase/server";

type EditEventPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function EditEventPage({
  params,
  searchParams,
}: EditEventPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/events/${id}/edit`);
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

  const updateAction = updateEventAction.bind(null, event.id);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Edit Event
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Update {event.title}.
            </h1>
            <p className="mt-4 leading-8 text-slate-600">
              Changes to a published event update the public page immediately.
              Move the event back to draft if details are not ready.
            </p>
          </section>

          <SurfaceCard>
            <div className="mb-6">
              <AuthMessage error={query.error} message={query.message} />
            </div>
            <EventForm action={updateAction} event={event} submitLabel="Save Event" />
          </SurfaceCard>
        </div>
      </main>
    </>
  );
}
