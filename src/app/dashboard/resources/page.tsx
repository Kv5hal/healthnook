import { Eye, Languages, LibraryBig, Pencil, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { setResourcePublishedAction } from "@/app/dashboard/resources/actions";
import { AuthMessage } from "@/components/auth-message";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SubmitButton } from "@/components/ui/submit-button";
import { displayResourceValue } from "@/lib/resources/constants";
import { createClient } from "@/lib/supabase/server";

type DashboardResourcesPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function DashboardResourcesPage({
  searchParams,
}: DashboardResourcesPageProps) {
  const query = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/resources");
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

  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("organization_id", organization.id)
    .order("created_at", { ascending: false });
  const resourceList = resources ?? [];
  const publishedCount = resourceList.filter((resource) => resource.published)
    .length;

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Resource Library
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Resources for {organization.name}
              </h1>
              <p className="mt-3 max-w-3xl leading-8 text-slate-600">
                Create practical community health resource pages that explain
                who a resource is for, what it costs, what to bring, and how to
                get help.
              </p>
            </div>
            <ButtonLink href="/dashboard/resources/new">
              <Plus className="size-4" aria-hidden="true" />
              New Resource
            </ButtonLink>
          </div>

          <AuthMessage error={query.error} message={query.message} />

          <div className="grid gap-4 md:grid-cols-3">
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <LibraryBig className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                Total resources
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                {resourceList.length} resources created.
              </p>
            </SurfaceCard>
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Eye className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                Published
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                {publishedCount} public resources.
              </p>
            </SurfaceCard>
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-[#fff1ed] text-[#b5482d]">
                <Languages className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">
                Content tools
              </h2>
              <p className="mt-2 leading-7 text-slate-600">
                Generate plain-language summaries and optional translations for
                each resource.
              </p>
            </SurfaceCard>
          </div>

          <section className="rounded-lg border border-slate-200 bg-white shadow-sm shadow-slate-950/5">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Your Resources
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Draft resources stay private until you publish them.
                </p>
              </div>
              <ButtonLink href="/dashboard/resources/new" size="sm">
                <Plus className="size-4" aria-hidden="true" />
                New Resource
              </ButtonLink>
            </div>

            {resourceList.length === 0 ? (
              <div className="p-8 text-center">
                <h3 className="text-lg font-semibold text-slate-950">
                  No resources yet.
                </h3>
                <p className="mx-auto mt-2 max-w-md leading-7 text-slate-600">
                  Add your first community health resource to help visitors
                  understand where to go and what to expect.
                </p>
                <div className="mt-5">
                  <ButtonLink href="/dashboard/resources/new">
                    <Plus className="size-4" aria-hidden="true" />
                    Create Resource
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {resourceList.map((resource) => {
                  const togglePublished = setResourcePublishedAction.bind(
                    null,
                    resource.id,
                    !resource.published,
                    "/dashboard/resources",
                  );

                  return (
                    <article
                      className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between"
                      key={resource.id}
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-950">
                            {resource.title}
                          </h3>
                          <span
                            className={
                              resource.published
                                ? "rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                                : "rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                            }
                          >
                            {resource.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-teal-700">
                          {resource.category}
                        </p>
                        <p className="mt-2 max-w-3xl leading-7 text-slate-600">
                          {resource.description}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                          Cost: {displayResourceValue(resource.cost)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <ButtonLink
                          href={`/dashboard/resources/${resource.id}/edit`}
                          variant="outline"
                          size="sm"
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                          Edit
                        </ButtonLink>
                        <ButtonLink
                          href={`/dashboard/resources/${resource.id}/content`}
                          variant="outline"
                          size="sm"
                        >
                          <Languages className="size-4" aria-hidden="true" />
                          Content
                        </ButtonLink>
                        {resource.published ? (
                          <ButtonLink
                            href={`/resources/${resource.id}`}
                            variant="ghost"
                            size="sm"
                          >
                            Public Page
                          </ButtonLink>
                        ) : null}
                        <form action={togglePublished}>
                          <SubmitButton
                            variant={resource.published ? "secondary" : "primary"}
                          >
                            {resource.published ? "Move to Draft" : "Publish"}
                          </SubmitButton>
                        </form>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
