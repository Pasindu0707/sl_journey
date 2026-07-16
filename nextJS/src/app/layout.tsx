import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SiteEffects from "@/components/SiteEffects";
import { BRAND, TAGLINE, SITEURL } from "@/data/site";

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
    default: `${BRAND} — ${TAGLINE}`,
    template: `%s — ${BRAND}`,
  },
  description:
    "SL Journey crafts tailor-made Sri Lanka tours — hill country, culture, wildlife, beaches and honeymoons. Expert local guides, 5-star rated, fully personalised.",
  openGraph: {
    title: `${BRAND} — ${TAGLINE}`,
    description: "Tailor-made Sri Lanka journeys, crafted with local soul.",
    type: "website",
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
        <Header />
        {children}
        <Footer />
        <SiteEffects />
      </body>
    </html>
  );
}
