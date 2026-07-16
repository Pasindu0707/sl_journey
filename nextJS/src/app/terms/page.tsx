import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cards";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { BRAND, EMAIL, ADDRESS, PHONE, PHONE_RAW } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply to enquiries, quotes and bookings made with ${BRAND}.`,
  alternates: { canonical: "/terms/" },
  openGraph: { url: "/terms/", images: ["/assets/img/lib/galle-light.jpg"] },
};

// TODO: these terms describe how the business actually operates and must be
// confirmed before publishing. I have deliberately NOT invented:
//   - deposit amount and balance due date
//   - the cancellation / refund schedule
//   - business registration number and Sri Lanka Tourism licence number
//   - whether you carry public liability insurance
// Each is marked in the copy below. Send me the real figures and I will drop
// them in; until then this page states that terms are confirmed in writing per
// booking, which is true and commits you to nothing false.

export default function Terms() {
  return (
    <main id="main">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms/" },
        ])}
      />

      <section className="subhero" style={{ minHeight: "38vh" }}>
        <div className="container subhero__inner">
          <div className="crumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Terms &amp; Conditions</div>
          <h1>Terms &amp; Conditions</h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <article className="article" data-reveal>
            <p className="lead">
              These terms cover your use of this website and the enquiries and quotes
              that come from it. The specific terms of any trip are confirmed in
              writing when you book.
            </p>

            <h2>Who you are dealing with</h2>
            <p>
              {BRAND}, {ADDRESS}. Contact{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or{" "}
              <a href={`tel:${PHONE_RAW}`}>{PHONE}</a>. We arrange private,
              tailor-made tours in Sri Lanka.
            </p>

            <h2>Prices and quotes</h2>
            <p>
              Prices shown on this site are <b>starting from</b> figures in US
              dollars, given per person on a shared basis unless the package says
              otherwise — Honeymoon Vibes is priced per couple. They indicate what a
              trip typically starts at; they are not an offer and are not guaranteed.
            </p>
            <p>
              Your actual price depends on your dates, group size, accommodation
              class, meal basis and what is available when you book. Peak season,
              public holidays and festival dates cost more. The price that binds us is
              the one in your written quote, and it holds for the validity period
              stated in that quote.
            </p>
            <p>
              Unless your quote says otherwise, prices exclude international flights,
              visa fees, travel insurance, tips, and anything personal.
            </p>

            <h2>Enquiries and bookings</h2>
            <p>
              Sending the enquiry form costs nothing and commits you to nothing. It is
              a request for a quote, not a booking. A booking exists only once we have
              confirmed it to you in writing and you have paid the deposit set out in
              your quote.
            </p>
            <p>
              {/* TODO: replace with the real deposit % and balance due date. */}
              Deposit and balance terms are stated in your written quote and
              confirmation.
            </p>

            <h2>Changes and cancellations</h2>
            <p>
              {/* TODO: replace with the real cancellation schedule. */}
              If you need to change or cancel, tell us as early as you can and we will
              do what we can. The cancellation terms and any charges that apply are
              those set out in your written booking confirmation, which follow the
              terms of the hotels and suppliers held for you.
            </p>
            <p>
              We may occasionally need to alter an itinerary — weather, road
              conditions, wildlife park closures, safety, or a supplier failing. Where
              that happens we will offer the nearest equivalent we can arrange. We do
              not promise to see a specific wild animal, and a leopard sighting is
              never guaranteed.
            </p>

            <h2>Travel insurance</h2>
            <p>
              You must hold your own travel insurance covering medical treatment,
              repatriation, cancellation and your belongings, for the whole of your
              trip. We strongly recommend it covers any adventure activity you plan to
              do with us, such as white-water rafting, surfing, diving or hiking.
            </p>

            <h2>Your responsibilities</h2>
            <ul className="dash">
              <li>Holding a passport valid for your trip and obtaining the correct visa or ETA for Sri Lanka.</li>
              <li>Meeting any health or vaccination requirements that apply to you.</li>
              <li>Telling us before you book about any medical condition, mobility need, allergy or dietary requirement that affects your trip.</li>
              <li>Behaving in a way that is safe and respectful of local customs, religious sites and wildlife.</li>
            </ul>

            <h2>Our liability</h2>
            <p>
              We arrange your trip with care and use suppliers we trust. We are
              responsible for arranging the services described in your confirmation.
              We are not responsible for events outside our reasonable control —
              weather, natural events, strikes, civil unrest, epidemics, flight delays
              or cancellations, or your own acts.
            </p>
            <p>
              Nothing in these terms limits our liability for death or personal injury
              caused by our negligence, or for fraud.
            </p>

            <h2>This website</h2>
            <p>
              We keep the content here as accurate as we can, but itineraries,
              attractions and prices change. The text, photographs and branding on this
              site belong to {BRAND} and may not be reproduced commercially without our
              permission. Reviews quoted on this site are the words of the travellers
              who wrote them.
            </p>

            <h2>Governing law</h2>
            <p>
              These terms are governed by the law of Sri Lanka, and the courts of Sri
              Lanka have jurisdiction. If you are a consumer in the UK or EU, this does
              not remove protections you have under the law of your own country.
            </p>

            <h2>Questions</h2>
            <p>
              Anything here unclear? Email{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will explain it in plain
              language before you commit to anything. Last reviewed July 2026.
            </p>
          </article>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
