import Image from "next/image";
import {
  Accessibility,
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  CalendarPlus,
  ClipboardCheck,
  Languages,
  MailCheck,
  MapPin,
  Megaphone,
  QrCode,
  Search,
  UsersRound,
} from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ButtonLink } from "@/components/ui/button-link";
import { SurfaceCard } from "@/components/ui/surface-card";

const features = [
  {
    title: "Event pages",
    description:
      "Publish clear pages for blood drives, workshops, clinics, fairs, and trainings.",
    icon: CalendarCheck2,
  },
  {
    title: "RSVP tracking",
    description:
      "Collect names, guest counts, contact details, and attendance status in one place.",
    icon: ClipboardCheck,
  },
  {
    title: "Volunteer coordination",
    description:
      "Capture preferred roles, availability notes, and support needs before event day.",
    icon: UsersRound,
  },
  {
    title: "QR check-in",
    description:
      "Open an organizer check-in view, share the event QR code, and mark attendees present.",
    icon: QrCode,
  },
  {
    title: "Impact summaries",
    description:
      "See RSVPs, volunteers, check-ins, and attendance percentage for each event.",
    icon: BarChart3,
  },
  {
    title: "Outreach templates",
    description:
      "Start from editable captions, reminders, announcements, and thank-you messages.",
    icon: Megaphone,
  },
];

const useCases = [
  "Blood drives",
  "CPR workshops",
  "Vaccine clinics",
  "Health fairs",
  "Wellness seminars",
  "First-aid trainings",
  "Health education events",
  "Community resource days",
];

const audiences = [
  "Nonprofits",
  "School clubs",
  "Temples, churches, and mosques",
  "Libraries",
  "Youth organizations",
  "Neighborhood groups",
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-slate-950">
          <Image
            src="/hero-community-health.png"
            alt="Community health fair volunteers welcoming attendees"
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 -z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,55,53,0.94)_0%,rgba(8,55,53,0.82)_38%,rgba(8,55,53,0.25)_72%,rgba(8,55,53,0.1)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-slate-950/50 to-transparent" />

          <div className="mx-auto flex min-h-[68svh] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <p className="mb-4 inline-flex rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-emerald-50 backdrop-blur">
                HealthNook for community organizers
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-normal text-white sm:text-5xl">
                Create health events. Manage volunteers. Track community
                impact.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-emerald-50/90 sm:text-lg">
                A free-tier friendly platform for local groups running health
                fairs, CPR workshops, wellness seminars, clinics, and
                volunteer-powered community programs.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/dashboard/events/new" size="lg">
                  <CalendarPlus className="size-5" aria-hidden="true" />
                  Create Event
                </ButtonLink>
                <ButtonLink href="/events" variant="secondary" size="lg">
                  <Search className="size-5" aria-hidden="true" />
                  View Events
                </ButtonLink>
              </div>
              <div className="mt-6 grid gap-3 text-sm font-medium text-emerald-50/90 sm:grid-cols-3">
                <span className="flex items-center gap-2">
                  <MailCheck
                    className="size-4 text-amber-200"
                    aria-hidden="true"
                  />
                  No paid email required
                </span>
                <span className="flex items-center gap-2">
                  <Languages
                    className="size-4 text-amber-200"
                    aria-hidden="true"
                  />
                  Language notes
                </span>
                <span className="flex items-center gap-2">
                  <Accessibility
                    className="size-4 text-amber-200"
                    aria-hidden="true"
                  />
                  Accessibility notes
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-6">
          <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 text-sm font-semibold text-slate-700 sm:grid-cols-3 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
              Built for real local organizations
            </div>
            <div className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3">
              MVP first, scalable later
            </div>
            <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
              Free and open-source package choices
            </div>
          </div>
        </section>

        <section id="features" className="bg-[#f6fbf9] py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Platform Features
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                One calm workspace for the messy parts of community health
                events.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                HealthNook keeps event logistics, participant signups,
                volunteer support, and impact reporting connected from the
                first announcement through the final attendance count.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <SurfaceCard key={feature.title}>
                    <div className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 leading-7 text-slate-600">
                      {feature.description}
                    </p>
                  </SurfaceCard>
                );
              })}
            </div>
          </div>
        </section>

        <section id="use-cases" className="bg-white py-20">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Use Cases
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Designed for groups that already do the work.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                From a school health club to a neighborhood nonprofit,
                HealthNook gives organizers a shared way to promote events,
                collect signups, and understand turnout.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {audiences.map((audience) => (
                  <span
                    key={audience}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                  >
                    {audience}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {useCases.map((useCase) => (
                <SurfaceCard
                  key={useCase}
                  className="flex items-center gap-3 p-4"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#fff1ed] text-[#b5482d]">
                    <MapPin className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-semibold text-slate-800">{useCase}</span>
                </SurfaceCard>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="bg-[#eef7f2] py-20">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8">
            <div className="rounded-lg border border-teal-900/10 bg-white p-5 shadow-sm shadow-teal-950/5">
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <p className="text-sm font-semibold text-teal-700">
                    Event Impact Preview
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                    Community CPR Workshop
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Saturday, 10:00 AM | Westside Library
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                  Published
                </span>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 py-5 text-center">
                <div>
                  <p className="text-3xl font-semibold text-slate-950">48</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                    RSVPs
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-slate-950">12</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                    Volunteers
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-slate-950">39</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">
                    Checked in
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                    <span>Attendance</span>
                    <span>81%</span>
                  </div>
                  <div className="h-3 rounded-lg bg-slate-100">
                    <div className="h-3 w-[81%] rounded-lg bg-teal-700" />
                  </div>
                </div>
                <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
                  Strong turnout with enough volunteers for check-in, room
                  setup, and parent questions.
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Impact
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                Make turnout and service visible after the event.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Organizers will be able to see RSVP totals, volunteer support,
                checked-in attendance, and a plain-language impact summary they
                can share with their community.
              </p>
              <div className="mt-8">
                <ButtonLink href="/dashboard" variant="outline" size="lg">
                  Open dashboard
                  <ArrowRight className="size-5" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
