# HealthNook

HealthNook is a free-tier friendly community health event platform for local organizers. It helps nonprofits, school clubs, faith communities, libraries, youth organizations, and neighborhood groups create events, collect RSVPs, coordinate volunteers, check attendees in, and summarize impact.

## Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- lucide-react icons
- Supabase Auth and Postgres
- Vercel-ready deployment
- Free local outreach templates with optional OpenAI support

## Run Locally

Install Node.js LTS first. This project is configured for `pnpm`.

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Then open `http://localhost:3000`.

Add your Supabase values to `.env.local` before using auth or database-backed pages. Keep OpenAI disabled unless you choose to use your own API key or credits.

## Test

```bash
pnpm lint
pnpm build
```

## Project Docs

Phase 2 setup instructions live in `docs/phase-2-supabase.md`.
Phase 3 auth setup instructions live in `docs/phase-3-auth-organization.md`.
Phase 4 event workflow notes live in `docs/phase-4-events.md`.
Phase 5 RSVP and volunteer notes live in `docs/phase-5-rsvp-volunteers.md`.
Phase 6 dashboard analytics notes live in `docs/phase-6-dashboard-analytics.md`.
Phase 7 QR check-in notes live in `docs/phase-7-qr-check-in.md`.
Phase 8 outreach generator notes live in `docs/phase-8-outreach-generator.md`.
Phase 9 optional OpenAI notes live in `docs/phase-9-optional-openai.md`.
Phase 10 deployment notes live in `docs/phase-10-deploy-vercel.md`.

Quick connection check after filling `.env.local`:

```text
http://localhost:3000/api/health/supabase
```
