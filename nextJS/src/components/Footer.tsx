import Link from "next/link";
import {
  BRAND, TAGLINE, ADDRESS, PHONE, PHONE_RAW, EMAIL, FACEBOOK, INSTAGRAM,
  TRIPADVISOR, waLink, asset,
} from "@/data/site";
import { PACKAGES } from "@/data/content";
import Ic from "./Ic";

export default function Footer() {
  const quick: [string, string][] = [
    ["Home", "/"], ["About Us", "/about"], ["Tour Packages", "/#packages"],
    ["Blog", "/blog"], ["Gallery", "/gallery"], ["Contact Us", "/contact"],
  ];

  // Only profiles with a real URL are rendered. A dead href="#" icon costs trust
  // and, once it reaches sameAs, tells search engines something untrue.
  // TODO: set INSTAGRAM / FACEBOOK / TRIPADVISOR in site.ts to light these up.
  const socials: [string, string, string][] = [
    [INSTAGRAM, "Instagram", "instagram"],
    [FACEBOOK, "Facebook", "facebook"],
    [TRIPADVISOR, "Tripadvisor", "star"],
  ];
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <div className="wm notranslate" translate="no">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/assets/logo/logo-mark-white.png")} alt="" width={132} height={137} /> {BRAND}
              </div>
              <p>
                We craft unforgettable, tailor-made journeys across Sri Lanka - blending
                culture, wildlife, hill country and golden coastlines with the warmth of
                true local hospitality.
              </p>
              <p className="tag">{TAGLINE}</p>
            </div>

            <div>
              <h4>Quick Links</h4>
              <div className="footer__links">
                {quick.map(([l, h]) => (
                  <Link key={l} href={h}>{l}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4>Tour Packages</h4>
              <div className="footer__links">
                {PACKAGES.map((p) => (
                  <Link key={p.slug} href={`/packages/${p.slug}`}>{p.name}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4>Get in Touch</h4>
              <ul className="footer__contact">
                <li><Ic name="pin" /><span>{ADDRESS}</span></li>
                <li><Ic name="phone" /><a href={`tel:${PHONE_RAW}`}>{PHONE}</a></li>
                <li><Ic name="mail" /><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              </ul>
              <div className="footer__social" style={{ marginTop: 18 }}>
                <a href={waLink()} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><Ic name="whatsapp" /></a>
                {socials
                  .filter(([url]) => url)
                  .map(([url, label, icon]) => (
                    <a key={label} href={url} aria-label={label} target="_blank" rel="noopener noreferrer">
                      <Ic name={icon} />
                    </a>
                  ))}
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <span>&copy; {new Date().getFullYear()} {BRAND}. All rights reserved.</span>
            <span className="footer__legal">
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms &amp; Conditions</Link>
            </span>
            <span>{TAGLINE}</span>
          </div>
        </div>
      </footer>

      <a className="wa-float" href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <Ic name="whatsapp" />
      </a>
      <div id="google_translate_element" />
    </>
  );
}
