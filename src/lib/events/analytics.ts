type RsvpForAnalytics = {
  guests: number;
  checked_in: boolean;
};

type VolunteerForAnalytics = {
  id: string;
};

type EventForAnalytics = {
  title: string;
  max_attendees: number | null;
  volunteer_slots_needed: number | null;
};

export function calculateAttendancePercentage(
  checkedInAttendees: number,
  expectedAttendees: number,
) {
  if (expectedAttendees === 0) {
    return 0;
  }

  return Math.round((checkedInAttendees / expectedAttendees) * 100);
}

export function calculateEventImpact(
  event: EventForAnalytics,
  rsvps: RsvpForAnalytics[],
  volunteers: VolunteerForAnalytics[],
) {
  const rsvpCount = rsvps.length;
  const expectedAttendees = rsvps.reduce(
    (total, rsvp) => total + 1 + rsvp.guests,
    0,
  );
  const checkedInAttendees = rsvps.reduce(
    (total, rsvp) => total + (rsvp.checked_in ? 1 + rsvp.guests : 0),
    0,
  );
  const volunteerCount = volunteers.length;
  const attendancePercentage = calculateAttendancePercentage(
    checkedInAttendees,
    expectedAttendees,
  );
  const capacityPercentage = event.max_attendees
    ? Math.round((expectedAttendees / event.max_attendees) * 100)
    : null;
  const volunteerCoveragePercentage = event.volunteer_slots_needed
    ? Math.round((volunteerCount / event.volunteer_slots_needed) * 100)
    : null;

  const summary =
    expectedAttendees === 0
      ? `${event.title} does not have public RSVPs yet.`
      : `${event.title} has ${rsvpCount} RSVPs representing ${expectedAttendees} expected attendees, with ${volunteerCount} volunteer signups.`;

  return {
    rsvpCount,
    expectedAttendees,
    checkedInAttendees,
    volunteerCount,
    attendancePercentage,
    capacityPercentage,
    volunteerCoveragePercentage,
    summary,
  };
}
