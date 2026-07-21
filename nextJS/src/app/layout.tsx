import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteEffects from "@/components/SiteEffects";
import JsonLd from "@/components/JsonLd";
import { travelAgencySchema } from "@/lib/schema";
import { BRAND, TAGLINE, SITEURL, GOOGLE_SITE_VERIFICATION } from "@/data/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITEURL),
  title: {
    default: `${BRAND} - ${TAGLINE}`,
    template: `%s - ${BRAND}`,
  },
  description:
    "SL Journey crafts tailor-made Sri Lanka tours — hill country, culture, wildlife, beaches and honeymoons. Expert local guides, 5-star rated, fully personalised.",
  // Paths carry a trailing slash to match trailingSlash: true. Without it every
  // canonical would point at a URL that redirects to the one actually served.
  alternates: { canonical: "/" },
  // Only rendered when a value is set, so an empty string emits no tag.
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  openGraph: {
    title: `${BRAND} - ${TAGLINE}`,
    description: "Tailor-made Sri Lanka journeys, crafted with local soul.",
    type: "website",
    url: "/",
    siteName: BRAND,
    images: ["/assets/img/lib/sigiriya.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1d3a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <noscript>
          <style>{`[data-reveal],[data-stagger]>*{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">Skip to content</a>
        {/* Sitewide so that the provider/seller/publisher @id references emitted
            by the TouristTrip and BlogPosting schemas resolve on the page
            carrying them. */}
        <JsonLd data={travelAgencySchema()} />
        <Header />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
