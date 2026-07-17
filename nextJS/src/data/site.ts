export const BRAND = "SL Journey";
export const TAGLINE = "Explore the Soul of Sri Lanka";
export const PHONE = "+94 77 619 4579";
export const PHONE_RAW = "+94776194579";
export const WA = "94776194579";
export const EMAIL = "hello@sljourney.com";
export const ADDRESS = "No: 40A/1, Dummaladeniya North, Wennappuwa, Sri Lanka";
export const SITEURL = "https://sljourney.com";

// Structured-data address parts. Kept split so schema.ts can emit a PostalAddress
// without re-parsing ADDRESS.
export const STREET = "No: 40A/1, Dummaladeniya North";
export const LOCALITY = "Wennappuwa";
export const COUNTRY = "LK";

// Social + review profiles.
//
// TODO: fill these in. Leave any unknown URL as "" — the Footer skips empty ones
// rather than rendering a dead icon, and SOCIALS below feeds schema.org sameAs,
// where a wrong URL claims someone else's profile as ours. Never guess these.
export const INSTAGRAM = "";
export const FACEBOOK = "";
export const TRIPADVISOR = "";

/** Non-empty profile URLs, for JSON-LD sameAs. */
export const SOCIALS = [INSTAGRAM, FACEBOOK, TRIPADVISOR].filter(Boolean);

// Prefixes a root-relative path (e.g. "/assets/...") with the deploy base path.
// Plain <img>/<a> tags are not auto-prefixed by Next's basePath — only next/link
// and next/image are — so static asset URLs must go through this helper.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (path: string) => `${BASE_PATH}${path}`;

export function waLink(
  text = "Hello SL Journey! I'd love to plan a trip to Sri Lanka."
) {
  return `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
}
