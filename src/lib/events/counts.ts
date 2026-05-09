import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

export type EventSignupCounts = {
  rsvps: number;
  volunteers: number;
  checkedIn: number;
};

const emptyCounts: EventSignupCounts = {
  rsvps: 0,
  volunteers: 0,
  checkedIn: 0,
};

export async function getSignupCountsForEvent(
  supabase: SupabaseClient<Database>,
  eventId: string,
): Promise<EventSignupCounts> {
  const [rsvps, volunteers, checkedIn] = await Promise.all([
    supabase
      .from("rsvps")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId),
    supabase
      .from("volunteers")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId),
    supabase
      .from("rsvps")
      .select("id", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("checked_in", true),
  ]);

  return {
    rsvps: rsvps.count ?? 0,
    volunteers: volunteers.count ?? 0,
    checkedIn: checkedIn.count ?? 0,
  };
}

export async function getSignupCountsByEvent(
  supabase: SupabaseClient<Database>,
  eventIds: string[],
) {
  const uniqueEventIds = Array.from(new Set(eventIds));
  const entries = await Promise.all(
    uniqueEventIds.map(async (eventId) => [
      eventId,
      await getSignupCountsForEvent(supabase, eventId),
    ]),
  );

  return Object.fromEntries(entries) as Record<string, EventSignupCounts>;
}

export function getCountsForEvent(
  countsByEvent: Record<string, EventSignupCounts>,
  eventId: string,
) {
  return countsByEvent[eventId] ?? emptyCounts;
}
