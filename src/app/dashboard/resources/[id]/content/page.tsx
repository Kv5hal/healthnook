import { Pencil } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { generateResourceContentAction } from "@/app/dashboard/content/actions";
import { AuthMessage } from "@/components/auth-message";
import { ContentWorkspace } from "@/components/content/content-workspace";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { createClient } from "@/lib/supabase/server";

type ResourceContentPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function ResourceContentPage({
  params,
  searchParams,
}: ResourceContentPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const redirectPath = `/dashboard/resources/${id}/content`;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(redirectPath)}`);
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
    .select("id, title, description, published")
    .eq("id", id)
    .eq("organization_id", organization.id)
    .maybeSingle();

  if (!resource) {
    notFound();
  }

  const { data: generatedContent } = await supabase
    .from("generated_content")
    .select(
      "id, content_type, language, source, model, prompt_version, output, created_at",
    )
    .eq("resource_id", resource.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const generateAction = generateResourceContentAction.bind(null, resource.id);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Resource Access Content
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Plain-language tools for {resource.title}
              </h1>
              <p className="mt-3 max-w-3xl leading-8 text-slate-600">
                Generate clear explanations and optional translations that help
                families understand how to use this resource.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink href="/dashboard/resources" variant="outline">
                Resources
              </ButtonLink>
              <ButtonLink
                href={`/dashboard/resources/${resource.id}/edit`}
                variant="outline"
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </ButtonLink>
              {resource.published ? (
                <ButtonLink href={`/resources/${resource.id}`} target="_blank">
                  Public Page
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <AuthMessage error={query.error} message={query.message} />

          <ContentWorkspace
            generatedContent={generatedContent ?? []}
            generateAction={generateAction}
            redirectPath={redirectPath}
          />
        </div>
      </main>
    </>
  );
}
