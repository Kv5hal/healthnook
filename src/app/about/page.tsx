import type { Metadata } from "next";
import { ArrowRight, GraduationCap, HeartHandshake, Sparkles } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";

export const metadata: Metadata = {
  title: "About the Creator | HealthNook",
  description:
    "Learn about Kushal Thapaliya, the student creator of HealthNook.",
};

const creatorDetails = [
  {
    label: "School",
    value: "Keller Collegiate Academy",
  },
  {
    label: "Grade",
    value: "Junior",
  },
  {
    label: "Interests",
    value:
      "Computer Science, artificial intelligence, healthcare technology, and community service",
  },
  {
    label: "Goal",
    value: "Study Computer Science and work toward becoming an AI engineer",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100svh-4rem)] bg-[#f6fbf9]">
        <section className="border-b border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                About the Creator
              </p>
              <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950">
                Built by Kushal Thapaliya, a student interested in AI,
                healthcare technology, and community service.
              </h1>
              <p className="mt-5 max-w-3xl leading-8 text-slate-600">
                Kushal Thapaliya is a junior at Keller Collegiate Academy with
                interests in Computer Science, artificial intelligence,
                healthcare technology, and community service. He created
                HealthNook after seeing how community health opportunities can
                be difficult for families to find, understand, or act on.
              </p>
            </div>

            <SurfaceCard>
              <div className="flex size-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                <GraduationCap className="size-6" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-slate-950">
                Kushal Thapaliya
              </h2>
              <dl className="mt-5 space-y-4">
                {creatorDetails.map((detail) => (
                  <div key={detail.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      {detail.label}
                    </dt>
                    <dd className="mt-1 leading-7 text-slate-700">
                      {detail.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </SurfaceCard>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-4 lg:grid-cols-2">
            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <HeartHandshake className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">
                Why HealthNook exists
              </h2>
              <p className="mt-3 leading-8 text-slate-600">
                Through local Nepali and community service work, Kushal has
                been interested in how youth and community organizations can
                make health-related outreach easier for families. HealthNook is
                meant to support organizations by turning event and resource
                details into clear, accessible, family-friendly information.
              </p>
            </SurfaceCard>

            <SurfaceCard>
              <div className="flex size-11 items-center justify-center rounded-lg bg-[#fff1ed] text-[#b5482d]">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">
                How the project connects to AI
              </h2>
              <p className="mt-3 leading-8 text-slate-600">
                HealthNook combines Kushal&apos;s interest in AI and public
                service by helping local groups create plain-language outreach,
                prepare multilingual drafts when AI is configured, collect
                signups, and track basic community impact. It is not a medical
                advice tool and does not claim medical expertise.
              </p>
            </SurfaceCard>
          </div>

          <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-3 sm:flex-row">
            <ButtonLink href="/resources" variant="outline">
              View Resources
            </ButtonLink>
            <ButtonLink href="/events" variant="outline">
              View Events
            </ButtonLink>
            <ButtonLink href="/" variant="ghost">
              Back Home
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
