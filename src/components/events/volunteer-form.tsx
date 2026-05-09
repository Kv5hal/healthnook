import { HandHeart } from "lucide-react";

import { Textarea, TextInput } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";

type VolunteerFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function VolunteerForm({ action }: VolunteerFormProps) {
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
          label="Preferred role"
          name="preferred_role"
          placeholder="Check-in, setup, translation"
          type="text"
        />
      </div>
      <Textarea
        helperText="Optional availability or logistics notes only. Do not include private medical information."
        label="Availability/notes"
        name="notes"
        placeholder="Example: Available 9 AM to noon."
      />
      <SubmitButton>
        <HandHeart className="size-4" aria-hidden="true" />
        Volunteer
      </SubmitButton>
    </form>
  );
}
