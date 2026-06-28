"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- reveal on scroll ----
    const revealEls = Array.from(document.querySelectorAll("[data-reveal],[data-stagger]"));
    let io: IntersectionObserver | null = null;
    if (reduced || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target as HTMLElement;
            if (el.hasAttribute("data-stagger")) {
              const step = parseFloat(el.getAttribute("data-stagger") || "90") || 90;
              Array.from(el.children).forEach((k, i) => {
                (k as HTMLElement).style.transitionDelay = i * step + "ms";
              });
            }
            el.classList.add("in");
            io!.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io!.observe(el));
    }

    // ---- count-up ----
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    let cio: IntersectionObserver | null = null;
    if (counters.length && !reduced && "IntersectionObserver" in window) {
      cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (!en.isIntersecting) return;
            const el = en.target as HTMLElement;
            const target = parseFloat(el.getAttribute("data-count") || "0");
            const suffix = el.getAttribute("data-suffix") || "";
            const dur = 1500;
            let start: number | null = null;
            const tick = (ts: number) => {
              if (!start) start = ts;
              const p = Math.min((ts - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              const val = target * eased;
              el.textContent = (target % 1 === 0 ? Math.floor(val) : val.toFixed(1)) + suffix;
              if (p < 1) requestAnimationFrame(tick);
              else el.textContent = (target % 1 === 0 ? target : target.toFixed(1)) + suffix;
            };
            requestAnimationFrame(tick);
            cio!.unobserve(el);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => cio!.observe(el));
    } else {
      counters.forEach((el) => {
        el.textContent = (el.getAttribute("data-count") || "") + (el.getAttribute("data-suffix") || "");
      });
    }

    // ---- hero parallax ----
    const pbg = document.querySelector<HTMLElement>(".hero__bg img");
    let ticking = false;
    const onScroll = () => {
      if (ticking || !pbg) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) pbg.style.transform = `translate3d(0,${y * 0.18}px,0) scale(1.08)`;
        ticking = false;
      });
    };
    if (pbg && !reduced) window.addEventListener("scroll", onScroll, { passive: true });

    // safety: reveal anything already in view after load
    const t = setTimeout(() => {
      revealEls.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
      });
    }, 600);

    return () => {
      io?.disconnect();
      cio?.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
