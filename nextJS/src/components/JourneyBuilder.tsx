"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Ic from "./Ic";
import { SITEURL, WA, asset } from "@/data/site";
import {
  DAY_OPTIONS, GROUP_OPTIONS, INTEREST_OPTIONS, STYLE_OPTIONS, ALL_STOPS, ARRIVAL_XY, MONTHS,
  buildItinerary, encodeAnswers, decodeAnswers, rangeFor, seasonNote,
  type Answers, type Group, type Interest, type Style, type Itinerary,
} from "@/data/journey";

// Steps 0–3 are the questions, 4 is the short "designing" beat, 5 the result.
const QUESTIONS = ["Days", "Travellers", "Experiences", "Style"];
const BUILDING = 4;
const RESULT = 5;
// Background photo per step; the last one is shared by "building" and result.
const BACKDROPS = ["sigiriya", "beach-sunset", "train-ella", "hill-lake", "ella-ninearch"];
const photo = (name: string) => asset(`/assets/img/lib/${name}.jpg`);

const pad = (n: number) => String(n).padStart(2, "0");
const label = <T extends { key: string; label: string }>(list: T[], key: string | null) =>
  list.find((o) => o.key === key)?.label ?? "";

// ---------------------------------------------------------------------------
// Island map. A simplified outline in the same 250×430 space as the stop
// coordinates in data/journey.ts (x = (lon − 79.5)·100, y = (10 − lat)·100).
// ---------------------------------------------------------------------------
const OUTLINE: [number, number][] = [
  [50, 18], [73, 17], [90, 40], [132, 73], [150, 100], [173, 143], [190, 180], [220, 228],
  [233, 280], [234, 316], [220, 350], [190, 375], [162, 388], [130, 402], [109, 408],
  [72, 397], [55, 375], [48, 358], [35, 307], [33, 279], [32, 240], [30, 200], [22, 175],
  [35, 140], [43, 105], [55, 70], [45, 40],
];
// Closed Catmull-Rom → cubic Bézier, so the coastline reads as a coast, not a polygon.
const smooth = (pts: [number, number][]) => {
  const n = pts.length;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
  }
  return d + "Z";
};
const COAST = smooth(OUTLINE);

/** Viewbox framing the route (keeping the island's aspect ratio), so a trip
 *  along one stretch of coast isn't four dots on top of each other. */
function frame(pts: [number, number][]) {
  const W = 250, H = 430, ratio = W / H, pad = 34;
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  let w = Math.max(...xs) - Math.min(...xs) + pad * 2;
  let h = Math.max(...ys) - Math.min(...ys) + pad * 2;
  h = Math.min(H, Math.max(h, w / ratio, 190));
  w = h * ratio;
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const x = Math.min(Math.max(cx - w / 2, 0), W - w), y = Math.min(Math.max(cy - h / 2, 0), H - h);
  return { box: `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`, k: h / H };
}

