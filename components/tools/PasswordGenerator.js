"use client";

import { useState } from "react";

const SETS = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lower: "abcdefghijkmnopqrstuvwxyz",
  numbers: "23456789",
  symbols: "!@#$%^&*-_=+?",
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  function toggle(key) {
    const next = { ...opts, [key]: !opts[key] };
    if (Object.values(next).some(Boolean)) setOpts(next);
  }

  function generate() {
    const pool = Object.keys(SETS).filter((k) => opts[k]).map((k) => SETS[k]).join("");
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    let out = "";
    for (let i = 0; i < length; i++) out += pool[values[i] % pool.length];
    setPassword(out);
    setCopied(false);
  }

  async function copy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div>
      <div className="pw-output" aria-live="polite">
        {password || "Click “Generate password” to start"}
      </div>

      <div className="pw-controls">
        <label>
          Length <span className="pw-len">{length}</span>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </label>
        <label>
          <input type="checkbox" checked={opts.upper} onChange={() => toggle("upper")} />
          Uppercase letters (A–Z)
        </label>
        <label>
          <input type="checkbox" checked={opts.lower} onChange={() => toggle("lower")} />
          Lowercase letters (a–z)
        </label>
        <label>
          <input type="checkbox" checked={opts.numbers} onChange={() => toggle("numbers")} />
          Numbers (2–9)
        </label>
        <label>
          <input type="checkbox" checked={opts.symbols} onChange={() => toggle("symbols")} />
          Symbols (!@#$…)
        </label>
      </div>

      <div className="btn-row">
        <button className="btn btn-primary" onClick={generate}>Generate password</button>
        <button className={`btn btn-copy${copied ? " copied" : ""}`} onClick={copy}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
