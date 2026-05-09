import {
  generateOutreachMessage,
  getMessageTypeLabel,
  outreachDisclaimer,
  type MessageType,
  type TemplateContext,
} from "@/lib/outreach/templates";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-5.4-nano";

type OutreachSource = "template" | "openai";

type GeneratedOutreachMessage = {
  output: string;
  source: OutreachSource;
  fallbackReason?: string;
};

type OpenAIResponseContent = {
  text?: string;
  type?: string;
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

export function getOutreachProviderStatus() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const enabled = process.env.OPENAI_OUTREACH_ENABLED === "true";
  const model =
    process.env.OPENAI_OUTREACH_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
  const mode: OutreachSource = enabled && apiKey ? "openai" : "template";

  return {
    enabled,
    hasApiKey: Boolean(apiKey),
    mode,
    model,
  };
}

function getOpenAIInstructions() {
  return [
    "You write concise, editable outreach drafts for HealthNook community health event organizers.",
    "Do not generate medical advice, diagnosis, treatment instructions, dosage guidance, eligibility claims, risk claims, or clinical recommendations.",
    "Focus only on event logistics, attendance, volunteering, accessibility, language notes, awareness, and community participation.",
    "Use only the facts provided in the input. Do not invent partners, incentives, medical details, resources, or eligibility requirements.",
    `Include this exact disclaimer at the end: "${outreachDisclaimer()}"`,
    "Return only the message draft. Do not wrap it in code fences.",
  ].join("\n");
}

function buildOpenAIInput(messageType: MessageType, context: TemplateContext) {
  return JSON.stringify(
    {
      message_type: getMessageTypeLabel(messageType),
      event: context.event,
      organization: context.organization,
      impact: context.impact,
      public_event_url: context.publicEventUrl,
      style:
        "Warm, clear, practical, community-centered. Keep it easy for an organizer to edit.",
    },
    null,
    2,
  );
}

function extractResponseText(payload: OpenAIResponsePayload) {
  if (typeof payload.output_text === "string") {
    return payload.output_text.trim();
  }

  const outputText =
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => Boolean(text?.trim()))
      .join("\n")
      .trim() ?? "";

  return outputText;
}

async function generateWithOpenAI(
  messageType: MessageType,
  context: TemplateContext,
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
      input: buildOpenAIInput(messageType, context),
      instructions: getOpenAIInstructions(),
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

export async function generateSmartOutreachMessage(
  messageType: MessageType,
  context: TemplateContext,
): Promise<GeneratedOutreachMessage> {
  const templateOutput = generateOutreachMessage(messageType, context);
  const status = getOutreachProviderStatus();
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (status.mode !== "openai" || !apiKey) {
    return {
      output: templateOutput,
      source: "template",
    };
  }

  try {
    return {
      output: await generateWithOpenAI(
        messageType,
        context,
        apiKey,
        status.model,
      ),
      source: "openai",
    };
  } catch {
    return {
      fallbackReason:
        "OpenAI was unavailable, so HealthNook used the free template fallback.",
      output: templateOutput,
      source: "template",
    };
  }
}
