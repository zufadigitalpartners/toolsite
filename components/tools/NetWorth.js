"use client";

import { useEffect, useMemo, useState } from "react";

/* Assets minus liabilities, itemized, saved on this device. The yearly
   habit that tells you whether the whole machine is moving forward. */

const LS_KEY = "tip-networth";
const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));
const row = (name = "") => ({ name, value: "" });

const ASSET_HINTS = ["Home value", "Car", "Savings", "Investments", "Gold"];
const DEBT_HINTS = ["Mortgage balance", "Car loan", "Credit cards", "Money owed"];

function Section({ title, hints, rows, setRows }) {
  const set = (i, k, v) => setRows((p) => p.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  return (
    <div style={{ flex: "1 1 280px" }}>
      <h3 style={{ margin: "0 0 8px", fontSize: "var(--t-15)" }}>{title}</h3>
      {rows.map((r, i) => (
        <div className="field-row" key={i} style={{ margin: "0 0 6px" }}>
          <label style={{ flex: "1.4 1 120px" }}>
            <input type="text" value={r.name} placeholder={hints[i % hints.length]}
              onChange={(e) => set(i, "name", e.target.value)} aria-label={`${title} name ${i + 1}`} />
          </label>
          <label style={{ flex: "1 1 100px" }}>
            <input type="number" min="0" step="any" inputMode="decimal" value={r.value} placeholder="0"
              onChange={(e) => set(i, "value", e.target.value)} aria-label={`${title} value ${i + 1}`} />
          </label>
          <button type="button" className="btn" aria-label={`Remove ${title} row ${i + 1}`}
            disabled={rows.length === 1}
            onClick={() => setRows((p) => p.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => setRows((p) => [...p, row()])}>Add row</button>
    </div>
  );
}

export default function NetWorth() {
  const [assets, setAssets] = useState([row()]);
  const [debts, setDebts] = useState([row()]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (s?.assets?.length) { setAssets(s.assets); setDebts(s.debts?.length ? s.debts : [row()]); }
    } catch { /* fresh start */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ assets, debts })); } catch { /* private mode */ }
  }, [assets, debts]);

  const t = useMemo(() => {
    const sum = (rows) => rows.reduce((a, r) => a + (Number(r.value) || 0), 0);
    return { assets: sum(assets), debts: sum(debts) };
  }, [assets, debts]);

  const net = t.assets - t.debts;
  const any = t.assets > 0 || t.debts > 0;

  return (
    <div className="pdfw">
      <div className="field-row" style={{ alignItems: "start" }}>
        <Section title="What you own" hints={ASSET_HINTS} rows={assets} setRows={setAssets} />
        <Section title="What you owe" hints={DEBT_HINTS} rows={debts} setRows={setDebts} />
      </div>

      {any && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(t.assets)}</span><span className="s-label">Assets</span></div>
            <div className="stat"><span className="s-num">{fmt(t.debts)}</span><span className="s-label">Liabilities</span></div>
            <div className="stat"><span className="s-num">{fmt(net)}</span><span className="s-label">Net worth</span></div>
          </div>
          <p className="note">
            {net >= 0
              ? "One number for the whole machine. It matters far less than its direction: write it down, come back in six months, and compare. The list is saved in this browser only, so updating takes a minute."
              : "A negative net worth is common early on, especially with a mortgage or student debt against a young career. The number to watch is the trend: paying debt and saving both move it the same direction. The list is saved in this browser only."}
          </p>
          <div className="btn-row">
            <button type="button" className="btn"
              onClick={() => { setAssets([row()]); setDebts([row()]); try { localStorage.removeItem(LS_KEY); } catch {} }}>
              Clear everything
            </button>
          </div>
        </>
      )}
      {!any && (
        <p className="note">
          Value what you own at what it would sell for today, not what you paid. Balances of what you owe come from
          the latest statements. Everything stays on this device; nothing is uploaded.
        </p>
      )}
    </div>
  );
}
