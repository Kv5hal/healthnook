# Phase 6: Organizer Lists And Impact Analytics

This phase makes the organizer dashboard useful after people start signing up.

## Added Features

- Private RSVP list on `/dashboard/events/[id]`
- Private volunteer list on `/dashboard/events/[id]`
- Mail and phone links for organizer follow-up
- Expected attendee count based on RSVP submitters plus guests
- Event impact dashboard at `/dashboard/events/[id]/impact`
- Total RSVPs
- Total expected attendees
- Total volunteers
- Checked-in attendees
- Attendance percentage
- Capacity percentage when max attendees is set
- Volunteer slot coverage when volunteer slots are set
- Basic logistics-only impact summary

## Privacy And Security

Only the organizer who owns the event can view RSVP and volunteer lists. Public event pages still only show event details and public signup forms.

## Phase 7 Dependency

Checked-in attendees and attendance percentage use the existing `checked_in` fields. They will become more useful after QR check-in is built in Phase 7.

## Test Phase 6

1. Submit at least one RSVP and one volunteer signup on a published event.
2. Log in as the organizer.
3. Open `/dashboard/events/[id]`.
4. Confirm the RSVP and volunteer tables show the submitted data.
5. Open `/dashboard/events/[id]/impact`.
6. Confirm totals and percentages match the event data.

No paid services are required.
