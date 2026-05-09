# Phase 8: Template-Based Outreach Generator

This phase adds free, editable outreach templates.

## Added Features

- Outreach route at `/dashboard/events/[id]/outreach`
- Instagram caption template
- Parent-friendly announcement template
- Volunteer reminder template
- Email announcement template
- Post-event thank-you template
- Post-event impact summary template
- Save generated messages to `generated_messages`
- Edit and save generated text
- Organizer-only shortcut section on public event pages

## Guardrails

This phase does not use paid AI APIs. All messages come from local templates
filled with event data and impact counts.

Generated content is limited to:

- Event logistics
- Attendance
- Volunteer coordination
- Community participation
- Awareness

Generated messages include the reminder:

```text
This event information is for community awareness and logistics only, not medical advice.
```

Organizers should review and edit every message before using it.

## Optional AI

Phase 9 adds an optional OpenAI integration behind an API key. If no key is
configured, HealthNook keeps using these free templates.

## Test Phase 8

1. Log in as the organizer.
2. Open `/dashboard/events/[id]/outreach`.
3. Generate each message type.
4. Edit a generated message.
5. Save edits.
6. Confirm the saved text persists after refresh.

No paid services are required.
