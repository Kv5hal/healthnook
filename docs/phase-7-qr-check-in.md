# Phase 7: QR Check-In

This phase adds event-day check-in tools for organizers.

## Added Features

- Check-in route at `/dashboard/events/[id]/check-in`
- Public event QR code generated with the free `qrcode` npm package
- RSVP search by name, email, or phone
- Mark RSVP records as checked in
- Undo check-in
- Store `checked_in` and `checked_in_at`
- Update dashboard and impact counts after check-in

## Notes

The QR code points to the public event page so organizers can use it on flyers,
slides, or a check-in desk. The check-in page itself stays protected and can
only be used by the event owner.

## Test Phase 7

1. Log in as the organizer.
2. Open `/dashboard/events/[id]/check-in`.
3. Confirm the QR code appears.
4. Search for an RSVP record.
5. Click `Check In`.
6. Confirm the attendee changes to checked in.
7. Open `/dashboard/events/[id]/impact`.
8. Confirm checked-in and attendance metrics update.

No paid services are required.
