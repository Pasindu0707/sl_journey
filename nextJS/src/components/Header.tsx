"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BRAND, PHONE, PHONE_RAW, TAGLINE, EMAIL, asset } from "@/data/site";
import { PACKAGES } from "@/data/content";
import LanguageSwitcher from "./LanguageSwitcher";

const NAV: [string, string][] = [
  ["Home", "/"],
  ["About", "/about"],
  ["Blog", "/blog"],
  ["Gallery", "/gallery"],
  ["Contact", "/contact"],
];

export default function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  // transparent over hero -> solid on scroll
  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".hero, .subhero") as HTMLElement | null;
      const threshold = hero
        ? Math.min(hero.offsetHeight - 90, window.innerHeight * 0.7)
        : 40;
      setSolid(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // lock scroll while mobile menu open; close on route change
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);
  useEffect(() => setMenu(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={"header" + (solid ? " is-solid" : "")}>
        <div className="container header__inner">
          <Link className="header__logo" href="/" aria-label={`${BRAND} — home`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* Intrinsic size of the asset (503x138). CSS sizes it to 46px tall;
                these are here so the browser reserves the right box before the
                image lands, rather than shifting the header on load. */}
            <img className="logo-light" src={asset("/assets/logo/logo-horizontal-white.png")} alt={BRAND} width={503} height={138} />
            <img className="logo-dark" src={asset("/assets/logo/logo-horizontal-trans.png")} alt={BRAND} width={503} height={138} />
          </Link>

          <ul className="header__nav">
            <li><Link href="/" className={isActive("/") ? "is-active" : ""}>Home</Link></li>
            <li><Link href="/about" className={isActive("/about") ? "is-active" : ""}>About</Link></li>
            <li className="has-drop">
              <Link href="/#packages">Tour Packages<i className="caret" /></Link>
              <div className="drop">
                {PACKAGES.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/packages/${p.slug}`}
                    // The dropdown is held open by CSS :hover OR :focus-within.
                    // Clicking a package navigates client-side, so the link keeps
                    // DOM focus and :focus-within stays true — the menu was still
                    // hanging open over the page you just landed on. Dropping
                    // focus closes it the moment the pointer leaves.
                    onClick={(e) => e.currentTarget.blur()}
                  >
                    {p.name}
                    <small>{p.days}</small>
                  </Link>
                ))}
              </div>
            </li>
            <li><Link href="/blog" className={isActive("/blog") ? "is-active" : ""}>Blog</Link></li>
            <li><Link href="/gallery" className={isActive("/gallery") ? "is-active" : ""}>Gallery</Link></li>
            <li><Link href="/contact" className={isActive("/contact") ? "is-active" : ""}>Contact</Link></li>
          </ul>

          <div className="header__actions">
            <LanguageSwitcher />
            <Link className="header__cta" href="/contact">Plan Your Trip</Link>
          </div>

          <button
            className={"burger" + (menu ? " is-open" : "")}
            aria-label="Open menu"
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <nav className={"mobile-nav" + (menu ? " is-open" : "")}>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        {PACKAGES.map((p) => (
          <Link key={p.slug} href={`/packages/${p.slug}`}>{p.name}</Link>
        ))}
        <Link href="/blog">Blog</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/contact">Contact</Link>
        <button
          className="m-lang notranslate"
          translate="no"
          onClick={() => {
            setMenu(false);
            setTimeout(() => window.dispatchEvent(new Event("open-lang")), 350);
          }}
        >
          {/* globe icon via CSS-sized svg */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" /></svg>
          Language
        </button>
        <div className="m-contact">
          {TAGLINE} &middot; <a href={`tel:${PHONE_RAW}`}>{PHONE}</a>
          <br />
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </div>
      </nav>
    </>
  );
}
