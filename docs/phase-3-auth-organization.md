# Phase 3: Auth And Organization Onboarding

This phase adds organizer authentication and the first protected organization onboarding flow.

## Files Added

- `src/proxy.ts`
- `src/lib/supabase/proxy.ts`
- `src/lib/auth/redirects.ts`
- `src/lib/auth/profiles.ts`
- `src/lib/auth/session.ts`
- `src/app/(auth)/actions.ts`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/app/onboarding/organization/page.tsx`
- `src/app/onboarding/organization/actions.ts`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/events/new/page.tsx`
- `src/components/auth-message.tsx`
- `src/components/ui/form-field.tsx`
- `src/components/ui/submit-button.tsx`

## Supabase Configuration

In your Supabase project, go to Authentication settings:

1. Keep Email provider enabled.
2. Add these redirect URLs for local development:

```text
http://localhost:3000/auth/callback
http://127.0.0.1:3000/auth/callback
```

3. When deployed to Vercel, add:

```text
https://your-vercel-domain.vercel.app/auth/callback
```

Supabase can send basic auth emails on the free plan for development. For a real launch, we may later add custom SMTP or another free-tier email path if needed.

## Test Phase 3

1. Start the app:

```bash
pnpm dev
```

2. Visit:

```text
http://localhost:3000/signup
```

3. Create an organizer account.
4. If Supabase asks for email confirmation, confirm the email and then log in.
5. Create an organization profile at `/onboarding/organization`.
6. Confirm `/dashboard` shows the organization.
7. Click Log Out and confirm `/dashboard` redirects to `/login`.

No event creation is included yet. That is Phase 4.
