"use client";

import { useState } from "react";
import { WA, EMAIL, BRAND } from "@/data/site";
import { PACKAGES } from "@/data/content";
import Ic from "./Ic";

const TITLES: Record<string, string> = {
  name: "Name", email: "Email", nationality: "Nationality", phone: "Phone",
  arrival: "Arrival", departure: "Departure", adults: "Adults", children: "Children",
  accommodation: "Accommodation", meals: "Meal basis", package: "Tour package", message: "Message",
};

// Public by design: Web3Forms access keys are meant to be exposed in client code,
// and every NEXT_PUBLIC_* var is inlined into the bundle anyway. The key only
// permits delivery to the address it was registered to. If it is unset the form
// still works over WhatsApp; it just loses the email safety net.
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; emailed: boolean }
  | { kind: "blocked"; waUrl: string; mailUrl: string; emailed: boolean };

export default function EnquiryForm({
  heading = `New enquiry from ${BRAND} website`,
  defaultPackage = "",
}: {
  heading?: string;
  defaultPackage?: string;
}) {
  const [state, setState] = useState<State>({ kind: "idle" });

  /** Posts the enquiry to Web3Forms. Resolves false rather than throwing. */
  async function sendEmail(fd: FormData): Promise<boolean> {
    if (!WEB3FORMS_KEY) return false;

    const payload = new FormData();
    fd.forEach((v, k) => payload.append(k, v));
    payload.append("access_key", WEB3FORMS_KEY);
    payload.append("subject", heading);
    payload.append("from_name", `${BRAND} website`);
    // So hitting reply in the inbox goes to the traveller, not to us.
    const replyTo = String(fd.get("email") || "").trim();
    if (replyTo) payload.append("replyto", replyTo);

    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: payload,
        // Survives the tab being backgrounded when WhatsApp opens over it.
        keepalive: true,
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot. A real person cannot tick a hidden checkbox; bots tick everything.
    // Silently accepted so the bot has no signal to adapt to.
    if (fd.get("botcheck")) {
      setState({ kind: "sent", emailed: true });
      form.reset();
      return;
    }

    const lines: string[] = [];
    fd.forEach((val, key) => {
      if (key === "botcheck") return;
      const v = String(val).trim();
      if (v) lines.push(`${TITLES[key] || key}: ${v}`);
    });
    if (!lines.length) return;

    const body = `${heading}\n\n${lines.join("\n")}`;
    const waUrl = `https://wa.me/${WA}?text=${encodeURIComponent(body)}`;
    const mailUrl = `mailto:${EMAIL}?subject=${encodeURIComponent(
      heading
    )}&body=${encodeURIComponent(body)}`;

    setState({ kind: "sending" });

    // Start the email first, so the lead is captured even if WhatsApp never
    // opens. Deliberately NOT awaited: awaiting would end the user gesture and
    // every popup blocker would then eat the window.open below.
    const delivery = sendEmail(fd);

    // Still inside the gesture, so this counts as user-initiated.
    //
    // window.open(url, name, "noopener") always returns null per spec, so
    // passing noopener and detecting a blocked popup are mutually exclusive.
    // Severing .opener gives the same protection and keeps the handle.
    const win = window.open(waUrl, "_blank");
    if (win) win.opener = null;

    void delivery.then((emailed) => {
      if (win) {
        setState({ kind: "sent", emailed });
        form.reset();
      } else {
        // Don't reset: the popup was blocked, so the fallback links are the
        // only way through and the user may still want their typed answers.
        setState({ kind: "blocked", waUrl, mailUrl, emailed });
      }
    });
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
            <option>Standard (2–3 Stars)</option>
            <option>Deluxe (3–4 Stars)</option>
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
        <Ic name="whatsapp" />
        {state.kind === "sending" ? "Sending…" : "Send Enquiry via WhatsApp"}
      </button>
      <p className="form-note">
        By sending, WhatsApp opens with your details pre-filled and a copy reaches
        us by email. Prefer email only? Write to{" "}
        <a href={`mailto:${EMAIL}`} style={{ color: "var(--gold-600)" }}>{EMAIL}</a>.
      </p>

      {/* The live region is always mounted; only its contents change. A region
          that is display:none when it updates is not announced. */}
      <div className="form-status" aria-live="polite">
        {state.kind === "sent" && (
          <div className="form-msg show ok">
            {state.emailed
              ? "Thanks — your enquiry is with us by email, and WhatsApp is opening with the details pre-filled. We usually reply within a few hours."
              : "WhatsApp is opening with your enquiry pre-filled — press send there to reach us."}
          </div>
        )}

        {state.kind === "blocked" && (
          <div className="form-msg show warn">
            <b>Your browser blocked the WhatsApp window.</b>
            <p style={{ margin: "6px 0 10px" }}>
              {state.emailed
                ? "No problem — your enquiry already reached us by email, so nothing is lost. To chat now:"
                : "Nothing has been sent yet. Use one of these to reach us:"}
            </p>
            <span className="form-msg__actions">
              <a className="btn btn--primary" href={state.waUrl} target="_blank" rel="noopener noreferrer">
                <Ic name="whatsapp" /> Open WhatsApp
              </a>
              <a className="btn btn--ghost" href={state.mailUrl}>
                <Ic name="mail" /> Email us instead
              </a>
            </span>
          </div>
        )}
      </div>
    </form>
  );
}
