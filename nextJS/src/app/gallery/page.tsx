import type { Metadata } from "next";
import ReactDOM from "react-dom";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import { CtaBand } from "@/components/cards";
import { img } from "@/data/content";
import { dims } from "@/data/image-dims";

export const metadata: Metadata = {
  title: "Gallery — Travel Moments",
  description:
    "A gallery of travel moments from across Sri Lanka — wildlife, heritage, hill country and golden coastlines, captured with SL Journey.",
  alternates: { canonical: "/gallery/" },
  openGraph: { url: "/gallery/", images: ["/assets/img/lib/sigiriya.jpg"] },
};

export default function GalleryPage() {
  ReactDOM.preload(img("beach-boats"), { as: "image", fetchPriority: "high" });

  return (
    <main id="main">
      <section className="subhero" style={{ minHeight: "50vh" }}>
        <div className="subhero__bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img("beach-boats")}
            alt="Sri Lanka travel gallery"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={dims("beach-boats")[0]}
            height={dims("beach-boats")[1]}
          />
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
