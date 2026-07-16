import type { Metadata } from "next";
import ReactDOM from "react-dom";
import Link from "next/link";
import { BlogCards, CtaBand } from "@/components/cards";
import { img } from "@/data/content";
import { dims } from "@/data/image-dims";

export const metadata: Metadata = {
  title: "Travel Blog",
  description:
    "Travel stories and guides for Sri Lanka: best time to visit, local cuisine, top things to do and more from SL Journey.",
  alternates: { canonical: "/blog/" },
  openGraph: { url: "/blog/", images: ["/assets/img/lib/cuisine.jpg"] },
};

export default function BlogIndex() {
  ReactDOM.preload(img("ella-ninearch"), { as: "image", fetchPriority: "high" });

  return (
    <main id="main">
      <section className="subhero" style={{ minHeight: "50vh" }}>
        <div className="subhero__bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img("ella-ninearch")}
            alt="Sri Lanka travel inspiration"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={dims("ella-ninearch")[0]}
            height={dims("ella-ninearch")[1]}
          />
        </div>
        <div className="container subhero__inner">
          <div className="crumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Blog</div>
          <h1>Travel Stories &amp; Guides</h1>
          <span className="pill">Inspiration for your island adventure</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid cols-2"><BlogCards /></div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
