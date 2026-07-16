"use client";

import { useState } from "react";
import { WA, EMAIL } from "@/data/site";
import { PACKAGES } from "@/data/content";
import Ic from "./Ic";

const TITLES: Record<string, string> = {
  name: "Name", email: "Email", nationality: "Nationality", phone: "Phone",
  arrival: "Arrival", departure: "Departure", adults: "Adults", children: "Children",
  accommodation: "Accommodation", meals: "Meal basis", package: "Tour package", message: "Message",
};

export default function EnquiryForm({
  heading = "New enquiry from SL Journey website",
  defaultPackage = "",
}: {
  heading?: string;
  defaultPackage?: string;
}) {
  const [msg, setMsg] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const lines: string[] = [];
    fd.forEach((val, key) => {
      const v = String(val).trim();
      if (v) lines.push((TITLES[key] || key) + ": " + v);
    });
    if (!lines.length) return;
    const body = heading + "\n\n" + lines.join("\n");
    const waUrl = "https://wa.me/" + WA + "?text=" + encodeURIComponent(body);
    setMsg("Opening WhatsApp with your enquiry — if it doesn’t open, email us at " + EMAIL + ".");
    window.open(waUrl, "_blank");
    form.reset();
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
      <button className="btn btn--primary btn--lg" type="submit" style={{ width: "100%" }}>
        <Ic name="whatsapp" /> Send Enquiry via WhatsApp
      </button>
      <p className="form-note">
        By sending, WhatsApp opens with your details pre-filled. Prefer email? Write to{" "}
        <a href={`mailto:${EMAIL}`} style={{ color: "var(--gold-600)" }}>{EMAIL}</a>.
      </p>
      <div className={"form-msg" + (msg ? " show ok" : "")}>{msg}</div>
    </form>
  );
}
