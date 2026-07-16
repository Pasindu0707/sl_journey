import type { Metadata } from "next";
import Link from "next/link";
import Ic from "@/components/Ic";
import { FeatureCards, CtaBand } from "@/components/cards";
import { img } from "@/data/content";
import { BRAND } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet SL Journey — passionate Sri Lankan travel designers crafting personalised, seamless and safe journeys across the island.",
  openGraph: { images: ["/assets/img/lib/safari-jeep.jpg"] },
};

export default function About() {
  return (
    <main id="main">
      <section className="subhero">
        <div className="subhero__bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img("safari-jeep")} alt="Safari jeep tour in Sri Lanka" />
        </div>
        <div className="container subhero__inner">
          <div className="crumb"><Link href="/">Home</Link> &nbsp;/&nbsp; About Us</div>
          <h1>The soul behind<br />your journey</h1>
          <span className="pill">Explore the Soul of Sri Lanka</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split__media" data-reveal="left">
              <div className="accent-dot" />
              <div className="frame frame--wide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img("river-safari")} alt="Travellers on a river safari in Sri Lanka" loading="lazy" />
              </div>
              <div className="badge badge--br"><span className="num">Local</span><span className="lbl">Born &amp; raised guides</span></div>
            </div>
            <div data-reveal="right">
              <span className="eyebrow">Who We Are</span>
              <h2 style={{ marginTop: 18 }}>Sri Lanka&apos;s leading travel designers</h2>
              <p className="lead" style={{ marginTop: 18 }}>At {BRAND}, we create unforgettable travel experiences across the breathtaking island of Sri Lanka. With our local expertise and passion for hospitality, we design personalised tour packages that bring you closer to the island&apos;s rich culture, stunning landscapes and hidden treasures.</p>
              <p style={{ marginTop: 16 }}>Whether you&apos;re looking for adventure, relaxation or cultural discovery, we ensure your journey is seamless, safe and truly memorable. From the first message to your final farewell at the airport, you travel with people who know — and love — every corner of this island.</p>
              <div style={{ marginTop: 28 }}><Link className="btn btn--primary" href="/contact">Start Planning <Ic name="arrow" /></Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream2">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow center">What We Stand For</span>
            <h2>Promises behind every journey</h2>
          </div>
          <div className="grid cols-4" data-stagger="100"><FeatureCards /></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split split--reverse">
            <div className="split__media" data-reveal="right">
              <div className="frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img("train-ella")} alt="Scenic hill country train, Sri Lanka" loading="lazy" />
              </div>
            </div>
            <div data-reveal="left">
              <span className="eyebrow">Our Approach</span>
              <h2 style={{ marginTop: 18 }}>No two travellers are the same</h2>
              <p className="lead" style={{ marginTop: 18 }}>That&apos;s why no two {BRAND} itineraries are either. We listen first, then design around your pace, your interests and your budget.</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16, marginTop: 22 }}>
                <li className="ck-row"><span className="ck-ic"><Ic name="check" /></span><span><b>Personal from day one</b> — a dedicated trip designer, not a call centre.</span></li>
                <li className="ck-row"><span className="ck-ic"><Ic name="check" /></span><span><b>Honest local knowledge</b> — the right places, at the right time, away from the crowds.</span></li>
                <li className="ck-row"><span className="ck-ic"><Ic name="check" /></span><span><b>Seamless on the ground</b> — trusted drivers, hand-picked stays and 24/7 support.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
