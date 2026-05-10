import {
  CircleDollarSign,
  ExternalLink,
  Languages,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  UserRoundCheck,
} from "lucide-react";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { displayResourceValue } from "@/lib/resources/constants";
import {
  getFounderResourceBySlug,
  HEALTHNOOK_RESOURCE_DISCLAIMER,
} from "@/lib/resources/founder-resources";
import { createClient } from "@/lib/supabase/server";

type PublicResourcePageProps = {
  params: Promise<{ id: string }>;
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

function InfoList({
  items,
  title,
}: {
  items: string[];
  title: string;
}) {
  return (
    <SurfaceCard>
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <ul className="mt-4 space-y-3 leading-7 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              className="mt-2 size-2 shrink-0 rounded-full bg-teal-600"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SurfaceCard>
  );
}

export default async function PublicResourcePage({
  params,
}: PublicResourcePageProps) {
  const { id } = await params;
  const founderResource = getFounderResourceBySlug(id);

  if (founderResource) {
    return (
      <>
        <SiteHeader />
        <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9]">
          <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    {founderResource.category}
                  </span>
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {founderResource.label}
                  </span>
                  <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Published
                  </span>
                </div>
                <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950">
                  {founderResource.title}
                </h1>
                <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                  {founderResource.shortDescription}
                </p>
              </div>
              <SurfaceCard>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                  Resource Type
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                  Founder-created informational resource
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  Created by HealthNook to help families, students, volunteers,
                  and community organizers understand health event logistics in
                  plain language.
                </p>
              </SurfaceCard>
            </div>
          </section>

          <section className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-4">
                <InfoList
                  title="Who this may help"
                  items={founderResource.whoThisMayHelp}
                />
                <InfoList
                  title="Key points"
                  items={founderResource.keyPoints}
                />
              </div>

              <div className="space-y-4">
                <InfoList
                  title="What to bring or prepare"
                  items={founderResource.whatToBringOrPrepare}
                />
                <InfoList
                  title="Questions to ask"
                  items={founderResource.questionsToAsk}
                />

                <SurfaceCard>
                  <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-950">
                    <ShieldAlert className="size-5" aria-hidden="true" />
                    Safety note
                  </h2>
                  <p className="mt-3 leading-7 text-slate-600">
                    {founderResource.safetyNote}
                  </p>
                  <p className="mt-4 leading-7 text-slate-600">
                    {HEALTHNOOK_RESOURCE_DISCLAIMER}
                  </p>
                </SurfaceCard>

                <ButtonLink href="/resources" variant="outline">
                  Back to Resources
                </ButtonLink>
              </div>
            </div>
          </section>
        </main>
        <SiteFooter />
      </>
    );
  }

  const supabase = await createClient();
  const { data: resource } = await supabase
    .from("resources")
    .select(
      "*, organizations(name, description, contact_email, website_url)",
    )
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (!resource) {
    notFound();
  }

  const organization = getOrganization(resource.organizations);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9]">
        <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {resource.category}
                </span>
                <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Published resource
                </span>
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950">
                {resource.title}
              </h1>
              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                {resource.description}
              </p>
            </div>
            <SurfaceCard>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Shared By
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
          <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <SurfaceCard>
              <h2 className="text-xl font-semibold text-slate-950">
                What this resource is
              </h2>
              <p className="mt-3 leading-8 text-slate-600">
                {resource.description}
              </p>

              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <UserRoundCheck className="size-4" aria-hidden="true" />
                    Who it is for
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {displayResourceValue(resource.eligibility)}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CircleDollarSign className="size-4" aria-hidden="true" />
                    Cost
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {displayResourceValue(resource.cost)}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <MapPin className="size-4" aria-hidden="true" />
                    Location
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {displayResourceValue(resource.location)}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Languages className="size-4" aria-hidden="true" />
                    Languages supported
                  </dt>
                  <dd className="mt-2 leading-7 text-slate-600">
                    {displayResourceValue(resource.languages_supported)}
                  </dd>
                </div>
              </dl>
            </SurfaceCard>

            <div className="space-y-4">
              <SurfaceCard>
                <h2 className="text-xl font-semibold text-slate-950">
                  What to bring
                </h2>
                <p className="mt-3 leading-8 text-slate-600">
                  {displayResourceValue(resource.what_to_bring)}
                </p>
              </SurfaceCard>

              <SurfaceCard>
                <h2 className="text-xl font-semibold text-slate-950">
                  Contact information
                </h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <a
                    className="flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-800"
                    href={`mailto:${resource.contact_email}`}
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    {resource.contact_email}
                  </a>
                  {resource.contact_phone ? (
                    <a
                      className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-950"
                      href={`tel:${resource.contact_phone}`}
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {resource.contact_phone}
                    </a>
                  ) : null}
                  {resource.website_url ? (
                    <ButtonLink
                      href={resource.website_url}
                      target="_blank"
                      variant="outline"
                    >
                      <ExternalLink className="size-4" aria-hidden="true" />
                      Open Resource Link
                    </ButtonLink>
                  ) : null}
                </div>
              </SurfaceCard>

              <SurfaceCard>
                <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-950">
                  <ShieldAlert className="size-5" aria-hidden="true" />
                  Safety note
                </h2>
                <p className="mt-3 leading-7 text-slate-600">
                  {HEALTHNOOK_RESOURCE_DISCLAIMER}
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
