export function formatEventDateRange(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const date = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(start);

  const startLabel = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
  }).format(start);

  const endLabel = new Intl.DateTimeFormat("en", {
    timeStyle: "short",
  }).format(end);

  return `${date} | ${startLabel} - ${endLabel}`;
}

export function formatShortDateTime(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function toDateTimeLocalValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 16);
}

export function getEventStatusLabel(published: boolean, startTime: string) {
  if (!published) {
    return "Draft";
  }

  return new Date(startTime).getTime() < Date.now() ? "Past" : "Published";
}
