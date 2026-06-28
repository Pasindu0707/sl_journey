"use client";

import { useCallback, useEffect, useState } from "react";
import { GALLERY, img } from "@/data/content";
import Ic from "./Ic";

export default function Gallery() {
  const [idx, setIdx] = useState(-1);
  const open = idx >= 0;

  const show = useCallback((i: number) => setIdx((i + GALLERY.length) % GALLERY.length), []);
  const close = useCallback(() => setIdx(-1), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setIdx((p) => (p + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setIdx((p) => (p - 1 + GALLERY.length) % GALLERY.length);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <div className="gallery-grid">
        {GALLERY.map(([im, cap], i) => (
          <button className="g-item" key={im + i} onClick={() => show(i)} aria-label={cap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(im)} alt={cap} loading="lazy" decoding="async" />
            <span className="g-cap">{cap}</span>
          </button>
        ))}
      </div>

      <div className={"lightbox" + (open ? " open" : "")} onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t.classList.contains("lightbox") || t.closest(".lb-close")) close();
        else if (t.closest(".lb-nav.next")) setIdx((p) => (p + 1) % GALLERY.length);
        else if (t.closest(".lb-nav.prev")) setIdx((p) => (p - 1 + GALLERY.length) % GALLERY.length);
      }}>
        <button className="lb-close" aria-label="Close"><Ic name="x" /></button>
        <button className="lb-nav prev" aria-label="Previous"><Ic name="chevL" /></button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {open && <img src={img(GALLERY[idx][0])} alt={GALLERY[idx][1]} />}
        <button className="lb-nav next" aria-label="Next"><Ic name="chevR" /></button>
      </div>
    </>
  );
}