function IslandMap({ route, numbers = true, zoom = false, className = "" }: { route: Itinerary["route"]; numbers?: boolean; zoom?: boolean; className?: string }) {
  const on = new Set(route.map((r) => r.id));
  const pts = [ARRIVAL_XY, ...route.map((r) => r.xy), ARRIVAL_XY];
  const { box, k } = zoom ? frame(pts) : { box: "0 0 250 430", k: 1 };
  // Markers keep roughly their on-screen size when zoomed in.
  const mk = Math.max(k, 0.55);
  return (
    <svg className={"jb-map " + (zoom ? "jb-map--zoom " : "") + className} viewBox={box} role="img" aria-label={`Route map: Airport, ${route.map((r) => r.name).join(", ")}, Airport`}>
      <path className="jb-map__land" d={COAST} />
      <polyline className="jb-map__route" points={pts.map((p) => p.join(",")).join(" ")} />
      {ALL_STOPS.filter((s) => !on.has(s.id)).map((s) => (
        <circle key={s.id} className="jb-map__dot" cx={s.xy[0]} cy={s.xy[1]} r={2.4 * mk} />
      ))}
      <g className="jb-map__plane" transform={`translate(${ARRIVAL_XY[0]} ${ARRIVAL_XY[1]}) scale(${mk})`}>
        <circle r="7.5" />
        <path d="M-3.6 0.6 L3.8 -3.4 L1.4 0.2 L3.8 3.4 Z" />
      </g>
      {/* Numbered markers rather than name labels: the south-west coast has
          four places within a few pixels of each other, and names collide. */}
      {route.map((r, i) => (
        <g key={r.id} className="jb-map__stop" transform={`translate(${r.xy[0]} ${r.xy[1]}) scale(${mk})`}>
          <circle r={numbers ? 7 : 5.5} />
          {numbers && <text y="3.2" textAnchor="middle">{i + 1}</text>}
        </g>
      ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------

type Contact = { name: string; email: string; country: string; month: string };

function journeyMessage(a: Answers, it: Itinerary, ask: string, contact?: Contact) {
  const lines = [
    "Hello SL Journey! 👋 I built my journey on your website.",
    "",
    `*My ${a.days}-Day Sri Lanka Journey*`,
    `👥 Travelling: ${label(GROUP_OPTIONS, a.group)}`,
    `✨ Experiences: ${a.interests.map((i) => label(INTEREST_OPTIONS, i)).join(", ")}`,
    `🏨 Style: ${label(STYLE_OPTIONS, a.style)}`,
    "",
    ...it.days.map((d) => `Day ${pad(d.n)} – ${d.title}`),
  ];
  if (contact) {
    lines.push(
      "",
      `🙋 Name: ${contact.name}`,
      `📧 Email: ${contact.email}`,
      `🌍 Country: ${contact.country}`,
      `📅 Travel month: ${contact.month}`
    );
  }
  lines.push("", `🔗 ${SITEURL}/build-my-journey/#${encodeAnswers(a)}`, "", ask);
  return `https://wa.me/${WA}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function openWhatsApp(url: string) {
  const w = window.open(url, "_blank");
  if (w) w.opener = null;
  else window.location.href = url; // popup blocked: same tab is fine for wa.me
}

// ---------------------------------------------------------------------------

export default function JourneyBuilder() {
  const [step, setStep] = useState(0);
  const [days, setDays] = useState(0);
  const [group, setGroup] = useState<Group | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [style, setStyle] = useState<Style | null>(null);
  const [months, setMonths] = useState<{ label: string; m: number }[]>([]);
  // Travel month (0 = Jan) from the send form; it re-plans for the monsoon.
  const [month, setMonth] = useState<number | null>(null);
  const [sent, setSent] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const interacted = useRef(false);

  // Unanswered questions fall back to neutral defaults so the live preview has
  // something to draw from the very first screen.
  const answers: Answers = { days: days || 7, group, interests, style, month };
  const itinerary = useMemo(
    () => buildItinerary({ days: days || 7, group, interests, style, month }),
    [days, group, interests, style, month]
  );

  // A shared link (#d=10&g=couple&…) opens straight on its result.
  useEffect(() => {
    const a = decodeAnswers(window.location.hash);
    if (a) {
      setDays(a.days); setGroup(a.group); setInterests(a.interests); setStyle(a.style); setMonth(a.month ?? null);
      setStep(RESULT);
    }
    // Travel months are computed here, not during render, because the page is
    // prerendered at build time and "next month" would be stale by then.
    const now = new Date();
    setMonths(
      Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() + 1 + i, 1);
        return { label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`, m: d.getMonth() };
      })
    );
    return () => clearTimeout(timer.current);
  }, []);

  // Keep the URL in sync with the result so it can be copied or shared.
  useEffect(() => {
    if (step === RESULT && group && style && interests.length) {
      history.replaceState(null, "", `#${encodeAnswers({ days, group, interests, style, month })}`);
    }
  }, [step, days, group, interests, style, month]);

  // Move focus to the new question for keyboard and screen-reader users, and
  // bring the builder back into view. Skipped on first paint.
  useEffect(() => {
    if (!interacted.current) return;
    const top = rootRef.current?.getBoundingClientRect().top ?? 0;
    if (top < -40 || step === RESULT) rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const go = (s: number, delay = 0) => {
    interacted.current = true;
    clearTimeout(timer.current);
    if (delay) timer.current = setTimeout(() => setStep(s), delay);
    else setStep(s);
  };

  const build = () => {
    go(BUILDING);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current = setTimeout(() => { setSent(null); setStep(RESULT); }, reduced ? 400 : 2200);
  };

  const toggleInterest = (i: Interest) =>
    setInterests((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  const answered = [!!days, !!group, interests.length > 0, !!style];
  const range = days ? rangeFor(days) : null;

  const onSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const contact: Contact = {
      name: String(f.get("name") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      country: String(f.get("country") ?? "").trim(),
      month: months.find((o) => o.m === month)?.label ?? "Not decided yet",
    };
    const url = journeyMessage(answers, itinerary, "Please help me make this journey real and send me the final quotation. Thank you!", contact);
    setSent(url);
    openWhatsApp(url);
  };

  const priceUrl = journeyMessage(answers, itinerary, "Could you send me an approximate price for this journey?");

  // ---- Question screens -------------------------------------------------
  const question = () => {
    if (step === 0)
      return (
        <Q n={1} title="How many days are you staying?" hint="Pick a range. You can fine-tune the exact number at the end." headingRef={headingRef}>
          <div className="jb-opts">
            {DAY_OPTIONS.map((o) => (
              <Opt key={o.key} on={range?.key === o.key} onClick={() => { setDays(range?.key === o.key ? days : o.def); go(1, 320); }}>
                <span className="jb-opt__big">{o.label.replace(" Days", "")}</span>
                <span className="jb-opt__label">Days</span>
                <span className="jb-opt__sub">{o.sub}</span>
              </Opt>
            ))}
          </div>
        </Q>
      );
    if (step === 1)
      return (
        <Q n={2} title="Who are you travelling with?" hint="We'll shape the pace and the stays around you." headingRef={headingRef}>
          <div className="jb-opts">
            {GROUP_OPTIONS.map((o) => (
              <Opt key={o.key} on={group === o.key} onClick={() => { setGroup(o.key); go(2, 320); }}>
                <span className="jb-opt__emoji" aria-hidden="true">{o.emoji}</span>
                <span className="jb-opt__label">{o.label}</span>
                <span className="jb-opt__sub">{o.sub}</span>
              </Opt>
            ))}
          </div>
        </Q>
      );
    if (step === 2)
      return (
        <Q n={3} title="What do you want to experience?" hint="Choose as many as you like. Watch your route change on the map." headingRef={headingRef}>
          <div className="jb-opts">
            {INTEREST_OPTIONS.map((o) => (
              <Opt key={o.key} on={interests.includes(o.key)} onClick={() => toggleInterest(o.key)}>
                <span className="jb-opt__emoji" aria-hidden="true">{o.emoji}</span>
                <span className="jb-opt__label">{o.label}</span>
              </Opt>
            ))}
          </div>
        </Q>
      );
    return (
      <Q n={4} title="What is your travel style?" hint="This sets the kind of hotels and transport we plan around." headingRef={headingRef}>
        <div className="jb-opts">
          {STYLE_OPTIONS.map((o) => (
            <Opt key={o.key} on={style === o.key} onClick={() => { setStyle(o.key); build(); }}>
              <span className="jb-opt__tier">{o.tier}</span>
              <span className="jb-opt__label">{o.label}</span>
              <span className="jb-opt__sub">{o.sub}</span>
            </Opt>
          ))}
        </div>
      </Q>
    );
  };

  const chips = [
    days ? `🗓️ ${days} days` : null,
    group ? `${GROUP_OPTIONS.find((o) => o.key === group)!.emoji} ${label(GROUP_OPTIONS, group)}` : null,
    ...interests.map((i) => `${INTEREST_OPTIONS.find((o) => o.key === i)!.emoji} ${label(INTEREST_OPTIONS, i)}`),
    style ? `✦ ${label(STYLE_OPTIONS, style)}` : null,
  ].filter(Boolean) as string[];

  const styleOpt = STYLE_OPTIONS.find((o) => o.key === style);
  const groupOpt = GROUP_OPTIONS.find((o) => o.key === group);

  return (
    <div ref={rootRef} className="jb" style={{ scrollMarginTop: 0 }}>
      <section className={"jb-stage" + (step === RESULT ? " jb-stage--result" : "")}>
        <div className="jb-bg" aria-hidden="true">
          {BACKDROPS.map((b, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={b} src={photo(b)} alt="" loading={i === 0 ? "eager" : "lazy"} className={Math.min(step, BACKDROPS.length - 1) === i ? "is-on" : ""} />
          ))}
        </div>

        {step < RESULT ? (
          <div className={"container jb-stage__inner" + (step > 0 ? " is-started" : "")}>
            <div className="jb-main">
              <div className="jb-intro">
                <span className="eyebrow">Build My Journey</span>
                <h1>Don&apos;t choose a package.<br /><em>Build your journey.</em></h1>
                <p>Four quick questions. Your personal Sri Lanka itinerary, designed day by day as you answer.</p>
              </div>

              <ol className="jb-progress" aria-label="Progress">
                {QUESTIONS.map((q, i) => {
                  const reachable = i === 0 || answered.slice(0, i).every(Boolean);
                  return (
                    <li key={q}>
                      <button
                        type="button"
                        className={(i === step ? "is-current" : "") + (answered[i] && i !== step ? " is-done" : "")}
                        disabled={!reachable || step === BUILDING}
                        aria-current={i === step ? "step" : undefined}
                        onClick={() => go(i)}
                      >
                        <span className="jb-progress__n">{pad(i + 1)}</span>
                        <span className="jb-progress__lbl">{q}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="jb-panel" aria-live="polite">
                {step === BUILDING ? (
                  <div className="jb-building" key="building">
                    <IslandMap route={itinerary.route} numbers={false} className="jb-map--draw" />
                    <div>
                      <h2 ref={headingRef} tabIndex={-1}>Designing your journey…</h2>
                      <ul className="jb-building__steps">
                        <li>Plotting your route across the island</li>
                        <li>Matching experiences to your interests</li>
                        <li>Choosing {label(STYLE_OPTIONS, style).toLowerCase()} stays</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div key={step}>
                    {question()}
                    <div className="jb-nav">
                      {step > 0 ? (
                        <button type="button" className="jb-back" onClick={() => go(step - 1)}>
                          <Ic name="arrow" /> Back
                        </button>
                      ) : <span />}
                      {step === 2 && (
                        <button type="button" className="btn btn--primary btn--lg" disabled={!interests.length} onClick={() => go(3)}>
                          {interests.length ? `Continue with ${interests.length}` : "Pick at least one"} <Ic name="arrow" />
                        </button>
                      )}
                      {step !== 2 && answered[step] && (
                        <button type="button" className="btn btn--light" onClick={() => (step === 3 ? build() : go(step + 1))}>
                          Next <Ic name="arrow" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <aside className="jb-preview" aria-label="Your journey so far">
              <div className="jb-preview__head">
                <span className="jb-preview__kicker">Your journey so far</span>
                <b>{answers.days} days · {itinerary.route.length} {itinerary.route.length === 1 ? "stop" : "stops"}</b>
              </div>
              <IslandMap route={itinerary.route} />
              <p className="jb-preview__route">
                Airport → {itinerary.route.map((r) => r.name).join(" → ")} → Airport
              </p>
              {chips.length > 0 && (
                <div className="jb-chips">{chips.map((c) => <span key={c} className="jb-chip">{c}</span>)}</div>
              )}
            </aside>
          </div>
        ) : (
          <div className="container jb-stage__inner jb-hero">
            <div className="jb-hero__text">
              <span className="eyebrow">Your Sri Lanka Journey</span>
              <h1 ref={headingRef} tabIndex={-1}>Your {days}-Day<br /><em>Sri Lanka Journey</em></h1>
              <div className="jb-chips" style={{ marginTop: 18 }}>{chips.slice(1).map((c) => <span key={c} className="jb-chip">{c}</span>)}</div>
              <div className="jb-hero__tools">
                <div className="jb-stepper" role="group" aria-label="Trip length">
                  <button type="button" aria-label="One day fewer" disabled={days <= 3} onClick={() => setDays(days - 1)}>−</button>
                  <span aria-live="polite"><b>{days}</b> days</span>
                  <button type="button" aria-label="One day more" disabled={days >= 21} onClick={() => setDays(days + 1)}>+</button>
                </div>
                <MonthSelect id="jb-when" className="jb-when" months={months} month={month} onChange={setMonth} />
                <button type="button" className="jb-back" onClick={() => go(0)}>
                  <Ic name="arrow" /> Edit my answers
                </button>
              </div>
            </div>
            <div className="jb-hero__map">
              <IslandMap route={itinerary.route} zoom />
              <ol className="jb-legend">
                {itinerary.route.map((r, i) => <li key={r.id}><b>{i + 1}</b>{r.name}</li>)}
              </ol>
            </div>
          </div>
        )}
      </section>

      {step === RESULT && styleOpt && groupOpt && (
        <section className="section jb-result">
          <div className="container jb-body">
            <div className="jb-timeline">
            <p className="jb-season" role="status"><Ic name="calendar" /> {seasonNote(month)}</p>
            <ol className="jb-days" key={`${days}-${month}` /* replay the entrance when the plan changes */}>
              {itinerary.days.map((d, i) => (
                <li key={d.n} className={"jb-day" + (i === 0 || i === itinerary.days.length - 1 ? " jb-day--end" : "")} style={{ animationDelay: `${Math.min(i, 14) * 60}ms` }}>
                  <div className="jb-day__n"><small>Day</small>{pad(d.n)}</div>
                  <div className="jb-day__card">
                    <h3>{d.title}</h3>
                    {d.travel && <div className="jb-day__travel">{d.travel}</div>}
                    <p>{d.text}</p>
                    {d.romance && <p className="jb-day__romance">❤️ {d.romance}</p>}
                    {d.sleep && <div className="jb-day__sleep"><Ic name="pin" /> Overnight in {d.sleep}</div>}
                  </div>
                </li>
              ))}
            </ol>
            </div>

            <aside className="jb-side">
              <div className="jb-card">
                <h3>Designed around you</h3>
                <ul className="jb-facts">
                  <li><Ic name="users" /><span><b>{groupOpt.label}</b>{groupOpt.note}</span></li>
                  <li><Ic name="shield" /><span><b>{styleOpt.label} stays</b>{styleOpt.stays}</span></li>
                  <li><Ic name="compass" /><span><b>Getting around</b>{styleOpt.ride}, for the whole trip</span></li>
                </ul>
              </div>

              <div className="jb-card jb-card--price">
                <span className="jb-card__kicker">Estimated price</span>
                <h3>Get your approximate price</h3>
                <p>Tap below and we&apos;ll reply on WhatsApp with an approximate price for this exact journey. Free, no obligation.</p>
                <a className="btn btn--wa btn--lg" href={priceUrl} target="_blank" rel="noopener noreferrer">
                  <Ic name="whatsapp" /> Get my estimate
                </a>
              </div>

              <div className="jb-card" id="send">
                <span className="jb-card__kicker" style={{ color: "var(--gold-600)" }}>Next step</span>
                <h3>Want us to make this journey real?</h3>
                <p>Send it to our travel designers. We&apos;ll fine-tune every day with you and send your final quotation.</p>
                <form className="jb-form" onSubmit={onSend}>
                  <div className="field"><label htmlFor="jb-name">Your name <span className="req">*</span></label><input id="jb-name" name="name" required autoComplete="name" /></div>
                  <div className="field"><label htmlFor="jb-email">Email <span className="req">*</span></label><input id="jb-email" name="email" type="email" required autoComplete="email" inputMode="email" /></div>
                  <div className="field-row">
                    <div className="field"><label htmlFor="jb-country">Country <span className="req">*</span></label><input id="jb-country" name="country" required autoComplete="country-name" /></div>
                    <div className="field">
                      <label htmlFor="jb-month">Travel month</label>
                      <MonthSelect id="jb-month" months={months} month={month} onChange={setMonth} placeholder="Not decided yet" />
                    </div>
                  </div>
                  <button className="btn btn--primary btn--lg jb-send" type="submit">
                    <Ic name="whatsapp" /> Send my journey
                  </button>
                  <p className="form-note">Opens WhatsApp with your journey ready to send.</p>
                  {sent && (
                    <div className="form-msg ok show" role="status">
                      <b>Almost there!</b> Just press send in WhatsApp. It didn&apos;t open?{" "}
                      <a href={sent} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>Open WhatsApp</a>
                    </div>
                  )}
                </form>
              </div>
            </aside>
          </div>
          {/* Phones only: the form sits below a long timeline, so keep a way to
              reach it in thumb range. Rests under the form once scrolled past. */}
          <div className="jb-mcta">
            {/* Scrolls by script: a plain #send link would overwrite the share hash. */}
            <button type="button" className="btn btn--primary" onClick={() => {
              document.getElementById("send")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}>
              Send my journey <Ic name="arrow" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function Q({ n, title, hint, headingRef, children }: {
  n: number; title: string; hint: string; headingRef: React.RefObject<HTMLHeadingElement>; children: React.ReactNode;
}) {
  return (
    <div className="jb-q">
      <span className="jb-q__count">Step {pad(n)} of 04</span>
      <h2 ref={headingRef} tabIndex={-1}>{title}</h2>
      <p className="jb-q__hint">{hint}</p>
      {children}
    </div>
  );
}

function Opt({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className={"jb-opt" + (on ? " is-on" : "")} aria-pressed={on} onClick={onClick}>
      <span className="jb-opt__tick" aria-hidden="true"><Ic name="check" /></span>
      {children}
    </button>
  );
}

/** One month picker, used twice (result header and send form) on the same
 *  state, so choosing a month anywhere re-plans the route for the season. */
function MonthSelect({ id, className, months, month, onChange, placeholder = "When are you travelling?" }: {
  id: string; className?: string; months: { label: string; m: number }[];
  month: number | null; onChange: (m: number | null) => void; placeholder?: string;
}) {
  return (
    <select
      id={id}
      className={className}
      aria-label={className ? "Travel month" : undefined}
      value={month ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
    >
      <option value="">{placeholder}</option>
      {months.map((o) => <option key={o.m} value={o.m}>{o.label}</option>)}
    </select>
  );
}
