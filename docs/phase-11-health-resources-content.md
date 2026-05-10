# Phase 11: Health Resources And Access Content

This phase moves HealthNook beyond event signup by adding community health
resources and plain-language content tools.

## Added Features

- Public resource directory at `/resources`
- Public resource detail pages at `/resources/[id]`
- Organizer resource dashboard at `/dashboard/resources`
- Resource creation at `/dashboard/resources/new`
- Resource editing at `/dashboard/resources/[id]/edit`
- Event content tools at `/dashboard/events/[id]/content`
- Resource content tools at `/dashboard/resources/[id]/content`
- New `resources` table
- New `generated_content` table with source/model/language metadata

## Migration

Run this migration in Supabase:

```text
supabase/migrations/202605090002_resources_and_generated_content.sql
```

It adds row level security so:

- Public users can view published resources.
- Organization owners can create, edit, and delete their own resources.
- Generated content stays private to the organizer who created it.

## Content Generation

Plain English content works for free through local templates.

Spanish and Nepali translation require OpenAI configuration:

```env
OPENAI_CONTENT_ENABLED=true
OPENAI_API_KEY=your-openai-api-key
OPENAI_CONTENT_MODEL=gpt-5.4-nano
```

Leave those disabled to avoid paid API usage.

## Safety Rules

Resource and generated content should stay focused on:

- Logistics
- Access
- Cost
- Eligibility information supplied by the organizer
- What to bring
- Questions to ask
- Community awareness

Do not collect private medical information. HealthNook content includes a
disclaimer that it is not medical advice, diagnosis, or treatment guidance.

## Test Phase 11

1. Run the Supabase migration.
2. Log in as an organizer.
3. Open `/dashboard/resources`.
4. Create a draft resource.
5. Publish it and confirm it appears at `/resources`.
6. Open the public resource page.
7. Open `/dashboard/resources/[id]/content`.
8. Generate Plain English content.
9. Try Spanish or Nepali without OpenAI enabled and confirm the app shows a
   clear configuration message.
10. Open `/dashboard/events/[id]/content` and generate event content.

No automated emails, payments, or chatbots are included in this phase.
