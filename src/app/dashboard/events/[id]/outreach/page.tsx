import { Megaphone, WandSparkles } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import {
  generateMessageAction,
  updateGeneratedMessageAction,
} from "./actions";
import { AuthMessage } from "@/components/auth-message";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SelectField, Textarea } from "@/components/ui/form-field";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SubmitButton } from "@/components/ui/submit-button";
import { getOutreachProviderStatus } from "@/lib/outreach/generator";
import { getMessageTypeLabel, MESSAGE_TYPES } from "@/lib/outreach/templates";
import { createClient } from "@/lib/supabase/server";

type OutreachPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function OutreachPage({
  params,
  searchParams,
}: OutreachPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/events/${id}/outreach`);
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
    .select("id, title")
    .eq("id", id)
    .eq("organization_id", organization.id)
    .maybeSingle();

  if (!event) {
    notFound();
  }

  const { data: generatedMessages } = await supabase
    .from("generated_messages")
    .select("id, message_type, output, created_at")
    .eq("event_id", event.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const generateAction = generateMessageAction.bind(null, event.id);
  const outreachStatus = getOutreachProviderStatus();
  const statusTitle =
    outreachStatus.mode === "openai"
      ? "Optional OpenAI mode"
      : "Free template mode";
  const statusDescription =
    outreachStatus.mode === "openai"
      ? `OpenAI generation is enabled with ${outreachStatus.model}. This may use your OpenAI credits.`
      : outreachStatus.enabled && !outreachStatus.hasApiKey
        ? "OpenAI mode is switched on, but no server API key is configured, so templates are being used."
        : "No API key or paid AI call is required. Drafts are created locally from HealthNook templates.";

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Outreach Generator
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Outreach for {event.title}
              </h1>
              <p className="mt-3 max-w-3xl leading-8 text-slate-600">
                Generate editable outreach drafts from your event data. Review
                and edit every message before sharing.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <ButtonLink href={`/dashboard/events/${event.id}`} variant="outline">
                Manage Event
              </ButtonLink>
              <ButtonLink href={`/dashboard/events/${event.id}/impact`}>
                Impact
              </ButtonLink>
            </div>
          </div>

          <AuthMessage error={query.error} message={query.message} />

          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <WandSparkles className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">
                Create Draft
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Start from HealthNook templates by default, or use the optional
                OpenAI path only when you configure it on the server.
              </p>
              <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3">
                <p className="text-sm font-semibold text-teal-900">
                  {statusTitle}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  {statusDescription}
                </p>
              </div>
              <form action={generateAction} className="mt-5 space-y-4">
                <SelectField label="Message type" name="message_type" required>
                  {MESSAGE_TYPES.map((messageType) => (
                    <option key={messageType.value} value={messageType.value}>
                      {messageType.label}
                    </option>
                  ))}
                </SelectField>
                <SubmitButton>
                  <Megaphone className="size-4" aria-hidden="true" />
                  Generate Message
                </SubmitButton>
              </form>
              <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
                Guardrail: generated content is for logistics, attendance,
                outreach, and community participation only. Do not use it as
                medical advice.
              </p>
            </SurfaceCard>

            <div className="space-y-4">
              {(generatedMessages ?? []).length === 0 ? (
                <SurfaceCard>
                  <h2 className="text-xl font-semibold text-slate-950">
                    No generated messages yet.
                  </h2>
                  <p className="mt-3 leading-7 text-slate-600">
                    Choose a message type to create your first editable
                    outreach draft.
                  </p>
                </SurfaceCard>
              ) : (
                (generatedMessages ?? []).map((message) => {
                  const updateAction = updateGeneratedMessageAction.bind(
                    null,
                    event.id,
                    message.id,
                  );

                  return (
                    <SurfaceCard key={message.id}>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-slate-950">
                          {getMessageTypeLabel(message.message_type)}
                        </h2>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                          Editable draft
                        </p>
                      </div>
                      <form action={updateAction} className="mt-5 space-y-4">
                        <Textarea
                          defaultValue={message.output}
                          label="Message text"
                          name="output"
                          required
                        />
                        <SubmitButton variant="secondary">Save Edits</SubmitButton>
                      </form>
                    </SurfaceCard>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
