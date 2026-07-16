import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/cards";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { BRAND, EMAIL, ADDRESS, PHONE, PHONE_RAW } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND} collects, uses and stores the information you send through our enquiry form, and how to have it deleted.`,
  alternates: { canonical: "/privacy/" },
  openGraph: { url: "/privacy/", images: ["/assets/img/lib/hill-lake.jpg"] },
};

// TODO: confirm before publishing — (a) how long enquiries are kept (the 24-month
// figure below is a stated commitment, not something the code enforces), and
// (b) whether a business registration number should be named here.

export default function Privacy() {
  return (
    <main id="main">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy/" },
        ])}
      />

      <section className="subhero" style={{ minHeight: "38vh" }}>
        <div className="container subhero__inner">
          <div className="crumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Privacy Policy</div>
          <h1>Privacy Policy</h1>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>
          <article className="article" data-reveal>
            <p className="lead">
              This policy explains exactly what {BRAND} does with the information you
              give us. We are a small tour operator, not an advertising business: we
              collect what we need to quote your trip, and nothing else.
            </p>

            <h2>Who we are</h2>
            <p>
              {BRAND}, {ADDRESS}. We are the data controller for the information
              described here. You can reach us at{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or{" "}
              <a href={`tel:${PHONE_RAW}`}>{PHONE}</a>.
            </p>

            <h2>What we collect</h2>
            <p>
              Only what you type into the enquiry form on this site. That form has
              these fields:
            </p>
            <ul className="dash">
              <li><b>Your name and email address</b> — required, so we can reply to you.</li>
              <li><b>Phone / WhatsApp number and nationality</b> — optional; the phone number lets us reply on WhatsApp, and nationality helps us advise on visas and pricing.</li>
              <li><b>Arrival and departure dates, number of adults and children</b> — optional; used to check availability and quote.</li>
              <li><b>Accommodation type, meal basis and tour package</b> — optional; your preferences.</li>
              <li><b>Your message</b> — whatever you choose to tell us.</li>
            </ul>
            <p>
              There is no account to create, no newsletter sign-up, and no payment
              details are ever taken on this website. Please do not send passport
              numbers or card details through the enquiry form.
            </p>

            <h2>Where it goes</h2>
            <p>
              When you submit the form, your enquiry is sent to us in two ways so a
              lead is never silently lost:
            </p>
            <ul className="dash">
              <li><b>By email</b> — delivered to <a href={`mailto:${EMAIL}`}>{EMAIL}</a> through Web3Forms, a form-delivery service that passes the message on to our inbox.</li>
              <li><b>By WhatsApp</b> — your browser opens WhatsApp with the same details pre-filled. Nothing is sent until you press send in WhatsApp, and that message is then handled by WhatsApp under their own privacy terms.</li>
            </ul>
            <p>
              From there your enquiry lives in our email inbox and, if you message us,
              our WhatsApp. It is read by the people who plan your trip. If you book,
              we pass on only what a supplier needs — for example your name and dates
              to a hotel, or your name to a driver or guide.
            </p>

            <h2>What we never do</h2>
            <p>
              We do not sell, rent or trade your information. We do not share it with
              advertisers or data brokers, we do not use it to build a profile of you,
              and we do not add you to a marketing list because you asked for a quote.
            </p>

            <h2>Cookies and third parties</h2>
            <p>
              This site sets no advertising or analytics cookies. There is no Google
              Analytics, no advertising pixel, and no tracking of your visit.
            </p>
            <ul className="dash">
              <li><b>Language switcher</b> — if you pick a language other than English, the Google Translate widget stores a <code>googtrans</code> cookie in your browser to remember that choice, and loads Google&apos;s translation script. If you never change the language, it is not set.</li>
              <li><b>Fonts</b> — served from this site, not from Google&apos;s servers, so viewing a page makes no request to Google for fonts.</li>
              <li><b>Hosting</b> — the site is served by GitHub Pages, which like any web host processes your IP address in its server logs to deliver the page.</li>
            </ul>

            <h2>How long we keep it</h2>
            <p>
              Enquiries that do not turn into a booking are kept for up to 24 months,
              so we can pick up the conversation if you come back to us, and then
              deleted. If you travel with us, we keep your booking record for as long
              as Sri Lankan tax and accounting rules require.
            </p>

            <h2>Your rights</h2>
            <p>
              You can ask us for a copy of what we hold about you, ask us to correct
              it, or ask us to delete it. Email{" "}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and we will action it within 30
              days. You do not need to give a reason to be deleted, and asking costs
              you nothing.
            </p>
            <p>
              If you are in the UK or EU, the GDPR gives you these rights and also the
              right to complain to your national data protection authority. Our legal
              basis for handling your enquiry is your request for a quote — that is,
              taking steps at your request before entering into a contract.
            </p>

            <h2>Changes</h2>
            <p>
              If this policy changes we will update this page. It was last reviewed in
              July 2026.
            </p>
          </article>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
