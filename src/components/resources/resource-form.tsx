import { LibraryBig } from "lucide-react";

import { SelectField, Textarea, TextInput } from "@/components/ui/form-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { RESOURCE_CATEGORIES } from "@/lib/resources/constants";

type ResourceFormValues = {
  title?: string;
  category?: string;
  description?: string;
  location?: string | null;
  cost?: string | null;
  eligibility?: string | null;
  what_to_bring?: string | null;
  languages_supported?: string | null;
  contact_email?: string;
  contact_phone?: string | null;
  website_url?: string | null;
  published?: boolean;
};

type ResourceFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultContactEmail?: string;
  resource?: ResourceFormValues;
  submitLabel: string;
};

export function ResourceForm({
  action,
  defaultContactEmail,
  resource,
  submitLabel,
}: ResourceFormProps) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-2">
        <TextInput
          defaultValue={resource?.title ?? ""}
          label="Resource title"
          name="title"
          placeholder="Free blood pressure checks"
          required
          type="text"
        />
        <SelectField
          defaultValue={resource?.category ?? ""}
          label="Category"
          name="category"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {RESOURCE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </SelectField>
      </div>

      <Textarea
        defaultValue={resource?.description ?? ""}
        helperText="Explain what the resource is and how someone can use it. Do not include private medical information."
        label="Description"
        name="description"
        placeholder="A weekly community table where visitors can learn about local health services and ask logistics questions."
        required
      />

      <TextInput
        defaultValue={resource?.location ?? ""}
        label="Location"
        name="location"
        placeholder="Westside Library, 1200 Main St"
        type="text"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Textarea
          defaultValue={resource?.cost ?? ""}
          label="Cost"
          name="cost"
          placeholder="Free, sliding scale, insurance accepted, or unknown."
        />
        <Textarea
          defaultValue={resource?.eligibility ?? ""}
          label="Eligibility"
          name="eligibility"
          placeholder="Who this is for. Example: Open to all community members."
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Textarea
          defaultValue={resource?.what_to_bring ?? ""}
          label="What to bring"
          name="what_to_bring"
          placeholder="Example: Photo ID if available. No documents required."
        />
        <Textarea
          defaultValue={resource?.languages_supported ?? ""}
          label="Languages supported"
          name="languages_supported"
          placeholder="Example: English, Spanish, Nepali."
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <TextInput
          defaultValue={resource?.contact_email ?? defaultContactEmail ?? ""}
          label="Contact email"
          name="contact_email"
          required
          type="email"
        />
        <TextInput
          defaultValue={resource?.contact_phone ?? ""}
          label="Contact phone"
          name="contact_phone"
          type="tel"
        />
      </div>

      <TextInput
        defaultValue={resource?.website_url ?? ""}
        helperText="Optional. Link to an official page, flyer, signup form, or social post."
        label="Website or resource link"
        name="website_url"
        type="url"
      />

      <label className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <input
          className="mt-1 size-4 rounded border-slate-300 text-teal-700 focus:ring-teal-600"
          defaultChecked={resource?.published ?? false}
          name="published"
          type="checkbox"
          value="true"
        />
        <span>
          <span className="block text-sm font-semibold text-slate-900">
            Publish this resource
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            Published resources appear in the public resource directory. Drafts
            stay organizer-only.
          </span>
        </span>
      </label>

      <SubmitButton>
        <LibraryBig className="size-4" aria-hidden="true" />
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
