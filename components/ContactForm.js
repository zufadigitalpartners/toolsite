"use client";

import { useState } from "react";

// Contact form for a static site. Submissions go to Web3Forms, which
// forwards them straight to the site's inbox. The access key lives in
// Site Settings (Tina) so it can be changed without touching code.
// With no key configured the form falls back to a plain mailto link,
// so the page is never broken.
const ENDPOINT = "https://api.web3forms.com/submit";

export default function ContactForm({ accessKey, email, siteName, labels = {} }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const t = {
    name: labels.name || "Your name",
    email: labels.email || "Your email",
    subject: labels.subject || "Subject",
    message: labels.message || "Message",
    send: labels.send || "Send message",
    sending: labels.sending || "Sending...",
    success: labels.success || "Thanks! Your message has been sent. We usually reply within a few days.",
    error: labels.error || "Something went wrong. Please try again, or email us directly.",
    subjectOptions: labels.subjectOptions || [
      "Tool suggestion",
      "Report a bug",
      "Advertising or partnership",
      "Something else",
    ],
  };

  if (!accessKey) {
    return (
      <p className="form-fallback">
        Email us directly at <a href={`mailto:${email}`}>{email}</a> and we will get back to you.
      </p>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    data.append("access_key", accessKey);

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setError(json.message || t.error);
      }
    } catch (err) {
      setStatus("error");
      setError(t.error);
    }
  }

  if (status === "sent") {
    return (
      <div className="form-success" role="status">
        <span className="fs-icon" aria-hidden="true">✓</span>
        <p>{t.success}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      {/* Honeypot field, hidden from people and filled in by bots. */}
      <input type="checkbox" name="botcheck" className="hp-field" tabIndex={-1} autoComplete="off" />
      <input type="hidden" name="subject" value={`New message from the ${siteName} contact form`} />
      <input type="hidden" name="from_name" value={siteName} />

      <div className="cf-row">
        <label>
          <span>{t.name}</span>
          <input type="text" name="name" required autoComplete="name" className="tool-text" />
        </label>
        <label>
          <span>{t.email}</span>
          <input type="email" name="email" required autoComplete="email" className="tool-text" />
        </label>
      </div>

      <label>
        <span>{t.subject}</span>
        <select name="topic" className="tool-text" defaultValue={t.subjectOptions[0]}>
          {t.subjectOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label>
        <span>{t.message}</span>
        <textarea name="message" required rows={7} className="tool-input" />
      </label>

      <div className="cf-actions">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? t.sending : t.send}
        </button>
        <span className="cf-note">
          We only use your email to reply. Nothing is added to a mailing list.
        </span>
      </div>

      {status === "error" && <p className="error-note">{error || t.error}</p>}
    </form>
  );
}
