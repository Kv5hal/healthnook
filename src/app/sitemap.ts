import type { MetadataRoute } from "next";

import { getPublicSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getPublicSiteUrl();
  const now = new Date();

  return [
    {
      changeFrequency: "weekly",
      lastModified: now,
      priority: 1,
      url: siteUrl,
    },
    {
      changeFrequency: "daily",
      lastModified: now,
      priority: 0.8,
      url: `${siteUrl}/events`,
    },
    {
      changeFrequency: "monthly",
      lastModified: now,
      priority: 0.5,
      url: `${siteUrl}/login`,
    },
    {
      changeFrequency: "monthly",
      lastModified: now,
      priority: 0.5,
      url: `${siteUrl}/signup`,
    },
  ];
}
