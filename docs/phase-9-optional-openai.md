# Phase 9: Optional OpenAI Outreach

This phase adds an optional OpenAI-powered outreach path while keeping the free
template generator as the default.

## Added Features

- Server-only outreach generator wrapper in `src/lib/outreach/generator.ts`
- Free template fallback when OpenAI is disabled, missing a key, or unavailable
- Outreach page status message showing whether template mode or OpenAI mode is active
- Guardrail prompt that blocks medical advice and keeps content focused on logistics
- No OpenAI SDK dependency required

## Default Free Mode

HealthNook stays in template mode unless both of these are true:

- `OPENAI_OUTREACH_ENABLED=true`
- `OPENAI_API_KEY` is set on the server

If either value is missing, the app uses local templates and does not make paid
OpenAI API calls.

## Optional OpenAI Setup

Only use this if you already have an OpenAI API key, credits, or are comfortable
with API usage costs.

```env
OPENAI_OUTREACH_ENABLED=true
OPENAI_API_KEY=your-openai-api-key
OPENAI_OUTREACH_MODEL=gpt-5.4-nano
```

The model can be changed later without code edits. `gpt-5.4-nano` is the default
because it is a lower-cost current model for simple high-volume text tasks.

## Guardrails

The OpenAI prompt tells the model to avoid:

- Medical advice
- Diagnosis or treatment instructions
- Dosage guidance
- Eligibility claims
- Risk claims
- Invented medical details or partner names

Generated messages still include:

```text
This event information is for community awareness and logistics only, not medical advice.
```

Organizers should review and edit every message before using it.

## Test Phase 9

Template mode:

1. Keep `OPENAI_OUTREACH_ENABLED=false`.
2. Restart the dev server.
3. Open `/dashboard/events/[id]/outreach`.
4. Confirm the page says `Free template mode`.
5. Generate a message and confirm it saves.

Optional OpenAI mode:

1. Set `OPENAI_OUTREACH_ENABLED=true`.
2. Set `OPENAI_API_KEY`.
3. Restart the dev server.
4. Open `/dashboard/events/[id]/outreach`.
5. Confirm the page says `Optional OpenAI mode`.
6. Generate a message.

If the OpenAI request fails, HealthNook automatically saves the free template
fallback instead.

## Cost Warning

OpenAI API usage can cost money. Leave this feature disabled while building the
MVP unless you intentionally choose to use your own key or credits.
