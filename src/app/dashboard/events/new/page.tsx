import { redirect } from "next/navigation";

import { createEventAction } from "@/app/dashboard/events/actions";
import { AuthMessage } from "@/components/auth-message";
import { EventForm } from "@/components/events/event-form";
import { SiteHeader } from "@/components/site-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { createClient } from "@/lib/supabase/server";

type NewEventPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function NewEventPage({ searchParams }: NewEventPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/events/new");
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, name, contact_email")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!organization) {
    redirect("/onboarding/organization");
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Create Event
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Add a health event for {organization.name}.
            </h1>
            <p className="mt-4 leading-8 text-slate-600">
              Start with the public details people need to decide whether to
              attend or volunteer. You can save as a draft until you are ready
              to publish.
            </p>
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
              Keep event content focused on logistics, awareness, and
              participation. HealthNook should not publish medical advice.
            </div>
          </section>

          <SurfaceCard>
            <div className="mb-6">
              <AuthMessage error={params.error} message={params.message} />
            </div>
            <EventForm
              action={createEventAction}
              defaultContactEmail={organization.contact_email}
              submitLabel="Create Event"
            />
          </SurfaceCard>
        </div>
      </main>
    </>
  );
}
