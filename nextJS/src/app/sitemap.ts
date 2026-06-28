import type { MetadataRoute } from "next";
import { SITEURL } from "@/data/site";
import { PACKAGES, BLOG } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ["", "/about", "/blog", "/gallery", "/contact"];
  const pkg = PACKAGES.map((p) => `/packages/${p.slug}`);
  const posts = BLOG.map((b) => `/blog/${b.slug}`);
  return [...routes, ...pkg, ...posts].map((path) => ({
    url: `${SITEURL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
