import { ClipboardCheck } from "lucide-react";

import { Textarea, TextInput } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

type RsvpFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function RsvpForm({ action }: RsvpFormProps) {
  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          autoComplete="name"
          label="Name"
          name="name"
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
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          autoComplete="tel"
          label="Phone"
          name="phone"
          type="tel"
        />
        <TextInput
          defaultValue={0}
          helperText="Additional guests besides you."
          label="Guests"
          min={0}
          name="guests"
          type="number"
        />
      </div>
      <Textarea
        helperText="Optional logistics notes only. Do not include private medical information."
        label="Notes"
        name="notes"
        placeholder="Example: I will arrive 10 minutes late."
      />
      <SubmitButton>
        <ClipboardCheck className="size-4" aria-hidden="true" />
        Submit RSVP
      </SubmitButton>
    </form>
  );
}
