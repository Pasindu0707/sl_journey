import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Ic from "@/components/Ic";
import EnquiryForm from "@/components/EnquiryForm";
import { CtaBand } from "@/components/cards";
import { PACKAGES, img } from "@/data/content";
import { waLink } from "@/data/site";

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = PACKAGES.find((x) => x.slug === params.slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.dur}`,
    description: p.intro.slice(0, 155),
    openGraph: { images: [`/assets/img/lib/${p.hero}.jpg`] },
  };
}

export default function PackagePage({ params }: { params: { slug: string } }) {
  const p = PACKAGES.find((x) => x.slug === params.slug);
  if (!p) notFound();

  return (
    <main id="main">
      <section className="subhero">
        <div className="subhero__bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(p.hero)} alt={p.name} />
        </div>
        <div className="container subhero__inner">
          <div className="crumb">
            <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/#packages">Tour Packages</Link> &nbsp;/&nbsp; {p.name}
          </div>
          <h1>{p.name}</h1>
          <div className="pkg-meta">
            <span className="chip"><Ic name="clock" /> {p.dur}</span>
            <span className="chip"><Ic name="pin" /> {p.attractions.length} Destinations</span>
            <span className="chip"><Ic name="calendar" /> {p.price}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pkg-detail-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "clamp(32px,5vw,64px)", alignItems: "start" }}>
            <div data-reveal>
              <span className="eyebrow">Tour Overview</span>
              <h2 style={{ marginTop: 16 }}>{p.name}</h2>
              <p className="lead" style={{ marginTop: 18 }}>{p.intro}</p>

              <h3 style={{ margin: "42px 0 6px" }}>Tour Highlights</h3>
              <p style={{ marginBottom: 22 }}>Every experience below is included and fully customisable to your pace.</p>
              <div className="attractions" data-stagger="40">
                {p.attractions.map((a, i) => (
                  <div className="attr" key={a}>
                    <span className="n">{i + 1}</span>
                    <span>{a}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 38, display: "flex", gap: 14, flexWrap: "wrap" }}>
                <a className="btn btn--primary" href={waLink(`Hi SL Journey! I'm interested in the ${p.name} tour (${p.dur}).`)} target="_blank" rel="noopener noreferrer">
                  <Ic name="whatsapp" /> Ask About This Tour
                </a>
                <Link className="btn btn--ghost" href="/#packages">View Other Tours</Link>
              </div>
            </div>

            <aside className="book-aside" data-reveal="right">
              <div style={{ marginBottom: 14 }}><span className="eyebrow">Book Your Tour</span></div>
              <EnquiryForm
                heading={`Booking enquiry — ${p.name} (${p.dur})`}
                defaultPackage={p.name}
              />
            </aside>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
