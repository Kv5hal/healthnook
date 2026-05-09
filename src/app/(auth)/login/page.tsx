import { HeartPulse, LogIn } from "lucide-react";
import Link from "next/link";

import { AuthMessage } from "@/components/auth-message";
import { TextInput } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { signInAction } from "@/app/(auth)/actions";
import { getSafeRedirectPath } from "@/lib/auth/redirects";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = getSafeRedirectPath(params.next ?? null);

  return (
    <main className="min-h-svh bg-[#f6fbf9] px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-start font-semibold text-slate-950"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-teal-700 text-white">
            <HeartPulse className="size-5" aria-hidden="true" />
          </span>
          HealthNook
        </Link>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Organizer Login
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
              Welcome back.
            </h1>
            <p className="mt-3 leading-7 text-slate-600">
              Log in to manage your HealthNook organization profile and prepare
              for event creation.
            </p>
          </div>

          <div className="mt-6">
            <AuthMessage error={params.error} message={params.message} />
          </div>

          <form action={signInAction} className="mt-6 space-y-4">
            <input name="next" type="hidden" value={next} />
            <TextInput
              autoComplete="email"
              label="Email"
              name="email"
              required
              type="email"
            />
            <TextInput
              autoComplete="current-password"
              label="Password"
              name="password"
              required
              type="password"
            />
            <SubmitButton className="w-full">
              <LogIn className="size-4" aria-hidden="true" />
              Log In
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New to HealthNook?{" "}
            <Link
              href="/signup"
              className="font-semibold text-teal-700 hover:text-teal-800"
            >
              Create an organizer account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
