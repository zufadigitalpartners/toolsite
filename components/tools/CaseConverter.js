"use client";

import { useState } from "react";

function toTitleCase(s) {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function toSentenceCase(s) {
  return s
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase());
}

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div>
      <textarea
        className="tool-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        aria-label="Text to convert"
      />
      <div className="btn-row">
        <button className="btn" onClick={() => setText(text.toUpperCase())}>UPPERCASE</button>
        <button className="btn" onClick={() => setText(text.toLowerCase())}>lowercase</button>
        <button className="btn" onClick={() => setText(toTitleCase(text))}>Title Case</button>
        <button className="btn" onClick={() => setText(toSentenceCase(text))}>Sentence case</button>
        <button className={`btn btn-copy${copied ? " copied" : ""}`} onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
