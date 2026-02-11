import type { MetadataRoute } from "next";
import { blogIds, videoIds } from "@/lib/content-data";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...blogIds.map((id) => ({
      url: `${siteUrl}/blog/${id}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...videoIds.map((id) => ({
      url: `${siteUrl}/video/${id}/`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
