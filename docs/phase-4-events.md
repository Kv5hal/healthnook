# Phase 4: Event Creation And Public Event Pages

This phase adds the first real event workflow.

## Added Routes

- `/events`
- `/events/[id]`
- `/dashboard/events/new`
- `/dashboard/events/[id]`
- `/dashboard/events/[id]/edit`

## What Works Now

- Organizers can create draft or published events.
- Organizers can view their own event list on `/dashboard`.
- Organizers can manage one event at `/dashboard/events/[id]`.
- Organizers can edit event details.
- Organizers can publish or move an event back to draft.
- Public users can browse published events only.
- Public users can open a published event page.

## Still Coming Later

- RSVP form and storage: Phase 5
- Volunteer signup form and storage: Phase 5
- Attendance and analytics: Phase 6
- QR check-in: Phase 7
- Outreach templates: Phase 8

## Test Phase 4

1. Log in as an organizer.
2. Open `/dashboard/events/new`.
3. Create a draft event.
4. Confirm it appears on `/dashboard`.
5. Confirm it does not appear on `/events`.
6. Open the event manager and publish it.
7. Confirm it appears on `/events`.
8. Open the public event page.
9. Edit the event and confirm the public page updates.

No paid services are required.
