"use client";

import { useState } from "react";

export default function JsonFormatter() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function run(minify) {
    setError("");
    try {
      const parsed = JSON.parse(text);
      setText(JSON.stringify(parsed, null, minify ? 0 : 2));
    } catch (e) {
      setError(e.message);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div>
      <textarea
        className="tool-input mono-out"
        value={text}
        onChange={(e) => { setText(e.target.value); setError(""); }}
        placeholder='Paste JSON here… e.g. {"name":"Ali","age":25}'
        aria-label="JSON input"
        spellCheck={false}
      />
      {error && <div className="error-note">Invalid JSON: {error}</div>}
      <div className="btn-row">
        <button className="btn btn-primary" onClick={() => run(false)}>Format</button>
        <button className="btn" onClick={() => run(true)}>Minify</button>
        <button className={`btn btn-copy${copied ? " copied" : ""}`} onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
