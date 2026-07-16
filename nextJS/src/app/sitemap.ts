import type { MetadataRoute } from "next";
import { SITEURL } from "@/data/site";
import { PACKAGES, BLOG } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["/", "/about/", "/blog/", "/gallery/", "/contact/", "/privacy/", "/terms/"];
  const pkg = PACKAGES.map((p) => `/packages/${p.slug}/`);
  const posts = BLOG.map((b) => `/blog/${b.slug}/`);

  return [...routes, ...pkg, ...posts].map((path) => ({
    // Trailing slashes match trailingSlash: true and the canonical tags. Without
    // them, every entry points at a URL that redirects to the one actually served.
    url: `${SITEURL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path === "/privacy/" || path === "/terms/" ? 0.3 : 0.7,
  }));
}
