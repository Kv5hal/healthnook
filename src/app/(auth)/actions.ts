"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ensureUserProfile } from "@/lib/auth/profiles";
import { getSafeRedirectPath, withMessage } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

export async function signInAction(formData: FormData) {
  const email = getRequiredString(formData, "email").toLowerCase();
  const password = getRequiredString(formData, "password");
  const next = getSafeRedirectPath(formData.get("next"));

  if (!email || !password) {
    redirect(withMessage("/login", "error", "Email and password are required."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(withMessage("/login", "error", error.message));
  }

  if (data.user) {
    await ensureUserProfile(supabase, data.user);
  }

  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const fullName = getRequiredString(formData, "full_name");
  const email = getRequiredString(formData, "email").toLowerCase();
  const password = getRequiredString(formData, "password");

  if (!fullName || !email || !password) {
    redirect(
      withMessage("/signup", "error", "Name, email, and password are required."),
    );
  }

  if (password.length < 8) {
    redirect(
      withMessage("/signup", "error", "Password must be at least 8 characters."),
    );
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding/organization`,
    },
  });

  if (error) {
    redirect(withMessage("/signup", "error", error.message));
  }

  if (data.session && data.user) {
    await ensureUserProfile(supabase, data.user);
    redirect("/onboarding/organization");
  }

  redirect(
    withMessage(
      "/login",
      "message",
      "Check your email to confirm your account, then log in to continue.",
    ),
  );
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  redirect("/");
}
