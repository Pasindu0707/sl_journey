"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LANGS, POPULAR, BY_CODE } from "@/data/languages";
import Ic from "./Ic";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

function setGoogTrans(code: string) {
  const val = !code || code === "en" ? "" : "/en/" + code;
  const expire = val ? "" : ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
  const host = location.hostname;
  const domains = [""];
  if (host) {
    domains.push(";domain=" + host);
    if (host.indexOf(".") >= 0) domains.push(";domain=." + host);
  }
  domains.forEach((d) => {
    document.cookie = "googtrans=" + val + ";path=/" + d + expire;
  });
}
function currentLang(): string {
  const m = (typeof document !== "undefined" ? document.cookie : "").match(/googtrans=\/[^/]*\/([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "en";
}
function shortCode(code: string) {
  if (code === "zh-CN") return "中";
  if (code === "zh-TW") return "繁";
  return code.split("-")[0].toUpperCase();
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cur, setCur] = useState("en");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // boot Google Translate widget + sync current language
  useEffect(() => {
    setCur(currentLang());

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };
    if (!document.getElementById("google-translate-script")) {
      const s = document.createElement("script");
      s.id = "google-translate-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      document.body.appendChild(s);
    }

    // keep Google's injected banner from shifting the layout
    const tidy = setInterval(() => {
      if (document.body.style.top && document.body.style.top !== "0px") document.body.style.top = "0px";
    }, 400);
    const stop = setTimeout(() => clearInterval(tidy), 8000);

    const onOpen = () => setOpen(true);
    window.addEventListener("open-lang", onOpen);
    return () => {
      clearInterval(tidy);
      clearTimeout(stop);
      window.removeEventListener("open-lang", onOpen);
    };
  }, []);

  // outside click + Esc
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  const apply = (code: string) => {
    setGoogTrans(code);
    location.reload();
  };

  const groups = useMemo(() => {
    const f = q.trim().toLowerCase();
    if (!f) {
      const pop = POPULAR.map((c) => BY_CODE[c]).filter(Boolean);
      const rest = LANGS.filter((l) => POPULAR.indexOf(l[0]) === -1);
      return { pop, rest, hits: null as null | [string, string, string][] };
    }
    const hits = LANGS.filter(
      (l) => l[1].toLowerCase().includes(f) || l[2].toLowerCase().includes(f) || l[0].toLowerCase().includes(f)
    );
    return { pop: [], rest: [], hits };
  }, [q]);

  const Opt = ({ l }: { l: [string, string, string] }) => (
    <button
      type="button"
      className={"lang__opt" + (l[0] === cur ? " active" : "")}
      onClick={() => apply(l[0])}
    >
      <span>{l[1]}</span>
      <span className="en">{l[2]}</span>
    </button>
  );

  return (
    <div className={"lang notranslate" + (open ? " open" : "")} translate="no" ref={rootRef}>
      <button
        className="lang__btn"
        aria-label="Choose language"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <Ic name="globe" />
        <span className="lang__code">{shortCode(cur)}</span>
        <i className="caret" />
      </button>
      <div className="lang__panel" role="menu">
        <input
          ref={searchRef}
          className="lang__search"
          type="text"
          placeholder="Search language…"
          aria-label="Search language"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="lang__list">
          {groups.hits ? (
            groups.hits.length ? (
              groups.hits.map((l) => <Opt key={l[0]} l={l} />)
            ) : (
              <div className="lang__group" style={{ padding: "14px 7px" }}>No match</div>
            )
          ) : (
            <>
              <div className="lang__group">Popular</div>
              {groups.pop.map((l) => <Opt key={l[0]} l={l} />)}
              <div className="lang__group">All languages</div>
              {groups.rest.map((l) => <Opt key={l[0]} l={l} />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
