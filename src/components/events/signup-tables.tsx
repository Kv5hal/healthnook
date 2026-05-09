import { CheckCircle2, Circle, Mail, Phone } from "lucide-react";

import { formatShortDateTime } from "@/lib/events/format";

type RsvpRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  guests: number;
  notes: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
};

type VolunteerRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  preferred_role: string | null;
  notes: string | null;
  created_at: string;
};

type RsvpTableProps = {
  rsvps: RsvpRow[];
};

type VolunteerTableProps = {
  volunteers: VolunteerRow[];
};

export function RsvpTable({ rsvps }: RsvpTableProps) {
  if (rsvps.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        No RSVPs yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-[860px] divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          <tr>
            <th className="px-4 py-3">Attendee</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Guests</th>
            <th className="px-4 py-3">Check-in</th>
            <th className="px-4 py-3">Notes</th>
            <th className="px-4 py-3">Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {rsvps.map((rsvp) => (
            <tr key={rsvp.id}>
              <td className="px-4 py-3 font-semibold text-slate-950">
                {rsvp.name}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <div className="space-y-1">
                  <a
                    className="flex items-center gap-2 text-teal-700 hover:text-teal-800"
                    href={`mailto:${rsvp.email}`}
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    {rsvp.email}
                  </a>
                  {rsvp.phone ? (
                    <a
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                      href={`tel:${rsvp.phone}`}
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {rsvp.phone}
                    </a>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600">{rsvp.guests}</td>
              <td className="px-4 py-3 text-slate-600">
                {rsvp.checked_in ? (
                  <span className="inline-flex items-center gap-2 font-semibold text-emerald-700">
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                    {formatShortDateTime(rsvp.checked_in_at)}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 text-slate-500">
                    <Circle className="size-4" aria-hidden="true" />
                    Not checked in
                  </span>
                )}
              </td>
              <td className="max-w-xs px-4 py-3 text-slate-600">
                {rsvp.notes ?? "None"}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatShortDateTime(rsvp.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function VolunteerTable({ volunteers }: VolunteerTableProps) {
  if (volunteers.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        No volunteer signups yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-[760px] divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          <tr>
            <th className="px-4 py-3">Volunteer</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Preferred role</th>
            <th className="px-4 py-3">Notes</th>
            <th className="px-4 py-3">Submitted</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {volunteers.map((volunteer) => (
            <tr key={volunteer.id}>
              <td className="px-4 py-3 font-semibold text-slate-950">
                {volunteer.name}
              </td>
              <td className="px-4 py-3 text-slate-600">
                <div className="space-y-1">
                  {volunteer.email ? (
                    <a
                      className="flex items-center gap-2 text-teal-700 hover:text-teal-800"
                      href={`mailto:${volunteer.email}`}
                    >
                      <Mail className="size-4" aria-hidden="true" />
                      {volunteer.email}
                    </a>
                  ) : (
                    <span>No email</span>
                  )}
                  {volunteer.phone ? (
                    <a
                      className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
                      href={`tel:${volunteer.phone}`}
                    >
                      <Phone className="size-4" aria-hidden="true" />
                      {volunteer.phone}
                    </a>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {volunteer.preferred_role ?? "Not specified"}
              </td>
              <td className="max-w-xs px-4 py-3 text-slate-600">
                {volunteer.notes ?? "None"}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatShortDateTime(volunteer.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
