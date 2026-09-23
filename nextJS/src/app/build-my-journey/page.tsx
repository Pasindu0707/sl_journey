import type { Metadata } from "next";
import ReactDOM from "react-dom";
import JourneyBuilder from "@/components/JourneyBuilder";
import JsonLd from "@/components/JsonLd";
import { img } from "@/data/content";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Build My Journey - Custom Sri Lanka Itinerary Planner",
  description:
    "Don't choose a package, build your journey. Answer four quick questions and get a personalised day-by-day Sri Lanka itinerary, then send it to our local experts on WhatsApp.",
  alternates: { canonical: "/build-my-journey/" },
  openGraph: {
    title: "Build My Journey - SL Journey",
    description: "Design your own Sri Lanka itinerary in under a minute.",
    url: "/build-my-journey/",
    images: ["/assets/img/lib/sigiriya.jpg"],
  },
};

export default function BuildMyJourney() {
  ReactDOM.preload(img("sigiriya"), { as: "image", fetchPriority: "high" });

  return (
    <main id="main">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Build My Journey", path: "/build-my-journey/" },
        ])}
      />
      <JourneyBuilder />
    </main>
  );
}
