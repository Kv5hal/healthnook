import { Building2 } from "lucide-react";
import { redirect } from "next/navigation";

import { createOrganizationAction } from "@/app/onboarding/organization/actions";
import { AuthMessage } from "@/components/auth-message";
import { SiteHeader } from "@/components/site-header";
import { Textarea, TextInput } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { createClient } from "@/lib/supabase/server";

type OrganizationOnboardingPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function OrganizationOnboardingPage({
  searchParams,
}: OrganizationOnboardingPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/onboarding/organization");
  }

  const { data: organization } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  if (organization) {
    redirect("/dashboard");
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              Organization Profile
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Tell HealthNook who is organizing events.
            </h1>
            <p className="mt-4 leading-8 text-slate-600">
              This profile will connect future events to your nonprofit, school
              club, faith community, library, or local group.
            </p>
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
              Keep this public-facing and logistics-focused. Do not include
              private medical details.
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm shadow-slate-950/5">
            <div className="mb-6">
              <AuthMessage error={params.error} message={params.message} />
            </div>

            <form action={createOrganizationAction} className="space-y-5">
              <TextInput
                label="Organization name"
                name="name"
                placeholder="Westside Health Club"
                required
                type="text"
              />
              <Textarea
                label="Description"
                name="description"
                placeholder="A student-led group organizing community health education and volunteer events."
                required
              />
              <TextInput
                defaultValue={user.email ?? ""}
                label="Contact email"
                name="contact_email"
                required
                type="email"
              />
              <TextInput
                helperText="Optional for now. You can use a website, Instagram, Facebook page, or Linktree."
                label="Website or social link"
                name="website_url"
                type="url"
              />
              <SubmitButton>
                <Building2 className="size-4" aria-hidden="true" />
                Create Organization
              </SubmitButton>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
