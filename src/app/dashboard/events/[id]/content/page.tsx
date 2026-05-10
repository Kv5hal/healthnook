import { BarChart3, Megaphone } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { generateEventContentAction } from "@/app/dashboard/content/actions";
import { AuthMessage } from "@/components/auth-message";
import { ContentWorkspace } from "@/components/content/content-workspace";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { createClient } from "@/lib/supabase/server";

type EventContentPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function EventContentPage({
  params,
  searchParams,
}: EventContentPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const redirectPath = `/dashboard/events/${id}/content`;
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

  const { data: event } = await supabase
    .from("events")
    .select("id, title, description")
    .eq("id", id)
    .eq("organization_id", organization.id)
    .maybeSingle();

  if (!event) {
    notFound();
  }

  const { data: generatedContent } = await supabase
    .from("generated_content")
    .select(
      "id, content_type, language, source, model, prompt_version, output, created_at",
    )
    .eq("event_id", event.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const generateAction = generateEventContentAction.bind(null, event.id);

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Event Access Content
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Plain-language tools for {event.title}
              </h1>
              <p className="mt-3 max-w-3xl leading-8 text-slate-600">
                Generate easy-to-edit explanations, preparation notes, and
                optional translations that help community members understand the
                event.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink href={`/dashboard/events/${event.id}`} variant="outline">
                Manage Event
              </ButtonLink>
              <ButtonLink
                href={`/dashboard/events/${event.id}/impact`}
                variant="outline"
              >
                <BarChart3 className="size-4" aria-hidden="true" />
                Impact
              </ButtonLink>
              <ButtonLink
                href={`/dashboard/events/${event.id}/outreach`}
                variant="outline"
              >
                <Megaphone className="size-4" aria-hidden="true" />
                Outreach
              </ButtonLink>
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
