import { formatEventDateRange } from "@/lib/events/format";

export const MESSAGE_TYPES = [
  {
    label: "Instagram caption",
    value: "instagram_caption",
  },
  {
    label: "Parent-friendly announcement",
    value: "parent_announcement",
  },
  {
    label: "Volunteer reminder",
    value: "volunteer_reminder",
  },
  {
    label: "Email announcement",
    value: "email_announcement",
  },
  {
    label: "Post-event thank-you",
    value: "post_event_thank_you",
  },
  {
    label: "Post-event impact summary",
    value: "post_event_impact_summary",
  },
] as const;

export type MessageType = (typeof MESSAGE_TYPES)[number]["value"];

export type TemplateEvent = {
  title: string;
  event_type: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  contact_email: string;
  language_notes: string | null;
  accessibility_notes: string | null;
};

export type TemplateOrganization = {
  name: string;
};

export type TemplateImpact = {
  rsvpCount: number;
  expectedAttendees: number;
  volunteerCount: number;
  checkedInAttendees: number;
  attendancePercentage: number;
};

export type TemplateContext = {
  event: TemplateEvent;
  organization: TemplateOrganization;
  impact: TemplateImpact;
  publicEventUrl: string;
};

export function getMessageTypeLabel(type: string) {
  return MESSAGE_TYPES.find((messageType) => messageType.value === type)?.label ?? type;
}

function logisticsLine(event: TemplateEvent) {
  return `${formatEventDateRange(event.start_time, event.end_time)} at ${event.location}`;
}

function accessLine(event: TemplateEvent) {
  const notes = [
    event.language_notes ? `Language notes: ${event.language_notes}` : null,
    event.accessibility_notes
      ? `Accessibility notes: ${event.accessibility_notes}`
      : null,
  ].filter(Boolean);

  return notes.length > 0 ? `\n\n${notes.join("\n")}` : "";
}

export function outreachDisclaimer() {
  return "This event information is for community awareness and logistics only, not medical advice.";
}

export function generateOutreachMessage(
  messageType: MessageType,
  context: TemplateContext,
) {
  const { event, organization, impact, publicEventUrl } = context;
  const logistics = logisticsLine(event);
  const access = accessLine(event);

  switch (messageType) {
    case "instagram_caption":
      return `Join ${organization.name} for ${event.title}.\n\n${event.description}\n\nWhen: ${logistics}\n\nRSVP or learn more: ${publicEventUrl}${access}\n\n${outreachDisclaimer()}\n\n#CommunityHealth #HealthNook #LocalEvents`;

    case "parent_announcement":
      return `Hello families,\n\n${organization.name} is hosting ${event.title}, a community ${event.event_type.toLowerCase()}.\n\nEvent details: ${logistics}\n\n${event.description}\n\nYou can view event details and sign up here: ${publicEventUrl}${access}\n\nQuestions? Contact ${event.contact_email}.\n\n${outreachDisclaimer()}`;

    case "volunteer_reminder":
      return `Hi volunteers,\n\nThank you for helping with ${event.title}. This is a reminder that the event is scheduled for ${logistics}.\n\nPlease review the event details before arriving: ${publicEventUrl}\n\nCurrent volunteer signups: ${impact.volunteerCount}.\n\nIf your availability changes, please contact ${event.contact_email}.\n\n${outreachDisclaimer()}`;

    case "email_announcement":
      return `Subject: ${event.title} hosted by ${organization.name}\n\nHello,\n\n${organization.name} is hosting ${event.title}.\n\nWhat: ${event.event_type}\nWhen: ${logistics}\nWhere: ${event.location}\n\n${event.description}\n\nRSVP or volunteer here: ${publicEventUrl}${access}\n\nQuestions? Contact ${event.contact_email}.\n\n${outreachDisclaimer()}`;

    case "post_event_thank_you":
      return `Thank you to everyone who participated in ${event.title}.\n\nWe appreciate the attendees, volunteers, partners, and community members who helped make this event possible.\n\nEvent participation snapshot:\n- RSVPs: ${impact.rsvpCount}\n- Expected attendees: ${impact.expectedAttendees}\n- Volunteer signups: ${impact.volunteerCount}\n- Checked in: ${impact.checkedInAttendees}\n\n${outreachDisclaimer()}`;

    case "post_event_impact_summary":
      return `${event.title} impact summary\n\nOrganizer: ${organization.name}\nEvent type: ${event.event_type}\nLocation: ${event.location}\n\nParticipation:\n- RSVPs: ${impact.rsvpCount}\n- Expected attendees: ${impact.expectedAttendees}\n- Volunteer signups: ${impact.volunteerCount}\n- Checked-in attendees: ${impact.checkedInAttendees}\n- Attendance percentage: ${impact.attendancePercentage}%\n\nThis summary reflects logistics and participation data collected through HealthNook.\n\n${outreachDisclaimer()}`;
  }
}
