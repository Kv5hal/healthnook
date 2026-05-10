import { notFound, redirect } from "next/navigation";

import { updateResourceAction } from "@/app/dashboard/resources/actions";
import { AuthMessage } from "@/components/auth-message";
import { ResourceForm } from "@/components/resources/resource-form";
import { SiteHeader } from "@/components/site-header";
import { SurfaceCard } from "@/components/ui/surface-card";
import { createClient } from "@/lib/supabase/server";

type EditResourcePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function EditResourcePage({
  params,
  searchParams,
}: EditResourcePageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/resources/${id}/edit`);
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

  const { data: resource } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .eq("organization_id", organization.id)
    .maybeSingle();

  if (!resource) {
    notFound();
  }

  const updateAction = updateResourceAction.bind(null, resource.id);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Edit Resource
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Update {resource.title}.
            </h1>
            <p className="mt-4 leading-8 text-slate-600">
              Changes to a published resource update the public page
              immediately. Move the resource back to draft if details need more
              review.
            </p>
          </section>

          <SurfaceCard>
            <div className="mb-6">
              <AuthMessage error={query.error} message={query.message} />
            </div>
            <ResourceForm
              action={updateAction}
              resource={resource}
              submitLabel="Save Resource"
            />
          </SurfaceCard>
        </div>
      </main>
    </>
  );
}
