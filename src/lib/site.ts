export const DEFAULT_SITE_URL = "http://localhost:3000";

export function getPublicSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (
    configuredUrl?.startsWith("http://") ||
    configuredUrl?.startsWith("https://")
  ) {
    return configuredUrl.replace(/\/$/, "");
  }

  return DEFAULT_SITE_URL;
}
