import Link from "next/link";
import Ic from "@/components/Ic";

export default function NotFound() {
  return (
    <main id="main">
      <section className="section" style={{ minHeight: "70vh", display: "grid", placeItems: "center", textAlign: "center", paddingTop: 160 }}>
        <div className="container" style={{ maxWidth: 620 }}>
          <span className="eyebrow center">Lost the trail?</span>
          <h1 style={{ marginTop: 18 }}>404 — Page not found</h1>
          <p className="lead" style={{ marginTop: 16 }}>
            The page you&apos;re looking for has wandered off the map. Let&apos;s get you back to the journey.
          </p>
          <div style={{ marginTop: 30, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link className="btn btn--primary btn--lg" href="/">Back to Home <Ic name="arrow" /></Link>
            <Link className="btn btn--ghost btn--lg" href="/#packages">View Tours</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
