"use client";

import { useEffect, useMemo, useState } from "react";
import { payoffPlan, round2 } from "@/lib/finance";

/* Multiple debts in, a dated plan out, snowball and avalanche side by side.

   The debts persist in localStorage because a debt list is slow to type
   and people come back monthly to watch it shrink. It stays on this device;
   that is the entire storage story. */

const LS_KEY = "tip-debts";
const emptyDebt = () => ({ name: "", balance: "", ratePct: "", min: "" });

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

function labelMonths(m) {
  if (!isFinite(m)) return "never";
  const y = Math.floor(m / 12);
  const r = m % 12;
  if (y === 0) return m + " month" + (m === 1 ? "" : "s");
  return y + " year" + (y === 1 ? "" : "s") + (r ? " " + r + " month" + (r === 1 ? "" : "s") : "");
}

export default function DebtPayoffPlanner() {
  const [debts, setDebts] = useState([emptyDebt()]);
  const [extra, setExtra] = useState("100");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (saved?.debts?.length) { setDebts(saved.debts); setExtra(saved.extra ?? "100"); }
    } catch { /* corrupt entry = fresh start */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify({ debts, extra })); } catch { /* private mode */ }
  }, [debts, extra]);

  const setD = (i, k, v) => setDebts((p) => p.map((d, j) => (j === i ? { ...d, [k]: v } : d)));

  const parsed = debts
    .map((d) => ({ name: d.name.trim() || "Debt", balance: Number(d.balance), ratePct: Number(d.ratePct), min: Number(d.min) }))
    .filter((d) => d.balance > 0 && d.min > 0 && d.ratePct >= 0);

  const result = useMemo(() => {
    if (!parsed.length) return null;
    const ex = Math.max(0, Number(extra) || 0);
    const snow = payoffPlan(parsed, ex, "snowball");
    const aval = payoffPlan(parsed, ex, "avalanche");
    const none = payoffPlan(parsed, 0, "avalanche");
    // A minimum at or below the monthly interest is worth flagging, but it
    // only *blocks* a plan when the simulation actually never finishes:
    // the extra budget often carries such a debt anyway.
    const tight = parsed.find((d) => d.min <= (d.balance * d.ratePct) / 100 / 12);
    const hopeless = !snow.finished || !aval.finished;
    return { snow, aval, none, tight, hopeless, ex };
  }, [JSON.stringify(parsed), extra]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalBalance = parsed.reduce((a, d) => a + d.balance, 0);
  const totalMin = parsed.reduce((a, d) => a + d.min, 0);

  return (
    <div className="pdfw">
      {debts.map((d, i) => (
        <div className="field-row" key={i}>
          <label style={{ flex: "1.4 1 150px" }}>
            {i === 0 ? "Debt name" : ""}
            <input type="text" value={d.name} placeholder={["Credit card", "Car loan", "Family loan"][i % 3]}
              onChange={(e) => setD(i, "name", e.target.value)} />
          </label>
          <label style={{ flex: "1 1 110px" }}>
            {i === 0 ? "Balance" : ""}
            <input type="number" min="0" step="any" value={d.balance} placeholder="5000"
              onChange={(e) => setD(i, "balance", e.target.value)} />
          </label>
          <label style={{ width: 110 }}>
            {i === 0 ? "Rate % / year" : ""}
            <input type="number" min="0" step="any" value={d.ratePct} placeholder="24"
              onChange={(e) => setD(i, "ratePct", e.target.value)} />
          </label>
          <label style={{ width: 130 }}>
            {i === 0 ? "Minimum / month" : ""}
            <input type="number" min="0" step="any" value={d.min} placeholder="150"
              onChange={(e) => setD(i, "min", e.target.value)} />
          </label>
          <button type="button" className="btn" aria-label={`Remove debt ${i + 1}`}
            disabled={debts.length === 1}
            onClick={() => setDebts((p) => p.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <div className="btn-row">
        <button type="button" className="btn" onClick={() => setDebts((p) => [...p, emptyDebt()])}>
          Add another debt
        </button>
        <button type="button" className="btn"
          onClick={() => { setDebts([emptyDebt()]); try { localStorage.removeItem(LS_KEY); } catch {} }}>
          Clear everything
        </button>
      </div>

      <div className="pdfw-opts">
        <label className="field-row">
          Extra you can pay each month, on top of the minimums
          <input type="number" min="0" step="any" value={extra} onChange={(e) => setExtra(e.target.value)} />
        </label>
        <p className="note">
          This list is saved in this browser only, so you can come back and update balances each month. Nothing is sent anywhere.
        </p>
      </div>

      {result?.hopeless && (
        <div className="error-note">
          With this budget the debts never reach zero: the payments cannot outrun the interest.
          {result.tight && ` The minimum on ${result.tight.name} does not cover its own monthly interest (${fmt((result.tight.balance * result.tight.ratePct) / 100 / 12)}), which is where the leak is.`}{" "}
          Raise the extra amount or that minimum and a real plan appears.
        </div>
      )}

      {result && !result.hopeless && result.tight && (
        <p className="note">
          Heads up: the minimum on {result.tight.name} barely covers its monthly interest
          ({fmt((result.tight.balance * result.tight.ratePct) / 100 / 12)}). The plan below still works because
          your extra budget carries it, which makes keeping that extra going non-negotiable.
        </p>
      )}

      {result && !result.hopeless && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(totalBalance)}</span><span className="s-label">Total debt</span></div>
            <div className="stat"><span className="s-num">{fmt(totalMin + result.ex)}</span><span className="s-label">Monthly budget</span></div>
            <div className="stat"><span className="s-num">{labelMonths(result.aval.months)}</span><span className="s-label">Debt free in</span></div>
          </div>

          <div className="table-scroll">
            <table className="mini-table">
              <thead>
                <tr><th>Plan</th><th>Debt free in</th><th>Total interest</th><th>What it means</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>Avalanche</td>
                  <td>{labelMonths(result.aval.months)}</td>
                  <td>{fmt(result.aval.totalInterest)}</td>
                  <td>Highest rate first. Cheapest in money.</td>
                </tr>
                <tr>
                  <td>Snowball</td>
                  <td>{labelMonths(result.snow.months)}</td>
                  <td>{fmt(result.snow.totalInterest)}</td>
                  <td>Smallest balance first. Fastest first win.</td>
                </tr>
                <tr>
                  <td>Minimums only</td>
                  <td>{result.none.finished ? labelMonths(result.none.months) : "100+ years"}</td>
                  <td>{fmt(result.none.totalInterest)}</td>
                  <td>What doing nothing extra costs.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {result.aval.totalInterest < result.snow.totalInterest - 0.5 && (
            <p className="note">
              Avalanche saves {fmt(result.snow.totalInterest - result.aval.totalInterest)} in interest over snowball
              here. Snowball's advantage is purely psychological: {result.snow.paidOff[0]?.name} disappears after{" "}
              {labelMonths(result.snow.paidOff[0]?.month || 0)}, and a visible win keeps many people going. Both beat
              minimums by {fmt(result.none.totalInterest - result.snow.totalInterest)} or more. Pick the one you will
              actually stick to.
            </p>
          )}

          <div className="table-scroll">
            <table className="mini-table">
              <thead><tr><th>Paid off</th><th>Avalanche</th><th>Snowball</th></tr></thead>
              <tbody>
                {parsed.map((d, i) => (
                  <tr key={i}>
                    <td>{d.name}</td>
                    <td>{labelMonths(result.aval.paidOff.find((p) => p.name === d.name && p.i === i)?.month ?? result.aval.paidOff.find((p) => p.i === i)?.month ?? 0)}</td>
                    <td>{labelMonths(result.snow.paidOff.find((p) => p.i === i)?.month ?? 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!parsed.length && (
        <p className="note">
          List each debt with its balance, yearly interest rate and minimum payment. The plan appears as soon as one
          debt is complete, and updates as you type.
        </p>
      )}
    </div>
  );
}
