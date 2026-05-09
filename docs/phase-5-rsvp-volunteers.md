# Phase 5: RSVP And Volunteer Signup

This phase makes public event pages interactive.

## Added Features

- Public RSVP form on `/events/[id]`
- Public volunteer signup form on `/events/[id]`
- RSVPs saved to the `rsvps` table
- Volunteer signups saved to the `volunteers` table
- Organizer dashboard signup totals
- Event manager RSVP, volunteer, and checked-in counts
- Success/error messages after form submission

## Data Collected

RSVPs:

- Name
- Email
- Phone optional
- Additional guests optional
- Notes optional

Volunteers:

- Name
- Email
- Phone optional
- Preferred role optional
- Availability/notes optional

## Privacy And Safety

Form helper text tells users not to submit private medical information. These forms are for logistics, attendance planning, and volunteer coordination only.

The existing RLS policies still apply:

- Public users can submit RSVPs and volunteer signups only for published events.
- Only the event owner can see signup counts and, in later phases, full signup lists.
- Draft events are not publicly available.

## Test Phase 5

1. Publish an event from the organizer dashboard.
2. Open the public event page.
3. Submit an RSVP.
4. Submit a volunteer signup.
5. Confirm the public page shows success messages.
6. Return to `/dashboard`.
7. Confirm the event row shows updated RSVP and volunteer counts.
8. Open `/dashboard/events/[id]`.
9. Confirm the event manager shows updated counts.

No paid services are required.
