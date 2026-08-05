"use client";

import { useMemo, useState } from "react";
import { emi, round2 } from "@/lib/finance";

/* Two offers side by side, including the fees banks quote in a whisper.
   Total cost = monthly payment × months + upfront fees, which is the only
   number that makes two different structures comparable. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));
const fmt2 = (n) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const blank = { amount: "", rate: "", years: "", fees: "0" };

/* Hoisted, not defined inside the component: an inner component gets a new
   identity every render, which remounts its inputs and drops focus after
   every keystroke. */
function Col({ title, l, set }) {
  return (
    <div style={{ flex: "1 1 240px" }}>
      <h3 style={{ margin: "0 0 8px", fontSize: "var(--t-15)" }}>{title}</h3>
      <div className="field-row" style={{ flexDirection: "column", alignItems: "stretch", gap: "var(--s2)" }}>
        <label>Amount<input type="number" min="0" step="any" value={l.amount} onChange={(e) => set({ ...l, amount: e.target.value })} /></label>
        <label>Rate % / year<input type="number" min="0" step="any" value={l.rate} onChange={(e) => set({ ...l, rate: e.target.value })} /></label>
        <label>Term, years<input type="number" min="0.5" step="any" value={l.years} onChange={(e) => set({ ...l, years: e.target.value })} /></label>
        <label>Upfront fees<input type="number" min="0" step="any" value={l.fees} onChange={(e) => set({ ...l, fees: e.target.value })} /></label>
      </div>
    </div>
  );
}

export default function LoanComparison() {
  const [a, setA] = useState({ ...blank, amount: "200000", rate: "6.5", years: "20" });
  const [b, setB] = useState({ ...blank, amount: "200000", rate: "5.9", years: "20", fees: "3000" });

  const calc = (l) => {
    const P = Number(l.amount) || 0;
    const rt = Number(l.rate) || 0;
    const n = Math.round((Number(l.years) || 0) * 12);
    const fees = Number(l.fees) || 0;
    if (P <= 0 || n <= 0) return null;
    const m = emi(P, rt, n);
    return { payment: round2(m), months: n, totalPaid: round2(m * n + fees), interest: round2(m * n - P), fees };
  };

  const ra = useMemo(() => calc(a), [a]);
  const rb = useMemo(() => calc(b), [b]);

  const verdict = useMemo(() => {
    if (!ra || !rb) return null;
    const diff = ra.totalPaid - rb.totalPaid;
    const cheaper = diff > 0 ? "B" : "A";
    const monthlyDiff = ra.payment - rb.payment;
    // If B costs fees upfront but saves monthly, when does it break even?
    let breakEvenMonth = null;
    const feeGap = rb.fees - ra.fees;
    if (feeGap > 0 && monthlyDiff > 0) breakEvenMonth = Math.ceil(feeGap / monthlyDiff);
    return { diff: Math.abs(diff), cheaper, monthlyDiff, breakEvenMonth };
  }, [ra, rb]);

  return (
    <div className="pdfw">
      <div className="field-row" style={{ alignItems: "start" }}>
        <Col title="Loan A" l={a} set={setA} />
        <Col title="Loan B" l={b} set={setB} />
      </div>

      {ra && rb && (
        <>
          <div className="table-scroll">
            <table className="mini-table">
              <thead><tr><th></th><th>Loan A</th><th>Loan B</th></tr></thead>
              <tbody>
                <tr><th>Monthly payment</th><td>{fmt2(ra.payment)}</td><td>{fmt2(rb.payment)}</td></tr>
                <tr><th>Total interest</th><td>{fmt(ra.interest)}</td><td>{fmt(rb.interest)}</td></tr>
                <tr><th>Upfront fees</th><td>{fmt(ra.fees)}</td><td>{fmt(rb.fees)}</td></tr>
                <tr><th>True total cost</th><td><b>{fmt(ra.totalPaid)}</b></td><td><b>{fmt(rb.totalPaid)}</b></td></tr>
              </tbody>
            </table>
          </div>

          {verdict && verdict.diff > 1 && (
            <div className="stat-grid">
              <div className="stat"><span className="s-num">Loan {verdict.cheaper}</span><span className="s-label">Cheaper overall</span></div>
              <div className="stat"><span className="s-num">{fmt(verdict.diff)}</span><span className="s-label">Saved over the term</span></div>
              {verdict.breakEvenMonth && (
                <div className="stat">
                  <span className="s-num">{verdict.breakEvenMonth} months</span>
                  <span className="s-label">B's fees pay for themselves</span>
                </div>
              )}
            </div>
          )}

          {verdict?.breakEvenMonth && (
            <p className="note">
              Loan B charges {fmt(rb.fees - ra.fees)} more upfront but {fmt2(verdict.monthlyDiff)} less per month, so
              it breaks even after {verdict.breakEvenMonth} months. Planning to sell or refinance before then? Loan A
              wins despite the higher rate. This is the arithmetic behind every refinancing decision.
            </p>
          )}
          <p className="note">
            Compare the true total cost row, not the rate. A lower rate with high fees regularly loses to a plain
            higher rate, which is exactly why the fees are quoted quietly. Nothing you type here is stored or sent.
          </p>
        </>
      )}
    </div>
  );
}
