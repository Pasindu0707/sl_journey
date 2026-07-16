// JSON-LD builders. Pure functions only — no JSX (that lives in components/).
//
// Everything here is derived from site.ts / content.ts rather than restated, so
// a price or brand change flows into the structured data automatically.
//
// Deliberately absent: aggregateRating and Review. Self-serving review markup on
// your own organisation is ignored by Google and risks a manual action, so the
// "Rated Excellent on Tripadvisor" claim is linked out to the real profile
// instead of marked up here.

import {
  ADDRESS,
  BRAND,
  COUNTRY,
  EMAIL,
  LOCALITY,
  PHONE_RAW,
  SITEURL,
  SOCIALS,
  STREET,
  TAGLINE,
} from "@/data/site";
import { priceBasis, type Package, type Post } from "@/data/content";

/** Absolute URL for a root-relative path. Schema requires absolute URLs. */
const abs = (path: string) => new URL(path, SITEURL).toString();

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: STREET,
  addressLocality: LOCALITY,
  addressCountry: COUNTRY,
} as const;

export function travelAgencySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${SITEURL}/#organization`,
    name: BRAND,
    description: TAGLINE,
    url: abs("/"),
    logo: abs("/assets/logo/logo-full-trans.png"),
    image: abs("/assets/img/lib/sigiriya.jpg"),
    telephone: PHONE_RAW,
    email: EMAIL,
    address: postalAddress,
    areaServed: "Sri Lanka",
    // Omitted entirely when empty: an empty sameAs array is noise, and a guessed
    // URL would claim someone else's profile as ours.
    ...(SOCIALS.length ? { sameAs: SOCIALS } : {}),
  };
}

export function packageSchema(p: Package) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    // The Offer price is a bare number with no unit, so the basis (per person vs
    // per couple) is stated here or it is simply lost. Honeymoon Vibes is priced
    // per couple, and reading it as per-person would understate it by half.
    description: `${p.dur} Sri Lanka tour. From $${p.priceUSD.toLocaleString(
      "en-US"
    )} USD ${priceBasis(p)}. ${p.intro}`,
    image: abs(`/assets/img/lib/${p.hero}.jpg`),
    url: abs(`/packages/${p.slug}/`),
    brand: { "@type": "Brand", name: BRAND },
    offers: {
      "@type": "Offer",
      price: p.priceUSD,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: abs(`/packages/${p.slug}/`),
      seller: { "@id": `${SITEURL}/#organization` },
    },
  };
}

export function blogPostingSchema(b: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: b.title,
    description: b.excerpt,
    image: abs(`/assets/img/lib/${b.img}.jpg`),
    datePublished: b.date,
    dateModified: b.date,
    author: { "@type": "Organization", name: BRAND, url: abs("/") },
    publisher: { "@id": `${SITEURL}/#organization` },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": abs(`/blog/${b.slug}/`),
    },
  };
}

/** Mirrors the visible .crumb trail. Pass the same labels the page renders. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

/** Address as one line, for anywhere that wants the human-readable form. */
export const fullAddress = ADDRESS;
