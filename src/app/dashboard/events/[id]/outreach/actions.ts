"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { withMessage } from "@/lib/auth/redirects";
import { calculateEventImpact } from "@/lib/events/analytics";
import { generateSmartOutreachMessage } from "@/lib/outreach/generator";
import {
  MESSAGE_TYPES,
  type MessageType,
} from "@/lib/outreach/templates";
import { createClient } from "@/lib/supabase/server";
import { getAppOrigin } from "@/lib/url";

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function isMessageType(value: string): value is MessageType {
  return MESSAGE_TYPES.some((messageType) => messageType.value === value);
}

async function getOutreachContext(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/events/${eventId}/outreach`);
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
    .select("*")
    .eq("id", eventId)
    .eq("organization_id", organization.id)
    .maybeSingle();

  if (!event) {
    redirect(
      withMessage("/dashboard", "error", "You do not have access to that event."),
    );
  }

  const [{ data: rsvps }, { data: volunteers }] = await Promise.all([
    supabase
      .from("rsvps")
      .select("id, guests, checked_in")
      .eq("event_id", event.id),
    supabase.from("volunteers").select("id").eq("event_id", event.id),
  ]);
  const impact = calculateEventImpact(event, rsvps ?? [], volunteers ?? []);
  const origin = await getAppOrigin();

  return {
    event,
    impact,
    organization,
    publicEventUrl: `${origin}/events/${event.id}`,
    supabase,
    user,
  };
}

export async function generateMessageAction(eventId: string, formData: FormData) {
  const selectedType = getRequiredString(formData, "message_type");

  if (!isMessageType(selectedType)) {
    redirect(
      withMessage(
        `/dashboard/events/${eventId}/outreach`,
        "error",
        "Choose a valid message type.",
      ),
    );
  }

  const context = await getOutreachContext(eventId);
  const generatedMessage = await generateSmartOutreachMessage(selectedType, {
    event: context.event,
    impact: context.impact,
    organization: context.organization,
    publicEventUrl: context.publicEventUrl,
  });
  const { error } = await context.supabase.from("generated_messages").insert({
    event_id: eventId,
    message_type: selectedType,
    output: generatedMessage.output,
    user_id: context.user.id,
  });

  if (error) {
    redirect(
      withMessage(`/dashboard/events/${eventId}/outreach`, "error", error.message),
    );
  }

  revalidatePath(`/dashboard/events/${eventId}/outreach`);

  redirect(
    withMessage(
      `/dashboard/events/${eventId}/outreach`,
      "message",
      generatedMessage.fallbackReason ??
        (generatedMessage.source === "openai"
          ? "OpenAI draft generated. Review and edit before using it."
          : "Template message generated. Review and edit before using it."),
    ),
  );
}

export async function updateGeneratedMessageAction(
  eventId: string,
  messageId: string,
  formData: FormData,
) {
  const output = getRequiredString(formData, "output");

  if (!output) {
    redirect(
      withMessage(
        `/dashboard/events/${eventId}/outreach`,
        "error",
        "Message text cannot be empty.",
      ),
    );
  }

  const context = await getOutreachContext(eventId);
  const { data: updatedMessage, error } = await context.supabase
    .from("generated_messages")
    .update({ output })
    .eq("id", messageId)
    .eq("event_id", eventId)
    .eq("user_id", context.user.id)
    .select("id")
    .maybeSingle();

  if (error || !updatedMessage) {
    redirect(
      withMessage(
        `/dashboard/events/${eventId}/outreach`,
        "error",
        error?.message ?? "Unable to save that message.",
      ),
    );
  }

  revalidatePath(`/dashboard/events/${eventId}/outreach`);

  redirect(
    withMessage(
      `/dashboard/events/${eventId}/outreach`,
      "message",
      "Message saved.",
    ),
  );
}
