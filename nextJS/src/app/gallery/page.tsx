import type { Metadata } from "next";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import { CtaBand } from "@/components/cards";
import { img } from "@/data/content";

export const metadata: Metadata = {
  title: "Gallery — Travel Moments",
  description:
    "A gallery of travel moments from across Sri Lanka — wildlife, heritage, hill country and golden coastlines, captured with SL Journeys.",
  openGraph: { images: ["/assets/img/lib/sigiriya.jpg"] },
};

export default function GalleryPage() {
  return (
    <main id="main">
      <section className="subhero" style={{ minHeight: "50vh" }}>
        <div className="subhero__bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("beach-boats")} alt="Sri Lanka travel gallery" />
        </div>
        <div className="container subhero__inner">
          <div className="crumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Gallery</div>
          <h1>Travel Moments</h1>
          <span className="pill">Tap any image to explore</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Gallery />
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
