# Phase 10: Polish, Test, and Deploy

This phase prepares HealthNook for a real free-tier deployment.

## Added Polish

- Removed the outdated Phase 1 homepage banner
- Updated homepage copy to reflect QR check-in and dashboard features
- Added production metadata for social previews
- Added a friendly `not-found` page
- Added `robots.txt` and `sitemap.xml`
- Added deployment environment notes

## Local Verification

Run these before deploying:

```bash
pnpm lint
pnpm build
```

Then test the main flows:

1. Visit `/`.
2. Visit `/events`.
3. Sign up or log in.
4. Create or edit an event.
5. Publish the event and open its public page.
6. Submit an RSVP and volunteer signup.
7. Use `/dashboard/events/[id]/check-in`.
8. Open `/dashboard/events/[id]/impact`.
9. Open `/dashboard/events/[id]/outreach`.

## Vercel Free-Tier Deployment

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Keep the framework preset as `Next.js`.
4. Use the default install/build commands, or set:

```text
Install Command: pnpm install
Build Command: pnpm build
```

## Vercel Environment Variables

Set these in Vercel project settings:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

Leave these disabled unless you choose to pay with your own OpenAI key or credits:

```env
OPENAI_OUTREACH_ENABLED=false
OPENAI_API_KEY=
OPENAI_OUTREACH_MODEL=gpt-5.4-nano
```

Never put private keys in client-side variables that start with
`NEXT_PUBLIC_`.

## Supabase Auth URLs

After Vercel gives you a production URL, update Supabase Auth settings:

```text
Site URL:
https://your-vercel-domain.vercel.app

Redirect URLs:
http://localhost:3000/auth/callback
https://your-vercel-domain.vercel.app/auth/callback
```

## Free-Tier Notes

- Supabase free tier is enough for MVP database and auth testing.
- Vercel free tier is enough for MVP hosting.
- QR codes use the free `qrcode` npm package.
- Outreach templates are free.
- Optional OpenAI outreach can cost money if enabled.
- A custom domain may cost money depending on where you buy it.

## Community Safety Notes

HealthNook is not a medical record system and is not built for protected health
information. Keep MVP forms focused on basic event logistics and contact info.
Do not collect sensitive health details unless you later add the legal,
security, and privacy controls required for that use case.
