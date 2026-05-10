export const HEALTHNOOK_RESOURCE_DISCLAIMER =
  "HealthNook provides community information and is not medical advice, diagnosis, or treatment guidance. For personal medical questions, contact a qualified healthcare professional.";

export type FounderResource = {
  slug: string;
  title: string;
  category: string;
  label: "Created by HealthNook" | "Founder-created guide";
  shortDescription: string;
  whoThisMayHelp: string[];
  keyPoints: string[];
  whatToBringOrPrepare: string[];
  questionsToAsk: string[];
  safetyNote: string;
  published: boolean;
};

export const founderResources: FounderResource[] = [
  {
    slug: "why-cpr-awareness-matters",
    title: "Why CPR Awareness Matters",
    category: "Emergency Preparedness",
    label: "Created by HealthNook",
    shortDescription:
      "Learn what CPR awareness means, why early response matters, and how families, students, and volunteers can prepare before joining a CPR class.",
    whoThisMayHelp: [
      "Students, families, youth groups, and community volunteers",
      "People deciding whether to attend a CPR workshop",
      "Organizers explaining why CPR classes matter for community readiness",
    ],
    keyPoints: [
      "CPR awareness means understanding the purpose of CPR, when emergency help may be needed, and why trained response can matter before professionals arrive.",
      "Early response matters because emergencies are time-sensitive and bystanders often notice a problem before emergency responders arrive.",
      "A CPR workshop may cover recognizing emergencies, calling for help, chest compression practice, AED awareness, and when to seek certified training.",
      "Learning CPR basics can help community members feel more prepared, even if they are not medical professionals.",
    ],
    whatToBringOrPrepare: [
      "Ask whether the class is awareness-only or provides official certification.",
      "Wear comfortable clothing if the workshop includes hands-on practice.",
      "Bring registration details, payment information if required, and any forms requested by the instructor.",
    ],
    questionsToAsk: [
      "Is this workshop for awareness, certification, or both?",
      "Who is teaching the class, and what organization provides the certification if one is offered?",
      "Is the class appropriate for students or first-time learners?",
      "Will AED awareness or hands-on practice be included?",
      "Are language support, accessibility support, or youth accommodations available?",
    ],
    safetyNote:
      "This guide is informational and is not a substitute for certified CPR training. Follow instructions from qualified instructors and call emergency services during an emergency.",
    published: true,
  },
  {
    slug: "how-to-prepare-for-a-blood-drive",
    title: "How to Prepare for a Blood Drive",
    category: "Blood Donation",
    label: "Created by HealthNook",
    shortDescription:
      "Understand what a blood drive does, what to bring, and which questions to ask before donating or helping promote a blood drive.",
    whoThisMayHelp: [
      "First-time blood drive attendees",
      "Students or families deciding whether to learn more about donation",
      "Community organizers promoting a blood drive without giving medical advice",
    ],
    keyPoints: [
      "A blood drive is an organized event where eligible donors can give blood through a trained donation provider.",
      "Blood donation can support hospitals and patients, but eligibility and donation steps must come from the official donation provider.",
      "Before attending, check appointment details, identification requirements, age rules, and any preparation instructions.",
      "Donation staff are the right people to answer personal eligibility and safety questions.",
    ],
    whatToBringOrPrepare: [
      "Photo ID if requested by the donation provider",
      "Appointment confirmation or registration details",
      "Any forms or instructions shared by the organizer or donation provider",
      "A list of questions you want to ask qualified donation staff",
    ],
    questionsToAsk: [
      "What official eligibility rules should I review before arriving?",
      "Do I need an appointment, or are walk-ins accepted?",
      "What identification or forms should I bring?",
      "Who can answer questions about medications, travel, age, weight, or health history?",
      "What should I do if I feel unsure before or after donating?",
    ],
    safetyNote:
      "Check official eligibility rules and speak with qualified donation staff for personal questions. Do not rely on community event information for medical eligibility decisions.",
    published: true,
  },
  {
    slug: "what-to-expect-at-a-health-fair",
    title: "What to Expect at a Health Fair",
    category: "Event Preparation",
    label: "Created by HealthNook",
    shortDescription:
      "A plain-language guide to common health fair booths, questions families can ask, and how to follow up after general screening information.",
    whoThisMayHelp: [
      "Families attending a health fair for the first time",
      "Students helping relatives navigate booths or resource tables",
      "Organizers explaining what attendees may see at a wellness event",
    ],
    keyPoints: [
      "Health fairs often include information tables, wellness education, community resources, screenings, insurance or benefits help, and volunteer support.",
      "Services vary by event, so attendees should check the event listing before arriving.",
      "General screenings can help people learn what follow-up questions to ask, but they are not a full medical diagnosis.",
      "After receiving screening information, ask who to contact, whether results should be shared with a clinician, and what follow-up steps are recommended.",
    ],
    whatToBringOrPrepare: [
      "Photo ID if the event asks for one",
      "Insurance card if you have one and if services request it",
      "A list of current questions or concerns you want to ask at information booths",
      "Paper, phone notes, or a folder for handouts and follow-up information",
    ],
    questionsToAsk: [
      "Which booths or services are available today?",
      "Is there any cost for this service or follow-up?",
      "Should I share this screening result with a doctor or clinic?",
      "Who can I contact after the event if I have questions?",
      "Are interpreters, translated materials, or accessibility support available?",
    ],
    safetyNote:
      "Screenings and health fair information are not a full medical diagnosis. For personal medical questions, contact a qualified healthcare professional.",
    published: true,
  },
  {
    slug: "questions-to-ask-at-a-community-health-event",
    title: "Questions to Ask at a Community Health Event",
    category: "Health Literacy",
    label: "Founder-created guide",
    shortDescription:
      "A simple question list attendees can use at workshops, screenings, wellness seminars, resource fairs, or blood drives.",
    whoThisMayHelp: [
      "Families who want to feel more prepared at community events",
      "Students helping parents or relatives understand event logistics",
      "Attendees comparing costs, eligibility, documents, language access, and follow-up steps",
    ],
    keyPoints: [
      "It is okay to ask plain-language questions about cost, eligibility, what to bring, language support, and next steps.",
      "Event volunteers can often help with directions and logistics, but medical questions should go to qualified professionals.",
      "You do not need to share private medical details with general volunteers or public event staff.",
      "Writing questions down before arriving can make the event easier to navigate.",
    ],
    whatToBringOrPrepare: [
      "A short list of questions you want answered",
      "Registration details or appointment confirmation if required",
      "Any documents the event specifically asks attendees to bring",
      "A trusted family member or interpreter if you need support and the event allows it",
    ],
    questionsToAsk: [
      "Is there any cost today or for follow-up services?",
      "Who is eligible for this service or activity?",
      "What documents, forms, or identification do I need?",
      "What should I do after this event if I need more help?",
      "Is language interpretation, translated material, or accessibility support available?",
    ],
    safetyNote:
      "Do not share private medical details unless you are speaking with qualified professionals in an appropriate setting. For personal medical questions, contact a qualified healthcare professional.",
    published: true,
  },
  {
    slug: "community-volunteer-guide-for-health-events",
    title: "Community Volunteer Guide for Health Events",
    category: "Volunteering",
    label: "Founder-created guide",
    shortDescription:
      "Learn common volunteer roles at community health events and how volunteers can help without giving medical advice.",
    whoThisMayHelp: [
      "Students and youth groups volunteering at health events",
      "Community members helping with outreach, setup, or check-in",
      "Organizers preparing volunteers for non-clinical support roles",
    ],
    keyPoints: [
      "Common volunteer roles include greeting attendees, helping with check-in, giving directions, setting up tables, handing out approved materials, and supporting outreach.",
      "Volunteers can make events feel more welcoming by using clear directions, respectful communication, and privacy-aware check-in practices.",
      "Volunteers should not explain test results, recommend treatments, collect unnecessary private medical details, or answer medical questions unless they are qualified and assigned to do so.",
      "When unsure, volunteers should direct attendees to the organizer or qualified staff.",
    ],
    whatToBringOrPrepare: [
      "Volunteer schedule, role assignment, and organizer contact information",
      "Comfortable clothing and any required badge, shirt, or check-in material",
      "A clear understanding of where to send attendees with medical or privacy questions",
      "Any approved scripts, maps, flyers, or outreach materials from the organizer",
    ],
    questionsToAsk: [
      "What is my volunteer role and who is my point of contact?",
      "What information am I allowed to share with attendees?",
      "Where should I send medical, privacy, or eligibility questions?",
      "What should I do if an attendee needs language or accessibility support?",
      "How should I handle check-in information respectfully and privately?",
    ],
    safetyNote:
      "Volunteers should not give medical advice unless they are qualified and assigned to that role. Personal medical questions should go to qualified healthcare professionals.",
    published: true,
  },
];

export function getFounderResourceBySlug(slug: string) {
  return founderResources.find(
    (resource) => resource.published && resource.slug === slug,
  );
}
