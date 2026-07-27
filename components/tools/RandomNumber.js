"use client";

import { useState } from "react";

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDup, setAllowDup] = useState(true);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    setError("");
    const lo = Math.ceil(Number(min));
    const hi = Math.floor(Number(max));
    const n = Math.max(1, Math.min(1000, Number(count) || 1));

    if (isNaN(lo) || isNaN(hi) || lo > hi) {
      setError("Minimum must be less than or equal to maximum.");
      return;
    }
    const rangeSize = hi - lo + 1;
    if (!allowDup && n > rangeSize) {
      setError(`Only ${rangeSize} unique numbers exist in this range. Reduce the count or allow duplicates.`);
      return;
    }

    const out = [];
    if (allowDup) {
      const vals = new Uint32Array(n);
      crypto.getRandomValues(vals);
      for (let i = 0; i < n; i++) out.push(lo + (vals[i] % rangeSize));
    } else {
      const pool = Array.from({ length: rangeSize }, (_, i) => lo + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const r = new Uint32Array(1);
        crypto.getRandomValues(r);
        const j = r[0] % (i + 1);
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      out.push(...pool.slice(0, n));
    }
    setResults(out);
    setCopied(false);
  }

  async function copy() {
    if (!results.length) return;
    try {
      await navigator.clipboard.writeText(results.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div>
      <div className="input-2col">
        <label style={{ display: "grid", gap: 6, fontWeight: 600, fontSize: "0.92rem" }}>
          Minimum
          <input className="tool-text" type="number" value={min} onChange={(e) => setMin(e.target.value)} />
        </label>
        <label style={{ display: "grid", gap: 6, fontWeight: 600, fontSize: "0.92rem" }}>
          Maximum
          <input className="tool-text" type="number" value={max} onChange={(e) => setMax(e.target.value)} />
        </label>
      </div>
      <div className="input-2col" style={{ marginTop: 14 }}>
        <label style={{ display: "grid", gap: 6, fontWeight: 600, fontSize: "0.92rem" }}>
          How many numbers?
          <input className="tool-text" type="number" min="1" max="1000" value={count} onChange={(e) => setCount(e.target.value)} />
        </label>
        <label className="check-row" style={{ alignSelf: "end", paddingBottom: 12 }}>
          <input type="checkbox" checked={allowDup} onChange={(e) => setAllowDup(e.target.checked)} />
          Allow duplicates
        </label>
      </div>

      {error && <div className="error-note">{error}</div>}

      {results.length > 0 && !error && (
        <div className="pw-output" style={{ marginTop: 16 }} aria-live="polite">
          {results.join(", ")}
        </div>
      )}

      <div className="btn-row">
        <button className="btn btn-primary" onClick={generate}>Generate</button>
        <button className={`btn btn-copy${copied ? " copied" : ""}`} onClick={copy} disabled={!results.length}>
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
    </div>
  );
}
