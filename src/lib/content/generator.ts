import { formatEventDateRange } from "@/lib/events/format";
import { displayResourceValue } from "@/lib/resources/constants";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-5.4-nano";
const PROMPT_VERSION = "content-v1";

export const CONTENT_TYPES = [
  {
    label: "Simple explanation",
    value: "simple_explanation",
  },
  {
    label: "Parent-friendly version",
    value: "parent_friendly",
  },
  {
    label: "What to bring",
    value: "what_to_bring",
  },
  {
    label: "What to expect",
    value: "what_to_expect",
  },
  {
    label: "Common questions to ask",
    value: "common_questions",
  },
  {
    label: "Short SMS-style summary",
    value: "sms_summary",
  },
] as const;

export const CONTENT_LANGUAGES = [
  {
    label: "Plain English",
    value: "en",
  },
  {
    label: "Spanish",
    value: "es",
  },
  {
    label: "Nepali",
    value: "ne",
  },
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number]["value"];
export type ContentLanguage = (typeof CONTENT_LANGUAGES)[number]["value"];
export type ContentSource = "template" | "openai";

type EventSubject = {
  kind: "event";
  organizationName: string;
  title: string;
  eventType: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  contactEmail: string;
  languageNotes: string | null;
  accessibilityNotes: string | null;
};

type ResourceSubject = {
  kind: "resource";
  organizationName: string;
  title: string;
  category: string;
  description: string;
  location: string | null;
  cost: string | null;
  eligibility: string | null;
  whatToBring: string | null;
  languagesSupported: string | null;
  contactEmail: string;
  contactPhone: string | null;
  websiteUrl: string | null;
};

export type ContentSubject = EventSubject | ResourceSubject;

type OpenAIResponseContent = {
  text?: string;
};

type OpenAIResponseOutputItem = {
  content?: OpenAIResponseContent[];
};

type OpenAIResponsePayload = {
  output?: OpenAIResponseOutputItem[];
  output_text?: string;
  error?: {
    message?: string;
  };
};

type GeneratedAccessibleContent = {
  contentType: ContentType;
  fallbackReason?: string;
  language: ContentLanguage;
  model: string | null;
  output: string;
  promptVersion: string;
  saveable: boolean;
  source: ContentSource;
};

export function getContentTypeLabel(type: string) {
  return CONTENT_TYPES.find((contentType) => contentType.value === type)?.label ?? type;
}

export function getContentLanguageLabel(language: string) {
  return (
    CONTENT_LANGUAGES.find((contentLanguage) => contentLanguage.value === language)
      ?.label ?? language
  );
}

export function contentDisclaimer() {
  return "HealthNook provides community information and is not medical advice, diagnosis, or treatment guidance.";
}

export function getContentProviderStatus() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const enabled =
    process.env.OPENAI_CONTENT_ENABLED === "true" ||
    process.env.OPENAI_OUTREACH_ENABLED === "true";
  const model =
    process.env.OPENAI_CONTENT_MODEL?.trim() ||
    process.env.OPENAI_OUTREACH_MODEL?.trim() ||
    DEFAULT_OPENAI_MODEL;
  const mode: ContentSource = enabled && apiKey ? "openai" : "template";

  return {
    enabled,
    hasApiKey: Boolean(apiKey),
    mode,
    model,
  };
}

export function isContentType(value: string): value is ContentType {
  return CONTENT_TYPES.some((contentType) => contentType.value === value);
}

export function isContentLanguage(value: string): value is ContentLanguage {
  return CONTENT_LANGUAGES.some((language) => language.value === value);
}

function eventLogistics(subject: EventSubject) {
  return `${formatEventDateRange(subject.startTime, subject.endTime)} at ${subject.location}`;
}

