"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSafeRedirectPath, withMessage } from "@/lib/auth/redirects";
import {
  generateAccessibleContent,
  isContentLanguage,
  isContentType,
  type ContentLanguage,
  type ContentType,
  type ContentSubject,
} from "@/lib/content/generator";
import { createClient } from "@/lib/supabase/server";

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

async function getAuthenticatedUser(next: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return { supabase, user };
}

function parseGenerationOptions(formData: FormData): {
  contentType?: ContentType;
  language?: ContentLanguage;
  error?: string;
} {
  const contentType = getRequiredString(formData, "content_type");
  const language = getRequiredString(formData, "language");

  if (!isContentType(contentType)) {
    return { error: "Choose a valid content type." };
  }

  if (!isContentLanguage(language)) {
    return { error: "Choose a valid language." };
  }

  return { contentType, language };
}

async function getEventSubject(eventId: string): Promise<{
  subject: ContentSubject;
  userId: string;
}> {
  const { supabase, user } = await getAuthenticatedUser(
    `/dashboard/events/${eventId}/content`,
  );
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

  return {
    subject: {
      kind: "event",
      organizationName: organization.name,
      title: event.title,
      eventType: event.event_type,
      description: event.description,
      startTime: event.start_time,
      endTime: event.end_time,
      location: event.location,
      contactEmail: event.contact_email,
      languageNotes: event.language_notes,
      accessibilityNotes: event.accessibility_notes,
    },
    userId: user.id,
  };
}

async function getResourceSubject(resourceId: string): Promise<{
  subject: ContentSubject;
  userId: string;
}> {
  const { supabase, user } = await getAuthenticatedUser(
    `/dashboard/resources/${resourceId}/content`,
  );
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
    .eq("id", resourceId)
    .eq("organization_id", organization.id)
    .maybeSingle();

  if (!resource) {
    redirect(
      withMessage(
        "/dashboard/resources",
        "error",
        "You do not have access to that resource.",
      ),
    );
  }

  return {
    subject: {
      kind: "resource",
      organizationName: organization.name,
      title: resource.title,
      category: resource.category,
      description: resource.description,
      location: resource.location,
      cost: resource.cost,
      eligibility: resource.eligibility,
      whatToBring: resource.what_to_bring,
      languagesSupported: resource.languages_supported,
      contactEmail: resource.contact_email,
      contactPhone: resource.contact_phone,
      websiteUrl: resource.website_url,
    },
    userId: user.id,
  };
}

export async function generateEventContentAction(
  eventId: string,
  formData: FormData,
) {
  const redirectPath = `/dashboard/events/${eventId}/content`;
  const { contentType, language, error } = parseGenerationOptions(formData);

  if (error || !contentType || !language) {
    redirect(withMessage(redirectPath, "error", error ?? ""));
  }

  const { subject, userId } = await getEventSubject(eventId);
  const generated = await generateAccessibleContent(
    contentType,
    language,
    subject,
  );

  if (!generated.saveable) {
    redirect(
      withMessage(
        redirectPath,
        "error",
        generated.fallbackReason ?? "Unable to generate that content.",
      ),
    );
  }

  const supabase = await createClient();
  const { error: insertError } = await supabase.from("generated_content").insert({
    content_type: generated.contentType,
    event_id: eventId,
    language: generated.language,
    model: generated.model,
    output: generated.output,
    prompt_version: generated.promptVersion,
    source: generated.source,
    user_id: userId,
  });

  if (insertError) {
    redirect(withMessage(redirectPath, "error", insertError.message));
  }

  revalidatePath(redirectPath);

  redirect(
    withMessage(
      redirectPath,
      "message",
      generated.source === "openai"
        ? "AI content generated. Review before sharing."
        : "Template content generated. Review before sharing.",
    ),
  );
}

export async function generateResourceContentAction(
  resourceId: string,
  formData: FormData,
) {
  const redirectPath = `/dashboard/resources/${resourceId}/content`;
  const { contentType, language, error } = parseGenerationOptions(formData);

  if (error || !contentType || !language) {
    redirect(withMessage(redirectPath, "error", error ?? ""));
  }

  const { subject, userId } = await getResourceSubject(resourceId);
  const generated = await generateAccessibleContent(
    contentType,
    language,
    subject,
  );

  if (!generated.saveable) {
    redirect(
      withMessage(
        redirectPath,
        "error",
        generated.fallbackReason ?? "Unable to generate that content.",
      ),
    );
  }

  const supabase = await createClient();
  const { error: insertError } = await supabase.from("generated_content").insert({
    content_type: generated.contentType,
    language: generated.language,
    model: generated.model,
    output: generated.output,
    prompt_version: generated.promptVersion,
    resource_id: resourceId,
    source: generated.source,
    user_id: userId,
  });

  if (insertError) {
    redirect(withMessage(redirectPath, "error", insertError.message));
  }

  revalidatePath(redirectPath);

  redirect(
    withMessage(
      redirectPath,
      "message",
      generated.source === "openai"
        ? "AI content generated. Review before sharing."
        : "Template content generated. Review before sharing.",
    ),
  );
}

export async function updateGeneratedContentAction(
  redirectTo: string,
  contentId: string,
  formData: FormData,
) {
  const output = getRequiredString(formData, "output");
  const safeRedirectTo = getSafeRedirectPath(redirectTo);

  if (!output) {
    redirect(
      withMessage(safeRedirectTo, "error", "Generated content cannot be empty."),
    );
  }

  const { supabase, user } = await getAuthenticatedUser(safeRedirectTo);
  const { data: updatedContent, error } = await supabase
    .from("generated_content")
    .update({ output })
    .eq("id", contentId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !updatedContent) {
    redirect(
      withMessage(
        safeRedirectTo,
        "error",
        error?.message ?? "Unable to save that content.",
      ),
    );
  }

  revalidatePath(safeRedirectTo);
  redirect(withMessage(safeRedirectTo, "message", "Content saved."));
}
