"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSafeRedirectPath, withMessage } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

type EventPayload = {
  title: string;
  event_type: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  max_attendees: number | null;
  volunteer_slots_needed: number | null;
  contact_email: string;
  language_notes: string | null;
  accessibility_notes: string | null;
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

function getOptionalInteger(formData: FormData, name: string) {
  const value = getRequiredString(formData, name);

  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isNaN(parsed) ? null : parsed;
}

function getIsoDateTime(formData: FormData, name: string) {
  const value = getRequiredString(formData, name);
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function parseEventForm(formData: FormData): {
  payload?: EventPayload;
  error?: string;
} {
  const title = getRequiredString(formData, "title");
  const eventType = getRequiredString(formData, "event_type");
  const description = getRequiredString(formData, "description");
  const startTime = getIsoDateTime(formData, "start_time");
  const endTime = getIsoDateTime(formData, "end_time");
  const location = getRequiredString(formData, "location");
  const contactEmail = getRequiredString(formData, "contact_email");
  const maxAttendees = getOptionalInteger(formData, "max_attendees");
  const volunteerSlotsNeeded = getOptionalInteger(
    formData,
    "volunteer_slots_needed",
  );

  if (
    !title ||
    !eventType ||
    !description ||
    !startTime ||
    !endTime ||
    !location ||
    !contactEmail
  ) {
    return {
      error:
        "Title, event type, description, date/time, location, and contact email are required.",
    };
  }

  if (new Date(endTime).getTime() <= new Date(startTime).getTime()) {
    return {
      error: "End time must be after start time.",
    };
  }

  if (maxAttendees !== null && maxAttendees <= 0) {
    return {
      error: "Max attendees must be blank or greater than 0.",
    };
  }

  if (volunteerSlotsNeeded !== null && volunteerSlotsNeeded < 0) {
    return {
      error: "Volunteer slots must be blank, 0, or greater.",
    };
  }

  return {
    payload: {
      title,
      event_type: eventType,
      description,
      start_time: startTime,
      end_time: endTime,
      location,
      max_attendees: maxAttendees,
      volunteer_slots_needed: volunteerSlotsNeeded,
      contact_email: contactEmail,
      language_notes: getOptionalString(formData, "language_notes"),
      accessibility_notes: getOptionalString(formData, "accessibility_notes"),
      published: formData.get("published") === "true",
    },
  };
}

async function getOrganizerContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/events/new");
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

  return { supabase, user, organization };
}

export async function createEventAction(formData: FormData) {
  const { payload, error } = parseEventForm(formData);

  if (error || !payload) {
    redirect(withMessage("/dashboard/events/new", "error", error ?? ""));
  }

  const { supabase, organization } = await getOrganizerContext();
  const { data: event, error: insertError } = await supabase
    .from("events")
    .insert({
      ...payload,
      organization_id: organization.id,
    })
    .select("id")
    .single();

  if (insertError || !event) {
    redirect(
      withMessage(
        "/dashboard/events/new",
        "error",
        insertError?.message ?? "Unable to create event.",
      ),
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/events");

  redirect(
    withMessage(
      `/dashboard/events/${event.id}`,
      "message",
      payload.published ? "Event created and published." : "Draft event created.",
    ),
  );
}

export async function updateEventAction(eventId: string, formData: FormData) {
  const { payload, error } = parseEventForm(formData);

  if (error || !payload) {
    redirect(withMessage(`/dashboard/events/${eventId}/edit`, "error", error ?? ""));
  }

  const { supabase, organization } = await getOrganizerContext();
  const { data: updatedEvent, error: updateError } = await supabase
    .from("events")
    .update(payload)
    .eq("id", eventId)
    .eq("organization_id", organization.id)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedEvent) {
    redirect(
      withMessage(
        `/dashboard/events/${eventId}/edit`,
        "error",
        updateError?.message ?? "Unable to update that event.",
      ),
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/dashboard/events/${eventId}`);

  redirect(withMessage(`/dashboard/events/${eventId}`, "message", "Event updated."));
}

export async function setEventPublishedAction(
  eventId: string,
  published: boolean,
  redirectTo: string,
) {
  const { supabase, organization } = await getOrganizerContext();
  const { data: updatedEvent, error } = await supabase
    .from("events")
    .update({ published })
    .eq("id", eventId)
    .eq("organization_id", organization.id)
    .select("id")
    .maybeSingle();

  const safeRedirectTo = getSafeRedirectPath(redirectTo);

  if (error || !updatedEvent) {
    redirect(
      withMessage(
        safeRedirectTo,
        "error",
        error?.message ?? "Unable to update that event.",
      ),
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  revalidatePath(`/dashboard/events/${eventId}`);

  redirect(
    withMessage(
      safeRedirectTo,
      "message",
      published ? "Event published." : "Event moved back to draft.",
    ),
  );
}
