"use client";

import { useMemo, useState } from "react";
import { amortize } from "@/lib/finance";

/* The whole life of a loan, one row per payment, and what extra payments
   do to it. The CSV button exists because the person who wants a schedule
   usually wants it in a spreadsheet next. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(n);
const fmt0 = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

export default function AmortizationSchedule() {
  const [principal, setPrincipal] = useState("250000");
  const [rate, setRate] = useState("6");
  const [years, setYears] = useState("30");
  const [extraM, setExtraM] = useState("0");
  const [lump, setLump] = useState("0");
  const [lumpMonth, setLumpMonth] = useState("12");
  const [showAll, setShowAll] = useState(false);

  const r = useMemo(() => {
    const P = Number(principal) || 0;
    const rt = Number(rate) || 0;
    const n = Math.round((Number(years) || 0) * 12);
    if (P <= 0 || n <= 0) return null;
    const base = amortize(P, rt, n);
    if (!base.coversInterest) return { impossible: true };
    const ex = Math.max(0, Number(extraM) || 0);
    const ls = Math.max(0, Number(lump) || 0);
    const lm = Math.max(1, Math.round(Number(lumpMonth) || 1));
    const withExtra = ex > 0 || ls > 0 ? amortize(P, rt, n, ex, ls, lm) : null;
    return { base, withExtra, P };
  }, [principal, rate, years, extraM, lump, lumpMonth]);

  const active = r?.withExtra || r?.base;

  const downloadCsv = () => {
    const head = "month,payment,principal,interest,extra,balance";
    const lines = active.rows.map((row) =>
      [row.month, row.payment, row.principal, row.interest, row.extra, row.balance].join(","));
    const url = URL.createObjectURL(new Blob([head + "\r\n" + lines.join("\r\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "amortization-schedule.csv";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
  };

  const shown = active ? (showAll ? active.rows : active.rows.slice(0, 12)) : [];

  return (
    <div className="pdfw">
      <div className="field-row">
        <label>Loan amount<input type="number" min="0" step="any" value={principal} onChange={(e) => setPrincipal(e.target.value)} /></label>
        <label>Rate % / year<input type="number" min="0" max="60" step="any" value={rate} onChange={(e) => setRate(e.target.value)} /></label>
        <label>Term in years<input type="number" min="0.5" max="50" step="any" value={years} onChange={(e) => setYears(e.target.value)} /></label>
      </div>
      <div className="field-row">
        <label>Extra every month<input type="number" min="0" step="any" value={extraM} onChange={(e) => setExtraM(e.target.value)} /></label>
        <label>One-time extra<input type="number" min="0" step="any" value={lump} onChange={(e) => setLump(e.target.value)} /></label>
        <label>...paid in month<input type="number" min="1" value={lumpMonth} onChange={(e) => setLumpMonth(e.target.value)} /></label>
      </div>

      {r?.impossible && (
        <div className="error-note">
          At that rate the standard payment would not cover the monthly interest, which means the term or rate is
          mistyped. Check whether the rate is yearly, not monthly.
        </div>
      )}

      {r && !r.impossible && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.base.payment)}</span><span className="s-label">Monthly payment</span></div>
            <div className="stat"><span className="s-num">{fmt0(active.totalInterest)}</span><span className="s-label">Total interest</span></div>
            <div className="stat">
              <span className="s-num">{Math.floor(active.months / 12)}y {active.months % 12}m</span>
              <span className="s-label">Paid off in</span>
            </div>
          </div>

          {r.withExtra && (
            <p className="note">
              The extra payments save {fmt0(r.base.totalInterest - r.withExtra.totalInterest)} in interest and
              finish the loan {r.base.months - r.withExtra.months} months early
              ({((r.base.months - r.withExtra.months) / 12).toFixed(1)} years). Every extra unit goes straight to
              principal, which is why the effect compounds.
            </p>
          )}

          <div className="table-scroll">
            <table className="mini-table">
              <thead>
                <tr><th>#</th><th>Payment</th><th>Principal</th><th>Interest</th>{r.withExtra && <th>Extra</th>}<th>Balance</th></tr>
              </thead>
              <tbody>
                {shown.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{fmt(row.payment)}</td>
                    <td>{fmt(row.principal)}</td>
                    <td>{fmt(row.interest)}</td>
                    {r.withExtra && <td>{row.extra ? fmt(row.extra) : ""}</td>}
                    <td>{fmt(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="btn-row">
            {active.rows.length > 12 && (
              <button type="button" className="btn" onClick={() => setShowAll(!showAll)}>
                {showAll ? "Show first year only" : `Show all ${active.rows.length} payments`}
              </button>
            )}
            <button type="button" className="btn btn-primary" onClick={downloadCsv}>
              Download schedule as CSV
            </button>
          </div>

          <p className="note">
            Early payments are mostly interest, late ones mostly principal; the schedule shows exactly where that
            flips. Computed on this device, nothing stored, nothing sent.
          </p>
        </>
      )}
    </div>
  );
}
