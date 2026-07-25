"use client";

import { useState } from "react";

function encodeB64(str) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

function decodeB64(str) {
  const bytes = Uint8Array.from(atob(str.trim()), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  let output = "";
  let error = "";
  if (input) {
    try {
      output = mode === "encode" ? encodeB64(input) : decodeB64(input);
    } catch {
      error = "This doesn't look like valid Base64. Check the input and try again.";
    }
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div>
      <div className="mode-tabs" role="tablist">
        <button className={mode === "encode" ? "active" : ""} onClick={() => setMode("encode")}>
          Encode
        </button>
        <button className={mode === "decode" ? "active" : ""} onClick={() => setMode("decode")}>
          Decode
        </button>
      </div>
      <textarea
        className="tool-input mono-out"
        style={{ minHeight: 130 }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "Type text to encode…" : "Paste Base64 to decode…"}
        aria-label="Input"
        spellCheck={false}
      />
      {error && <div className="error-note">{error}</div>}
      {output && !error && (
        <>
          <p className="result-note">Result:</p>
          <textarea
            className="tool-input mono-out"
            style={{ minHeight: 130 }}
            value={output}
            readOnly
            aria-label="Output"
          />
        </>
      )}
      <div className="btn-row">
        <button className={`btn btn-copy${copied ? " copied" : ""}`} onClick={copy} disabled={!output}>
          {copied ? "Copied ✓" : "Copy result"}
        </button>
      </div>
    </div>
  );
}
