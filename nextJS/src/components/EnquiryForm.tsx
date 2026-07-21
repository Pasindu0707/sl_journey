"use client";

import { useState } from "react";
import { EMAIL, BRAND, WEB3FORMS_KEY, waLink } from "@/data/site";
import { PACKAGES } from "@/data/content";
import Ic from "./Ic";

const TITLES: Record<string, string> = {
  name: "Name", email: "Email", nationality: "Nationality", phone: "Phone",
  arrival: "Arrival", departure: "Departure", adults: "Adults", children: "Children",
  accommodation: "Accommodation", meals: "Meal basis", package: "Tour package", message: "Message",
};

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; mailUrl: string };

export default function EnquiryForm({
  heading = `New enquiry from ${BRAND} website`,
  defaultPackage = "",
}: {
  heading?: string;
  defaultPackage?: string;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot. A real person cannot tick a hidden checkbox; bots tick everything.
    // Silently accepted so the bot has no signal to adapt to.
    if (fd.get("botcheck")) {
      setState({ kind: "sent" });
      form.reset();
      return;
    }

    // A human-readable copy of the answers, for the mailto fallback if the POST
    // fails for any reason (offline, blocked request).
    const lines: string[] = [];
    fd.forEach((val, key) => {
      if (key === "botcheck") return;
      const v = String(val).trim();
      if (v) lines.push(`${TITLES[key] || key}: ${v}`);
    });
    if (!lines.length) return;
    const mailUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(
      heading
    )}&body=${encodeURIComponent(`${heading}\n\n${lines.join("\n")}`)}`;

    setState({ kind: "sending" });

    const payload = new FormData();
    fd.forEach((v, k) => {
      if (k !== "botcheck") payload.append(k, v);
    });
    payload.append("access_key", WEB3FORMS_KEY);
    payload.append("subject", heading);
    payload.append("from_name", `${BRAND} website`);
    // So hitting reply in the inbox goes to the traveller, not to us.
    const replyTo = String(fd.get("email") || "").trim();
    if (replyTo) payload.append("replyto", replyTo);

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, { method: "POST", body: payload });
      if (res.ok) {
        setState({ kind: "sent" });
        form.reset();
      } else {
        setState({ kind: "error", mailUrl });
      }
    } catch {
      // Network error / request blocked — don't reset, so the typed answers
      // survive and the fallback links carry them through.
      setState({ kind: "error", mailUrl });
    }
  };

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate>
      <div className="field-row">
        <div className="field"><label>Your Name <span className="req">*</span></label><input name="name" type="text" autoComplete="name" placeholder="Jane Traveller" required /></div>
        <div className="field"><label>Email <span className="req">*</span></label><input name="email" type="email" autoComplete="email" placeholder="you@email.com" required /></div>
      </div>
      <div className="field-row">
        <div className="field"><label>Nationality</label><input name="nationality" type="text" placeholder="e.g. German" /></div>
        <div className="field"><label>Phone / WhatsApp</label><input name="phone" type="tel" autoComplete="tel" placeholder="+.." /></div>
      </div>
      <div className="field-row">
        <div className="field"><label>Arrival Date</label><input name="arrival" type="date" /></div>
        <div className="field"><label>Departure Date</label><input name="departure" type="date" /></div>
      </div>
      <div className="field-row">
        <div className="field"><label>No. of Adults</label><input name="adults" type="number" min={1} placeholder="2" /></div>
        <div className="field"><label>No. of Children</label><input name="children" type="number" min={0} placeholder="0" /></div>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Accommodation Type</label>
          <select name="accommodation" defaultValue="">
            <option value="">Select…</option>
            <option>Standard (2-3 Stars)</option>
            <option>Deluxe (3-4 Stars)</option>
            <option>High End (4 Stars)</option>
            <option>Luxury (5 Stars)</option>
            <option>Ultra Luxury</option>
          </select>
        </div>
        <div className="field">
          <label>Meal Basis</label>
          <select name="meals" defaultValue="">
            <option value="">Select…</option>
            <option>Bed &amp; Breakfast</option>
            <option>Half Board</option>
            <option>Full Board</option>
            <option>Room Only</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Tour Package</label>
        <select name="package" defaultValue={defaultPackage}>
          <option value="">Select…</option>
          {PACKAGES.map((p) => <option key={p.slug}>{p.name}</option>)}
          <option>I&apos;d like to customise my tour</option>
        </select>
      </div>
      <div className="field">
        <label>Tell us about your dream trip</label>
        <textarea name="message" placeholder="Interests, pace, special occasions, must-sees…" />
      </div>

      {/* Honeypot — hidden from people and from assistive tech alike. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: "none" }}
      />

      <button
        className="btn btn--primary btn--lg"
        type="submit"
        style={{ width: "100%" }}
        disabled={state.kind === "sending"}
      >
        <Ic name="mail" />
        {state.kind === "sending" ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="form-note">
        We&apos;ll reply to your email, usually within a few hours. Prefer to chat
        now? <a href={waLink()} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-600)" }}>Message us on WhatsApp</a>.
      </p>

      {/* The live region is always mounted; only its contents change. A region
          that is display:none when it updates is not announced. */}
      <div className="form-status" aria-live="polite">
        {state.kind === "sent" && (
          <div className="form-msg show ok">
            Thank you - your enquiry is on its way to our team. We&apos;ll be in touch
            by email very soon.
          </div>
        )}

        {state.kind === "error" && (
          <div className="form-msg show warn">
            <b>That didn&apos;t go through.</b>
            <p style={{ margin: "6px 0 10px" }}>
              A connection hiccup stopped your enquiry from sending. Please try
              again in a moment, or reach us directly:
            </p>
            <span className="form-msg__actions">
              <a className="btn btn--primary" href={state.mailUrl}>
                <Ic name="mail" /> Email us
              </a>
              <a className="btn btn--ghost" href={waLink()} target="_blank" rel="noopener noreferrer">
                <Ic name="whatsapp" /> WhatsApp
              </a>
            </span>
          </div>
        )}
      </div>
    </form>
  );
}
