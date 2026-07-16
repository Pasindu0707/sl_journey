import ReactDOM from "react-dom";
import Link from "next/link";
import Ic from "@/components/Ic";
import {
  FeatureCards, PackageCards, ExperienceCards, DestinationCards, ReviewCards, BlogCards, CtaBand, Stars,
} from "@/components/cards";
import { img } from "@/data/content";
import { dims } from "@/data/image-dims";
import { BRAND, TRIPADVISOR, waLink } from "@/data/site";

const MARQUEE = ["Sigiriya", "Kandy", "Ella", "Yala Safari", "Galle Fort", "Mirissa", "Nuwara Eliya", "Anuradhapura"];

export default function Home() {
  // The hero is the LCP element. Preloading starts the fetch from the HTML,
  // before the parser reaches the <img>.
  ReactDOM.preload(img("sigiriya"), { as: "image", fetchPriority: "high" });

  return (
    <main id="main">
      <section className="hero">
        <div className="hero__bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img("sigiriya")}
            alt="Sigiriya rock fortress at sunset, Sri Lanka"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={dims("sigiriya")[0]}
            height={dims("sigiriya")[1]}
          />
        </div>
        <div className="container hero__inner">
          <span className="eyebrow" style={{ color: "var(--gold-400)" }}>Explore the Soul of Sri Lanka</span>
          <h1 style={{ marginTop: 20 }}>Discover the <em>real</em><br />Sri Lanka, your way</h1>
          <p className="hero__sub">From misty tea hills and ancient cities to leopard safaris and golden southern beaches — we design private, unforgettable journeys across the island.</p>
          <div className="hero__cta">
            <Link className="btn btn--primary btn--lg" href="/#packages">Explore Packages</Link>
            <a className="btn btn--light btn--lg" href={waLink()} target="_blank" rel="noopener noreferrer"><Ic name="whatsapp" /> Plan via WhatsApp</a>
          </div>
          <div className="hero__trust">
            <span className="hero__stars"><Stars /></span>
            {/* Links out to the real profile rather than being marked up as
                aggregateRating: self-serving review schema on your own
                organisation is ignored by Google and risks a manual action.
                TODO: set TRIPADVISOR in site.ts — until then this stays plain
                text, because a guessed profile URL would point at a stranger. */}
            <span>
              Rated <b style={{ color: "#fff" }}>Excellent</b> on{" "}
              {TRIPADVISOR ? (
                <a href={TRIPADVISOR} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                  Tripadvisor
                </a>
              ) : (
                "Tripadvisor"
              )}{" "}
              &middot; Tailor-made by local experts
            </span>
          </div>
        </div>
        <div className="hero__scroll"><span>Scroll</span><span className="mouse" /></div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="split">
            <div className="split__media" data-reveal="left">
              <div className="accent-dot" />
              <div className="frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img("ella-ninearch")} alt="Scenic train crossing the Nine Arch Bridge in Ella" loading="lazy" />
              </div>
              <div className="badge badge--br"><span className="num">5.0</span><span className="lbl">Traveller rating</span></div>
            </div>
            <div data-reveal="right">
              <span className="eyebrow">Sri Lanka&apos;s Trusted Travel Designers</span>
              <h2 style={{ marginTop: 18 }}>Unforgettable journeys, crafted with local soul</h2>
              <p className="lead" style={{ marginTop: 18 }}>At {BRAND}, we create unforgettable travel experiences across the breathtaking island of Sri Lanka. With deep local expertise and a genuine passion for hospitality, we design personalised tour packages that bring you closer to the island&apos;s rich culture, stunning landscapes and hidden treasures.</p>
              <p style={{ marginTop: 16 }}>Whether you seek adventure, relaxation or cultural discovery, we make sure every journey is seamless, safe and truly memorable.</p>
              <div className="stats">
                <div className="stat"><div className="num" data-count="4">4</div><div className="lbl">Signature Journeys</div></div>
                <div className="stat"><div className="num"><span data-count="100" data-suffix="%">100%</span></div><div className="lbl">Tailor-Made</div></div>
                <div className="stat"><div className="num"><span data-count="24" data-suffix="/7">24/7</span></div><div className="lbl">On-Trip Support</div></div>
              </div>
              <div style={{ marginTop: 30 }}><Link className="btn btn--navy" href="/about">Learn More About Us <Ic name="arrow" /></Link></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--cream2">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow center">Why Travel With Us</span>
            <h2>The {BRAND} difference</h2>
            <p>Four promises behind every itinerary we design.</p>
          </div>
          <div className="grid cols-4" data-stagger="100"><FeatureCards /></div>
        </div>
      </section>

      <section className="section" id="packages">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow center">Choose Your Adventure</span>
            <h2>Popular Tour Packages</h2>
            <p>Carefully curated routes covering the very best of the island — each fully customisable to you.</p>
          </div>
          <div className="grid cols-4"><PackageCards /></div>
        </div>
      </section>

      <section className="section section--navy">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow center">Find Your Perfect Experience</span>
            <h2 style={{ color: "#fff" }}>Things to do in Sri Lanka</h2>
            <p>An island packed into one — wildlife, heritage, mountains and ocean, all within a few hours&apos; drive.</p>
          </div>
          <div className="grid cols-4" data-stagger="80"><ExperienceCards /></div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow center">Prime Destinations</span>
            <h2>Authentic experiences, iconic places</h2>
            <p>The places that capture the soul of Sri Lanka.</p>
          </div>
          <div className="grid cols-4" data-stagger="70"><DestinationCards /></div>
        </div>
      </section>

      <section className="section section--navy">
        <div className="container">
          <div className="reviews-head">
            <div data-reveal="left">
              <span className="eyebrow center" style={{ justifyContent: "flex-start" }}>Loved by Travellers</span>
              <h2 style={{ color: "#fff", marginTop: 14 }}>Stories from the road</h2>
            </div>
            <div className="trust-badge" data-reveal="right">
              <div className="score">Excellent</div>
              <div>
                <div className="stars"><Stars /></div>
                <div className="meta">Based on real reviews &middot; Posted on Tripadvisor</div>
              </div>
            </div>
          </div>
          <div className="grid cols-3"><ReviewCards /></div>
        </div>
      </section>

      <section className="section section--cream2">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow center">Travel Stories &amp; Guides</span>
            <h2>From our journal</h2>
            <p>Tips, tastes and inspiration for your Sri Lankan adventure.</p>
          </div>
          <div className="grid cols-4"><BlogCards /></div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
