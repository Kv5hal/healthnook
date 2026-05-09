import { CalendarPlus } from "lucide-react";

import { SelectField, Textarea, TextInput } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { EVENT_TYPES } from "@/lib/events/constants";
import { toDateTimeLocalValue } from "@/lib/events/format";

type EventFormValues = {
  title?: string;
  event_type?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  max_attendees?: number | null;
  volunteer_slots_needed?: number | null;
  contact_email?: string;
  language_notes?: string | null;
  accessibility_notes?: string | null;
  published?: boolean;
};

type EventFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  event?: EventFormValues;
  submitLabel: string;
  defaultContactEmail?: string;
};

export function EventForm({
  action,
  event,
  submitLabel,
  defaultContactEmail,
}: EventFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <TextInput
          defaultValue={event?.title ?? ""}
          label="Event title"
          name="title"
          placeholder="Community CPR Workshop"
          required
          type="text"
        />
        <SelectField
          defaultValue={event?.event_type ?? ""}
          label="Event type"
          name="event_type"
          required
        >
          <option value="" disabled>
            Select a type
          </option>
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </SelectField>
      </div>

      <Textarea
        defaultValue={event?.description ?? ""}
        helperText="Keep this focused on logistics, participation, and community awareness. Do not include medical advice."
        label="Description"
        name="description"
        placeholder="A hands-on workshop introducing community members to CPR basics and emergency preparedness resources."
        required
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <TextInput
          defaultValue={toDateTimeLocalValue(event?.start_time)}
          label="Start date and time"
          name="start_time"
          required
          type="datetime-local"
        />
        <TextInput
          defaultValue={toDateTimeLocalValue(event?.end_time)}
          label="End date and time"
          name="end_time"
          required
          type="datetime-local"
        />
      </div>

      <TextInput
        defaultValue={event?.location ?? ""}
        label="Location"
        name="location"
        placeholder="Westside Library, 1200 Main St"
        required
        type="text"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <TextInput
          defaultValue={event?.max_attendees ?? ""}
          helperText="Optional. Leave blank if there is no attendee cap yet."
          label="Max attendees"
          min={1}
          name="max_attendees"
          type="number"
        />
        <TextInput
          defaultValue={event?.volunteer_slots_needed ?? ""}
          helperText="Optional. Use 0 if volunteers are not needed."
          label="Volunteer slots needed"
          min={0}
          name="volunteer_slots_needed"
          type="number"
        />
      </div>

      <TextInput
        defaultValue={event?.contact_email ?? defaultContactEmail ?? ""}
        label="Contact email"
        name="contact_email"
        required
        type="email"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Textarea
          defaultValue={event?.language_notes ?? ""}
          label="Language notes"
          name="language_notes"
          placeholder="Example: Spanish-speaking volunteers available."
        />
        <Textarea
          defaultValue={event?.accessibility_notes ?? ""}
          label="Accessibility notes"
          name="accessibility_notes"
          placeholder="Example: Wheelchair-accessible entrance on Oak Street."
        />
      </div>

      <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <input
          className="mt-1 size-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
          defaultChecked={event?.published ?? false}
          name="published"
          type="checkbox"
          value="true"
        />
        <span>
          <span className="block text-sm font-semibold text-slate-900">
            Publish this event
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            Published events appear on the public events page. Drafts stay
            organizer-only.
          </span>
        </span>
      </label>

      <SubmitButton>
        <CalendarPlus className="size-4" aria-hidden="true" />
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