function generateEventTemplate(contentType: ContentType, subject: EventSubject) {
  const logistics = eventLogistics(subject);
  const accessNotes = [
    subject.languageNotes ? `Language notes: ${subject.languageNotes}` : null,
    subject.accessibilityNotes
      ? `Accessibility notes: ${subject.accessibilityNotes}`
      : null,
  ].filter(Boolean);

  switch (contentType) {
    case "simple_explanation":
      return `${subject.title} is a community ${subject.eventType.toLowerCase()} hosted by ${subject.organizationName}.\n\nIt will take place ${logistics}.\n\n${subject.description}\n\n${accessNotes.join("\n")}\n\nQuestions? Contact ${subject.contactEmail}.\n\n${contentDisclaimer()}`;

    case "parent_friendly":
      return `Hello families,\n\n${subject.organizationName} is hosting ${subject.title}. This event is meant to help community members learn, participate, and connect with local support.\n\nWhen and where: ${logistics}\n\nWhat to know: ${subject.description}\n\nQuestions? Contact ${subject.contactEmail}.\n\n${contentDisclaimer()}`;

    case "what_to_bring":
      return `What to bring for ${subject.title}:\n\n- Any registration or confirmation details you received\n- A way to contact the organizer if plans change\n- Questions you want to ask about event logistics\n\nIf the organizer listed special instructions, review them before arriving.\n\n${contentDisclaimer()}`;

    case "what_to_expect":
      return `What to expect at ${subject.title}:\n\n- Event staff or volunteers may help with check-in\n- The organizer may share information, activities, or community resources\n- You can ask logistics questions about the event\n- You do not need to share private medical information through HealthNook\n\nLocation and time: ${logistics}\n\n${contentDisclaimer()}`;

    case "common_questions":
      return `Common questions to ask about ${subject.title}:\n\n- Do I need to register before arriving?\n- Is there a cost to attend?\n- Are language or accessibility supports available?\n- Can I bring family members or guests?\n- Who should I contact if I cannot attend?\n\nOrganizer contact: ${subject.contactEmail}\n\n${contentDisclaimer()}`;

    case "sms_summary":
      return `${subject.title}: ${logistics}. Hosted by ${subject.organizationName}. Questions: ${subject.contactEmail}. ${contentDisclaimer()}`;
  }
}

function generateResourceTemplate(
  contentType: ContentType,
  subject: ResourceSubject,
) {
  switch (contentType) {
    case "simple_explanation":
      return `${subject.title} is a community resource shared by ${subject.organizationName}.\n\nWhat it is: ${subject.description}\n\nWho it is for: ${displayResourceValue(subject.eligibility)}\nCost: ${displayResourceValue(subject.cost)}\nLocation: ${displayResourceValue(subject.location)}\nLanguages: ${displayResourceValue(subject.languagesSupported)}\n\nQuestions? Contact ${subject.contactEmail}.\n\n${contentDisclaimer()}`;

    case "parent_friendly":
      return `Hello families,\n\n${subject.organizationName} shared this resource: ${subject.title}.\n\nIt may help community members understand local support, services, or health education options.\n\nWhat to know: ${subject.description}\n\nCost: ${displayResourceValue(subject.cost)}\nWho it is for: ${displayResourceValue(subject.eligibility)}\nContact: ${subject.contactEmail}\n\n${contentDisclaimer()}`;

    case "what_to_bring":
      return `What to bring for ${subject.title}:\n\n${displayResourceValue(subject.whatToBring)}\n\nIf you are not sure what documents or information are needed, contact ${subject.contactEmail} before you go.\n\n${contentDisclaimer()}`;

    case "what_to_expect":
      return `What to expect from ${subject.title}:\n\n- You can use the contact information to confirm details before going\n- The resource may have eligibility, cost, or document requirements\n- Ask the organizer or provider what support is available in your language\n- Do not share private medical details through HealthNook\n\nLocation: ${displayResourceValue(subject.location)}\n\n${contentDisclaimer()}`;

    case "common_questions":
      return `Common questions to ask about ${subject.title}:\n\n- Who is eligible to use this resource?\n- Is there a cost?\n- What should I bring?\n- What languages are supported?\n- Do I need an appointment?\n- Who can I contact if I need help?\n\nContact: ${subject.contactEmail}\n\n${contentDisclaimer()}`;

    case "sms_summary":
      return `${subject.title}: ${subject.description} Cost: ${displayResourceValue(subject.cost)}. Contact: ${subject.contactEmail}. ${contentDisclaimer()}`;
  }
}

