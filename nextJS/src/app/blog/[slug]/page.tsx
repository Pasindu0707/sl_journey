import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Ic from "@/components/Ic";
import { CtaBand } from "@/components/cards";
import { BLOG, img, type Block } from "@/data/content";

export function generateStaticParams() {
  return BLOG.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const b = BLOG.find((x) => x.slug === params.slug);
  if (!b) return {};
  return {
    title: b.title,
    description: b.excerpt,
    openGraph: { images: [`/assets/img/lib/${b.img}.jpg`] },
  };
}

function renderBlock(block: Block, i: number) {
  switch (block.t) {
    case "p":
      return <p key={i}>{block.v}</p>;
    case "h2":
      return <h2 key={i}>{block.v}</h2>;
    case "quote":
      return <p className="pullquote" key={i}>{block.v}</p>;
    case "list":
      return (
        <ul className="dash" key={i}>
          {block.v.map(([t, d]) => (
            <li key={t}><b>{t}</b> — {d}</li>
          ))}
        </ul>
      );
  }
}

export default function Post({ params }: { params: { slug: string } }) {
  const b = BLOG.find((x) => x.slug === params.slug);
  if (!b) notFound();

  return (
    <main id="main">
      <section className="subhero" style={{ minHeight: "56vh" }}>
        <div className="subhero__bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(b.img)} alt={b.title} />
        </div>
        <div className="container subhero__inner">
          <div className="crumb"><Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/blog">Blog</Link></div>
          <h1 style={{ maxWidth: 820 }}>{b.title}</h1>
          <span className="pill">{b.dateLong}</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pkg-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "clamp(32px,5vw,64px)", alignItems: "start" }}>
            <article className="article" data-reveal>
              {b.body.map(renderBlock)}
              <div className="post-nav">
                {b.prev && (
                  <Link className="prev" href={`/blog/${b.prev[0]}`}>
                    <span>&larr; Previous</span>
                    <b>{b.prev[1]}</b>
                  </Link>
                )}
                {b.next && (
                  <Link className="next" href={`/blog/${b.next[0]}`}>
                    <span>Next &rarr;</span>
                    <b>{b.next[1]}</b>
                  </Link>
                )}
              </div>
            </article>

            <aside className="book-aside" data-reveal="right">
              <div className="form-card">
                <span className="eyebrow">Recent Posts</span>
                <div style={{ marginTop: 18 }}>
                  {BLOG.map((x) => (
                    <Link key={x.slug} href={`/blog/${x.slug}`} className="link-arrow" style={{ display: "block", marginBottom: 12 }}>
                      {x.title}
                    </Link>
                  ))}
                </div>
                <div style={{ marginTop: 24, paddingTop: 22, borderTop: "1px solid var(--line)" }}>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: 8 }}>Ready to go?</h3>
                  <p style={{ fontSize: ".92rem", marginBottom: 16 }}>Let us turn this inspiration into your own tailor-made journey.</p>
                  <Link className="btn btn--primary" href="/contact" style={{ width: "100%" }}>Plan Your Trip <Ic name="arrow" /></Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
