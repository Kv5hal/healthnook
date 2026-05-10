import {
  ClipboardList,
  Languages,
  LibraryBig,
  MapPin,
  ShieldAlert,
  UserRoundCheck,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { displayResourceValue } from "@/lib/resources/constants";
import {
  founderResources,
  HEALTHNOOK_RESOURCE_DISCLAIMER,
} from "@/lib/resources/founder-resources";
import { createClient } from "@/lib/supabase/server";

type OrganizationRelation = { name: string } | { name: string }[] | null;

function getOrganizationName(organization: OrganizationRelation) {
  if (Array.isArray(organization)) {
    return organization[0]?.name ?? "Community organizer";
  }

  return organization?.name ?? "Community organizer";
}

export default async function PublicResourcesPage() {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select(
      "id, title, category, description, location, cost, languages_supported, organizations(name)",
    )
    .eq("published", true)
    .order("created_at", { ascending: false });
  const resourceList = resources ?? [];

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9]">
        <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Health Resources
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-normal text-slate-950">
              Browse community health resources and founder-created guides.
            </h1>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">
              Find practical information shared by local organizations, plus
              HealthNook informational guides that help families, students, and
              volunteers understand health event logistics and access questions.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/dashboard/resources/new">
                Add a Resource
              </ButtonLink>
              <ButtonLink href="/events" variant="outline">
                View Events
              </ButtonLink>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                  Organization-Published Resources
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
                  Local resources from HealthNook organizers.
                </h2>
              </div>
              <ButtonLink href="/dashboard/resources/new" variant="outline">
                Add Local Resource
              </ButtonLink>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resourceList.length === 0 ? (
                <SurfaceCard className="md:col-span-2 lg:col-span-3">
                  <h2 className="text-xl font-semibold text-slate-950">
                    No local resources have been published yet.
                  </h2>
                  <p className="mt-2 leading-7 text-slate-600">
                    Once organizations publish local resources, they will appear
                    here. The founder-created informational guides below are
                    available now for general community awareness.
                  </p>
                  <div className="mt-5">
                    <ButtonLink href="/dashboard/resources/new">
                      Create a Resource
                    </ButtonLink>
                  </div>
                </SurfaceCard>
              ) : (
                resourceList.map((resource) => (
                  <SurfaceCard key={resource.id} className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                        {resource.category}
                      </span>
                      <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Published
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-semibold text-slate-950">
                      {resource.title}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-teal-700">
                      {getOrganizationName(resource.organizations)}
                    </p>
                    <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                      {resource.description}
                    </p>
                    <div className="mt-5 space-y-3 text-sm text-slate-600">
                      <p className="flex gap-2">
                        <MapPin
                          className="mt-0.5 size-4 shrink-0 text-teal-700"
                          aria-hidden="true"
                        />
                        {displayResourceValue(resource.location)}
                      </p>
                      <p className="flex gap-2">
                        <LibraryBig
                          className="mt-0.5 size-4 shrink-0 text-teal-700"
                          aria-hidden="true"
                        />
                        {displayResourceValue(resource.cost)}
                      </p>
                      <p className="flex gap-2">
                        <Languages
                          className="mt-0.5 size-4 shrink-0 text-teal-700"
                          aria-hidden="true"
                        />
                        {displayResourceValue(resource.languages_supported)}
                      </p>
                    </div>
                    <div className="mt-6">
                      <ButtonLink
                        href={`/resources/${resource.id}`}
                        variant="outline"
                      >
                        View Resource
                      </ButtonLink>
                    </div>
                  </SurfaceCard>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Founder-Created Informational Resources
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
                Plain-language guides created by HealthNook.
              </h2>
              <p className="mt-4 leading-8 text-slate-600">
                These resources are not location-specific provider listings.
                They are founder-created guides meant to help people ask better
                questions, prepare for community events, and understand
                logistics without sharing private medical information.
              </p>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {founderResources.map((resource) => (
                <SurfaceCard key={resource.slug} className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      {resource.category}
                    </span>
                    <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {resource.label}
                    </span>
                    <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Published
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-semibold text-slate-950">
                    {resource.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {resource.shortDescription}
                  </p>

                  <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="flex items-start gap-2 text-sm font-semibold text-slate-800">
                      <UserRoundCheck
                        className="mt-0.5 size-4 shrink-0 text-teal-700"
                        aria-hidden="true"
                      />
                      Who this may help
                    </p>
                    <ul className="mt-2 space-y-2 leading-7 text-slate-600">
                      {resource.whoThisMayHelp.slice(0, 2).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="flex items-center gap-2 font-semibold text-slate-700">
                        <LibraryBig
                          className="size-4 text-teal-700"
                          aria-hidden="true"
                        />
                        Key points
                      </dt>
                      <dd className="mt-2 leading-6 text-slate-600">
                        {resource.keyPoints[0]}
                      </dd>
                    </div>
                    <div>
                      <dt className="flex items-center gap-2 font-semibold text-slate-700">
                        <ClipboardList
                          className="size-4 text-teal-700"
                          aria-hidden="true"
                        />
                        Prepare
                      </dt>
                      <dd className="mt-2 leading-6 text-slate-600">
                        {resource.whatToBringOrPrepare[0]}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6">
                    <ButtonLink
                      href={`/resources/${resource.slug}`}
                      variant="outline"
                    >
                      Read Guide
                    </ButtonLink>
                  </div>
                </SurfaceCard>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
              <h3 className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="size-5" aria-hidden="true" />
                Health information note
              </h3>
              <p className="mt-2 leading-7">
                {HEALTHNOOK_RESOURCE_DISCLAIMER}
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
