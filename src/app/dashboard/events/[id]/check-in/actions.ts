"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSafeRedirectPath, withMessage } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

async function assertEventOwner(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/events/${eventId}/check-in`);
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!organization) {
    redirect("/onboarding/organization");
  }

  const { data: event } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("organization_id", organization.id)
    .maybeSingle();

  if (!event) {
    redirect(
      withMessage("/dashboard", "error", "You do not have access to that event."),
    );
  }

  return supabase;
}

export async function setRsvpCheckInAction(
  eventId: string,
  rsvpId: string,
  checkedIn: boolean,
  redirectTo: string,
) {
  const supabase = await assertEventOwner(eventId);
  const checkedInAt = checkedIn ? new Date().toISOString() : null;
  const { data: updatedRsvp, error } = await supabase
    .from("rsvps")
    .update({
      checked_in: checkedIn,
      checked_in_at: checkedInAt,
    })
    .eq("id", rsvpId)
    .eq("event_id", eventId)
    .select("id")
    .maybeSingle();

  const safeRedirectTo = getSafeRedirectPath(redirectTo);

  if (error || !updatedRsvp) {
    redirect(
      withMessage(
        safeRedirectTo,
        "error",
        error?.message ?? "Unable to update check-in status.",
      ),
    );
  }

  revalidatePath(`/dashboard/events/${eventId}`);
  revalidatePath(`/dashboard/events/${eventId}/check-in`);
  revalidatePath(`/dashboard/events/${eventId}/impact`);

  redirect(
    withMessage(
      safeRedirectTo,
      "message",
      checkedIn ? "Attendee checked in." : "Check-in was undone.",
    ),
  );
}
