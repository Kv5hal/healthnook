export const RESOURCE_CATEGORIES = [
  "Clinic or care access",
  "Food and nutrition",
  "Mental health support",
  "Insurance or benefits help",
  "Transportation",
  "Language or interpretation",
  "Family and youth support",
  "Health education",
  "Community support",
] as const;

export function displayResourceValue(value: string | null | undefined) {
  return value?.trim() || "Not specified";
}
