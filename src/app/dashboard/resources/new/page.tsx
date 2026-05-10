import { redirect } from "next/navigation";

import { createResourceAction } from "@/app/dashboard/resources/actions";
import { AuthMessage } from "@/components/auth-message";
import { ResourceForm } from "@/components/resources/resource-form";
import { SiteHeader } from "@/components/site-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { createClient } from "@/lib/supabase/server";

type NewResourcePageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function NewResourcePage({
  searchParams,
}: NewResourcePageProps) {
  const query = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/resources/new");
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
              Create Resource
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Add a health access resource for {organization.name}.
            </h1>
            <p className="mt-4 leading-8 text-slate-600">
              Resource pages help community members understand where to go, who
              a service is for, what it costs, and what to bring.
            </p>
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
              Keep this public-facing and logistics-focused. Do not collect or
              publish private medical information.
            </div>
          </section>

          <SurfaceCard>
            <div className="mb-6">
              <AuthMessage error={query.error} message={query.message} />
            </div>
            <ResourceForm
              action={createResourceAction}
              defaultContactEmail={organization.contact_email}
              submitLabel="Create Resource"
            />
          </SurfaceCard>
        </div>
      </main>
    </>
  );
}