function generateTemplate(contentType: ContentType, subject: ContentSubject) {
  return subject.kind === "event"
    ? generateEventTemplate(contentType, subject)
    : generateResourceTemplate(contentType, subject);
}

function buildOpenAIInstructions(language: ContentLanguage) {
  const languageName = getContentLanguageLabel(language);

  return [
    "You write plain-language community health access content for HealthNook.",
    `Write the output in ${languageName}.`,
    "Do not generate medical advice, diagnosis, treatment instructions, dosage guidance, eligibility promises, risk claims, or clinical recommendations.",
    "Use only the facts provided in the input. Do not invent services, partners, costs, documents, dates, phone numbers, or eligibility requirements.",
    "Focus on logistics, access, attendance, preparation, questions to ask, and community participation.",
    "Keep the language clear for families and community members.",
    `Include this exact English disclaimer at the end: "${contentDisclaimer()}"`,
    "Return only the generated content. Do not wrap it in code fences.",
  ].join("\n");
}

function buildOpenAIInput(
  contentType: ContentType,
  language: ContentLanguage,
  subject: ContentSubject,
) {
  return JSON.stringify(
    {
      content_type: getContentTypeLabel(contentType),
      language: getContentLanguageLabel(language),
      subject,
    },
    null,
    2,
  );
}

function extractResponseText(payload: OpenAIResponsePayload) {
  if (typeof payload.output_text === "string") {
    return payload.output_text.trim();
  }

  return (
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => Boolean(text?.trim()))
      .join("\n")
      .trim() ?? ""
  );
}

async function generateWithOpenAI(
  contentType: ContentType,
  language: ContentLanguage,
  subject: ContentSubject,
  apiKey: string,
  model: string,
) {
  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: buildOpenAIInput(contentType, language, subject),
      instructions: buildOpenAIInstructions(language),
      model,
      reasoning: { effort: "low" },
    }),
  });
  const payload = (await response.json()) as OpenAIResponsePayload;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "OpenAI request failed.");
  }

  const output = extractResponseText(payload);

  if (!output) {
    throw new Error("OpenAI returned an empty draft.");
  }

  return output;
}

export async function generateAccessibleContent(
  contentType: ContentType,
  language: ContentLanguage,
  subject: ContentSubject,
): Promise<GeneratedAccessibleContent> {
  const status = getContentProviderStatus();
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (language !== "en" && status.mode !== "openai") {
    return {
      contentType,
      fallbackReason:
        "Spanish and Nepali translation require OpenAI configuration. Plain English templates still work for free.",
      language,
      model: null,
      output: "",
      promptVersion: PROMPT_VERSION,
      saveable: false,
      source: "template",
    };
  }

  if (status.mode === "openai" && apiKey) {
    try {
      return {
        contentType,
        language,
        model: status.model,
        output: await generateWithOpenAI(
          contentType,
          language,
          subject,
          apiKey,
          status.model,
        ),
        promptVersion: PROMPT_VERSION,
        saveable: true,
        source: "openai",
      };
    } catch {
      if (language !== "en") {
        return {
          contentType,
          fallbackReason:
            "Translation could not be generated right now. Check the OpenAI configuration and try again.",
          language,
          model: status.model,
          output: "",
          promptVersion: PROMPT_VERSION,
          saveable: false,
          source: "openai",
        };
      }
    }
  }

  return {
    contentType,
    language,
    model: null,
    output: generateTemplate(contentType, subject),
    promptVersion: PROMPT_VERSION,
    saveable: true,
    source: "template",
  };
}
