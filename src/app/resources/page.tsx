import { Languages, LibraryBig, MapPin } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { displayResourceValue } from "@/lib/resources/constants";
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
              Find community health resources shared by local organizations.
            </h1>
            <p className="mt-4 max-w-2xl leading-8 text-slate-600">
              Browse practical information about services, support programs,
              health education, and local access points.
            </p>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resourceList.length === 0 ? (
              <SurfaceCard className="md:col-span-2 lg:col-span-3">
                <h2 className="text-xl font-semibold text-slate-950">
                  No published resources yet.
                </h2>
                <p className="mt-2 leading-7 text-slate-600">
                  Once organizers publish resources, they will appear here.
                </p>
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
                    <ButtonLink href={`/resources/${resource.id}`} variant="outline">
                      View Resource
                    </ButtonLink>
                  </div>
                </SurfaceCard>
              ))
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
