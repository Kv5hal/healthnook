import { UserPlus } from "lucide-react";
import Link from "next/link";

import { signUpAction } from "@/app/(auth)/actions";
import { AuthMessage } from "@/components/auth-message";
import { SiteLogo } from "@/components/site-logo";
import { TextInput } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-svh bg-[#f6fbf9] px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <SiteLogo className="self-start" iconClassName="size-9" />

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Organizer Signup
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">
              Create your account.
            </h1>
            <p className="mt-3 leading-7 text-slate-600">
              Start with your organizer login. Your organization profile comes
              next.
            </p>
          </div>

          <div className="mt-6">
            <AuthMessage error={params.error} message={params.message} />
          </div>

          <form action={signUpAction} className="mt-6 space-y-4">
            <TextInput
              autoComplete="name"
              label="Full name"
              name="full_name"
              required
              type="text"
            />
            <TextInput
              autoComplete="email"
              label="Email"
              name="email"
              required
              type="email"
            />
            <TextInput
              autoComplete="new-password"
              helperText="Use at least 8 characters."
              label="Password"
              minLength={8}
              name="password"
              required
              type="password"
            />
            <SubmitButton className="w-full">
              <UserPlus className="size-4" aria-hidden="true" />
              Sign Up
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-teal-700 hover:text-teal-800"
            >
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
