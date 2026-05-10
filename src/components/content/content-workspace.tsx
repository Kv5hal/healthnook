import { Languages, WandSparkles } from "lucide-react";

import { updateGeneratedContentAction } from "@/app/dashboard/content/actions";
import { SelectField, Textarea } from "@/components/ui/form-field";
import { SurfaceCard } from "@/components/ui/surface-card";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  CONTENT_LANGUAGES,
  CONTENT_TYPES,
  getContentLanguageLabel,
  getContentProviderStatus,
  getContentTypeLabel,
} from "@/lib/content/generator";

type GeneratedContentRow = {
  id: string;
  content_type: string;
  language: string;
  source: string;
  model: string | null;
  prompt_version: string;
  output: string;
  created_at: string;
};

type ContentWorkspaceProps = {
  generatedContent: GeneratedContentRow[];
  generateAction: (formData: FormData) => void | Promise<void>;
  redirectPath: string;
};

export function ContentWorkspace({
  generatedContent,
  generateAction,
  redirectPath,
}: ContentWorkspaceProps) {
  const providerStatus = getContentProviderStatus();
  const statusTitle =
    providerStatus.mode === "openai"
      ? "Optional OpenAI mode"
      : "Free template mode";
  const statusDescription =
    providerStatus.mode === "openai"
      ? `AI generation and translation are enabled with ${providerStatus.model}. This may use your OpenAI credits.`
      : providerStatus.enabled && !providerStatus.hasApiKey
        ? "AI mode is switched on, but no server API key is configured. Plain English templates still work."
        : "Plain English templates work for free. Spanish and Nepali translation require OpenAI configuration.";

  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <SurfaceCard>
        <div className="flex size-11 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <WandSparkles className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-slate-950">
          Generate Plain-Language Content
        </h2>
        <p className="mt-3 leading-7 text-slate-600">
          Create simple explanations, preparation notes, questions to ask, or
          short summaries for community members.
        </p>
        <div className="mt-5 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3">
          <p className="text-sm font-semibold text-teal-900">{statusTitle}</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">
            {statusDescription}
          </p>
        </div>
        <form action={generateAction} className="mt-5 space-y-4">
          <SelectField label="Content type" name="content_type" required>
            {CONTENT_TYPES.map((contentType) => (
              <option key={contentType.value} value={contentType.value}>
                {contentType.label}
              </option>
            ))}
          </SelectField>
          <SelectField label="Language" name="language" required>
            {CONTENT_LANGUAGES.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </SelectField>
          <SubmitButton>
            <Languages className="size-4" aria-hidden="true" />
            Generate Content
          </SubmitButton>
        </form>
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
          Guardrail: content should explain access and logistics only. It should
          not be used as medical advice.
        </p>
      </SurfaceCard>

      <div className="space-y-4">
        {generatedContent.length === 0 ? (
          <SurfaceCard>
            <h2 className="text-xl font-semibold text-slate-950">
              No generated content yet.
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              Choose a content type and language to create the first editable
              draft.
            </p>
          </SurfaceCard>
        ) : (
          generatedContent.map((content) => {
            const updateAction = updateGeneratedContentAction.bind(
              null,
              redirectPath,
              content.id,
            );

            return (
              <SurfaceCard key={content.id}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">
                      {getContentTypeLabel(content.content_type)}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {getContentLanguageLabel(content.language)} |{" "}
                      {content.source}
                      {content.model ? ` | ${content.model}` : ""}
                    </p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {content.prompt_version}
                  </p>
                </div>
                <form action={updateAction} className="mt-5 space-y-4">
                  <Textarea
                    defaultValue={content.output}
                    label="Generated content"
                    name="output"
                    required
                  />
                  <SubmitButton variant="secondary">Save Edits</SubmitButton>
                </form>
              </SurfaceCard>
            );
          })
        )}
      </div>
    </div>
  );
}
