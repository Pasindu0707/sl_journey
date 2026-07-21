// JSON-LD builders. Pure functions only — no JSX (that lives in components/).
//
// Everything here is derived from site.ts / content.ts rather than restated, so
// a price or brand change flows into the structured data automatically.
//
// Deliberately absent: aggregateRating and Review. Self-serving review markup on
// your own organisation is ignored by Google and risks a manual action, so the
// "Rated Excellent on Tripadvisor" claim is linked out to the real profile
// instead of marked up here.
//
// Also deliberately absent: Product. A tour is not a retail good — see the note
// on packageSchema below.

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

/**
 * A tour package as a TouristTrip, not a Product.
 *
 * These pages were previously marked up as `Product`, which put the site in
 * Search Console's "Merchant listings" and "Product snippets" reports and drew
 * warnings for four fields that cannot honestly be supplied:
 *
 *   shippingDetails / hasMerchantReturnPolicy — a guided tour is not shipped and
 *     cannot be returned, so any value here would be fiction.
 *   aggregateRating / review — we have no verifiable first-party review corpus,
 *     and inventing one is a manual-action risk (see the note at the top).
 *
 * Product is also simply the wrong claim: it advertises a fixed price and
 * `InStock` availability for something with no checkout — every package is an
 * enquiry, quoted per trip. That mismatch is exactly what Google's merchant
 * cross-validation looks for. TouristTrip describes the same thing accurately,
 * carries the same Offer, and drops out of both reports.
 *
 * TouristTrip has no rich result in Google Search. Neither did this page in
 * practice: a Product snippet needs a rating to render, and we have none.
 */
export function packageSchema(p: Package) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: p.name,
    // The Offer price is a bare number with no unit, so the basis (per person vs
    // per couple) is stated here or it is simply lost. Honeymoon Vibes is priced
    // per couple, and reading it as per-person would understate it by half.
    description: `${p.dur} Sri Lanka tour. From $${p.priceUSD.toLocaleString(
      "en-US"
    )} USD ${priceBasis(p)}. ${p.intro}`,
    image: abs(`/assets/img/lib/${p.hero}.jpg`),
    url: abs(`/packages/${p.slug}/`),
    provider: { "@id": `${SITEURL}/#organization` },
    // The visible "Tour Highlights" list, in the order the page renders it.
    itinerary: {
      "@type": "ItemList",
      numberOfItems: p.attractions.length,
      itemListElement: p.attractions.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "TouristAttraction", name: a },
      })),
    },
    offers: {
      "@type": "Offer",
      price: p.priceUSD,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: abs(`/packages/${p.slug}/`),
      seller: { "@id": `${SITEURL}/#organization` },
      // Machine-readable form of the same per-person / per-couple basis spelled
      // out in the description above.
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.priceUSD,
        priceCurrency: "USD",
        referenceQuantity: {
          "@type": "QuantitativeValue",
          value: p.priceUnit === "couple" ? 2 : 1,
          unitCode: "IE", // UN/CEFACT: person
          unitText: "person",
        },
      },
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
