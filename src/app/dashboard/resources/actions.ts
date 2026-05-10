"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSafeRedirectPath, withMessage } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

type ResourcePayload = {
  title: string;
  category: string;
  description: string;
  location: string | null;
  cost: string | null;
  eligibility: string | null;
  what_to_bring: string | null;
  languages_supported: string | null;
  contact_email: string;
  contact_phone: string | null;
  website_url: string | null;
  published: boolean;
};

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, name: string) {
  const value = getRequiredString(formData, name);

  return value.length > 0 ? value : null;
}

function parseResourceForm(formData: FormData): {
  payload?: ResourcePayload;
  error?: string;
} {
  const title = getRequiredString(formData, "title");
  const category = getRequiredString(formData, "category");
  const description = getRequiredString(formData, "description");
  const contactEmail = getRequiredString(formData, "contact_email");

  if (!title || !category || !description || !contactEmail) {
    return {
      error: "Title, category, description, and contact email are required.",
    };
  }

  return {
    payload: {
      title,
      category,
      description,
      location: getOptionalString(formData, "location"),
      cost: getOptionalString(formData, "cost"),
      eligibility: getOptionalString(formData, "eligibility"),
      what_to_bring: getOptionalString(formData, "what_to_bring"),
      languages_supported: getOptionalString(formData, "languages_supported"),
      contact_email: contactEmail,
      contact_phone: getOptionalString(formData, "contact_phone"),
      website_url: getOptionalString(formData, "website_url"),
      published: formData.get("published") === "true",
    },
  };
}

async function getOrganizerContext(next = "/dashboard/resources") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id, contact_email")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!organization) {
    redirect("/onboarding/organization");
  }

  return { organization, supabase, user };
}

export async function createResourceAction(formData: FormData) {
  const { payload, error } = parseResourceForm(formData);

  if (error || !payload) {
    redirect(withMessage("/dashboard/resources/new", "error", error ?? ""));
  }

  const { organization, supabase } = await getOrganizerContext(
    "/dashboard/resources/new",
  );
  const { data: resource, error: insertError } = await supabase
    .from("resources")
    .insert({
      ...payload,
      organization_id: organization.id,
    })
    .select("id")
    .single();

  if (insertError || !resource) {
    redirect(
      withMessage(
        "/dashboard/resources/new",
        "error",
        insertError?.message ?? "Unable to create resource.",
      ),
    );
  }

  revalidatePath("/resources");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/resources");

  redirect(
    withMessage(
      "/dashboard/resources",
      "message",
      payload.published
        ? "Resource created and published."
        : "Draft resource created.",
    ),
  );
}

export async function updateResourceAction(
  resourceId: string,
  formData: FormData,
) {
  const { payload, error } = parseResourceForm(formData);

  if (error || !payload) {
    redirect(
      withMessage(`/dashboard/resources/${resourceId}/edit`, "error", error ?? ""),
    );
  }

  const { organization, supabase } = await getOrganizerContext(
    `/dashboard/resources/${resourceId}/edit`,
  );
  const { data: updatedResource, error: updateError } = await supabase
    .from("resources")
    .update(payload)
    .eq("id", resourceId)
    .eq("organization_id", organization.id)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedResource) {
    redirect(
      withMessage(
        `/dashboard/resources/${resourceId}/edit`,
        "error",
        updateError?.message ?? "Unable to update that resource.",
      ),
    );
  }

  revalidatePath("/resources");
  revalidatePath(`/resources/${resourceId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/resources");
  revalidatePath(`/dashboard/resources/${resourceId}/edit`);

  redirect(
    withMessage("/dashboard/resources", "message", "Resource updated."),
  );
}

export async function setResourcePublishedAction(
  resourceId: string,
  published: boolean,
  redirectTo: string,
) {
  const { organization, supabase } = await getOrganizerContext(
    "/dashboard/resources",
  );
  const { data: updatedResource, error } = await supabase
    .from("resources")
    .update({ published })
    .eq("id", resourceId)
    .eq("organization_id", organization.id)
    .select("id")
    .maybeSingle();
  const safeRedirectTo = getSafeRedirectPath(redirectTo);

  if (error || !updatedResource) {
    redirect(
      withMessage(
        safeRedirectTo,
        "error",
        error?.message ?? "Unable to update that resource.",
      ),
    );
  }

  revalidatePath("/resources");
  revalidatePath(`/resources/${resourceId}`);
  revalidatePath("/dashboard/resources");

  redirect(
    withMessage(
      safeRedirectTo,
      "message",
      published ? "Resource published." : "Resource moved back to draft.",
    ),
  );
}
