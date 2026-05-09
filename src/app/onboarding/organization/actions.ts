"use server";

import { redirect } from "next/navigation";

import { ensureUserProfile } from "@/lib/auth/profiles";
import { withMessage } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

export async function createOrganizationAction(formData: FormData) {
  const name = getRequiredString(formData, "name");
  const description = getRequiredString(formData, "description");
  const contactEmail = getRequiredString(formData, "contact_email");
  const websiteUrl = getRequiredString(formData, "website_url");

  if (!name || !description || !contactEmail) {
    redirect(
      withMessage(
        "/onboarding/organization",
        "error",
        "Organization name, description, and contact email are required.",
      ),
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login?next=/onboarding/organization");
  }

  await ensureUserProfile(supabase, user);

  const { error } = await supabase.from("organizations").insert({
    owner_id: user.id,
    name,
    description,
    contact_email: contactEmail,
    website_url: websiteUrl || null,
  });

  if (error) {
    redirect(withMessage("/onboarding/organization", "error", error.message));
  }

  redirect(withMessage("/dashboard", "message", "Organization profile created."));
}
