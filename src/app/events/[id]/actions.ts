"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { withMessage } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

function getRequiredString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, name: string) {
  const value = getRequiredString(formData, name);

  return value.length > 0 ? value : null;
}

function getOptionalInteger(formData: FormData, name: string) {
  const value = getRequiredString(formData, name);

  if (!value) {
    return 0;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? 0 : parsed;
}

async function assertPublishedEvent(eventId: string) {
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("published", true)
    .maybeSingle();

  if (error || !event) {
    redirect(
      withMessage(
        "/events",
        "error",
        "This event is not available for public signups.",
      ),
    );
  }

  return supabase;
}

export async function createRsvpAction(eventId: string, formData: FormData) {
  const name = getRequiredString(formData, "name");
  const email = getRequiredString(formData, "email").toLowerCase();
  const phone = getOptionalString(formData, "phone");
  const guests = getOptionalInteger(formData, "guests");
  const notes = getOptionalString(formData, "notes");
  const eventPath = `/events/${eventId}`;

  if (!name || !email) {
    redirect(
      withMessage(eventPath, "error", "Name and email are required to RSVP."),
    );
  }

  if (guests < 0) {
    redirect(
      withMessage(eventPath, "error", "Guest count must be 0 or greater."),
    );
  }

  const supabase = await assertPublishedEvent(eventId);
  const { error } = await supabase.from("rsvps").insert({
    event_id: eventId,
    name,
    email,
    phone,
    guests,
    notes,
  });

  if (error) {
    redirect(withMessage(eventPath, "error", error.message));
  }

  revalidatePath(eventPath);

  redirect(withMessage(eventPath, "message", "Your RSVP has been saved."));
}

export async function createVolunteerAction(
  eventId: string,
  formData: FormData,
) {
  const name = getRequiredString(formData, "name");
  const email = getRequiredString(formData, "email").toLowerCase();
  const phone = getOptionalString(formData, "phone");
  const preferredRole = getOptionalString(formData, "preferred_role");
  const notes = getOptionalString(formData, "notes");
  const eventPath = `/events/${eventId}`;

  if (!name || !email) {
    redirect(
      withMessage(
        eventPath,
        "error",
        "Name and email are required to volunteer.",
      ),
    );
  }

  const supabase = await assertPublishedEvent(eventId);
  const { error } = await supabase.from("volunteers").insert({
    event_id: eventId,
    name,
    email,
    phone,
    preferred_role: preferredRole,
    notes,
  });

  if (error) {
    redirect(withMessage(eventPath, "error", error.message));
  }

  revalidatePath(eventPath);

  redirect(
    withMessage(eventPath, "message", "Your volunteer signup has been saved."),
  );
}
