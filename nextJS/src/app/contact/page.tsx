import type { Metadata } from "next";
import ReactDOM from "react-dom";
import Link from "next/link";
import Ic from "@/components/Ic";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import { img } from "@/data/content";
import { dims } from "@/data/image-dims";
import { breadcrumbSchema } from "@/lib/schema";
import { BRAND, PHONE, PHONE_RAW, EMAIL, ADDRESS, waLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SL Journey for customised Sri Lanka travel packages. Our experts are ready to plan your dream holiday.",
  alternates: { canonical: "/contact/" },
  openGraph: { url: "/contact/", images: ["/assets/img/lib/harbor-dusk.jpg"] },
};

export default function Contact() {
  ReactDOM.preload(img("harbor-dusk"), { as: "image", fetchPriority: "high" });

  return (
    <main id="main">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact/" },
        ])}
      />
      <section className="subhero" style={{ minHeight: "48vh" }}>
        <div className="subhero__bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img("harbor-dusk")}
            alt={`Contact ${BRAND}`}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={dims("harbor-dusk")[0]}
            height={dims("harbor-dusk")[1]}
          />
        </div>
        <div className="container subhero__inner">
          <div className="crumb"><Link href="/">Home</Link> &nbsp;/&nbsp; Contact</div>
          <h1>Let&apos;s plan your<br />Sri Lanka story</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pkg-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "clamp(32px,5vw,64px)", alignItems: "start" }}>
            <div data-reveal="left">
              <span className="eyebrow">Get in Touch</span>
              <h2 style={{ marginTop: 16 }}>We&apos;d love to hear from you</h2>
              <p className="lead" style={{ marginTop: 16 }}>Get in touch with {BRAND} for customised Sri Lanka travel packages. Our experts are ready to help you plan your dream holiday — contact us today for a truly personalised experience.</p>
              <div className="contact-list">
                <div className="contact-item"><span className="ic"><Ic name="phone" /></span><div><div className="lbl">Phone</div><a href={`tel:${PHONE_RAW}`}>{PHONE}</a></div></div>
                <div className="contact-item"><span className="ic"><Ic name="whatsapp" /></span><div><div className="lbl">WhatsApp</div><a href={waLink()} target="_blank" rel="noopener noreferrer">{PHONE}</a></div></div>
                <div className="contact-item"><span className="ic"><Ic name="mail" /></span><div><div className="lbl">Email</div><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div></div>
                <div className="contact-item"><span className="ic"><Ic name="pin" /></span><div><div className="lbl">Address</div><p>{ADDRESS}</p></div></div>
              </div>
              <div style={{ marginTop: 28 }}>
                <a className="btn btn--primary btn--lg" href={waLink()} target="_blank" rel="noopener noreferrer"><Ic name="whatsapp" /> Chat on WhatsApp</a>
              </div>
            </div>
            <div data-reveal="right">
              <EnquiryForm heading="General enquiry from SL Journey website" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
