import type { MetadataRoute } from "next";
import { SITEURL, CONTENT_UPDATED } from "@/data/site";
import { PACKAGES, BLOG } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  // Trailing slashes match trailingSlash: true and the canonical tags. Without
  // them, every entry points at a URL that redirects to the one actually served.
  const pages: { path: string; lastModified: string; priority: number }[] = [
    { path: "/", lastModified: CONTENT_UPDATED, priority: 1 },
    { path: "/about/", lastModified: CONTENT_UPDATED, priority: 0.7 },
    { path: "/blog/", lastModified: CONTENT_UPDATED, priority: 0.7 },
    { path: "/gallery/", lastModified: CONTENT_UPDATED, priority: 0.7 },
    { path: "/contact/", lastModified: CONTENT_UPDATED, priority: 0.7 },
    { path: "/privacy/", lastModified: CONTENT_UPDATED, priority: 0.3 },
    { path: "/terms/", lastModified: CONTENT_UPDATED, priority: 0.3 },
    ...PACKAGES.map((p) => ({
      path: `/packages/${p.slug}/`,
      lastModified: CONTENT_UPDATED,
      priority: 0.8,
    })),
    // Posts carry a real publication date, so they get a truthful <lastmod>
    // rather than the sitewide one.
    ...BLOG.map((b) => ({
      path: `/blog/${b.slug}/`,
      lastModified: b.date,
      priority: 0.6,
    })),
  ];

  return pages.map(({ path, lastModified, priority }) => ({
    url: `${SITEURL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
