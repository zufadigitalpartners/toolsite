"use client";

import { useMemo, useState } from "react";
import { futureValue } from "@/lib/finance";

/* Financial independence: the number, the date, and the path drawn.

   FI number = annual spending / withdrawal rate. The chart is a plain
   inline SVG, no library: one path for the projected balance, one line
   for the target, and the crossing marked. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

export default function FireCalculator() {
  const [current, setCurrent] = useState("20000");
  const [monthly, setMonthly] = useState("800");
  const [returnPct, setReturnPct] = useState("7");
  const [spend, setSpend] = useState("30000");
  const [swr, setSwr] = useState("4");
  const [age, setAge] = useState("");

  const r = useMemo(() => {
    const start = Number(current) || 0;
    const m = Number(monthly) || 0;
    const ret = Number(returnPct) || 0;
    const annualSpend = Number(spend) || 0;
    const w = Number(swr) || 4;
    if (annualSpend <= 0 || w <= 0) return null;
    const target = (annualSpend / w) * 100;

    // walk monthly until the target is crossed, cap at 80 years
    let bal = start;
    let months = 0;
    const yearly = [{ year: 0, bal }];
    const rm = ret / 100 / 12;
    while (bal < target && months < 960) {
      months++;
      bal = bal * (1 + rm) + m;
      if (months % 12 === 0) yearly.push({ year: months / 12, bal });
    }
    if (bal >= target && months % 12 !== 0) yearly.push({ year: months / 12, bal });
    const reached = bal >= target;
    return {
      target,
      months,
      reached,
      yearly,
      monthlyIncomeAtFi: (target * w) / 100 / 12,
      never: !reached,
      fiAge: age ? Number(age) + months / 12 : null,
      contributions: start + m * months,
    };
  }, [current, monthly, returnPct, spend, swr, age]);

  const chart = useMemo(() => {
    if (!r || r.never || r.yearly.length < 2) return null;
    const W = 640, H = 220, P = 10;
    const maxY = Math.max(r.target * 1.15, r.yearly[r.yearly.length - 1].bal);
    const maxX = r.yearly[r.yearly.length - 1].year || 1;
    const x = (yr) => P + (yr / maxX) * (W - P * 2);
    const y = (v) => H - P - (v / maxY) * (H - P * 2);
    const path = r.yearly.map((p, i) => (i ? "L" : "M") + x(p.year).toFixed(1) + " " + y(p.bal).toFixed(1)).join(" ");
    return { W, H, path, targetY: y(r.target), fiX: x(r.months / 12), labels: { maxX, target: r.target } };
  }, [r]);

  return (
    <div className="pdfw">
      <div className="field-row">
        <label>Invested so far<input type="number" min="0" step="any" value={current} onChange={(e) => setCurrent(e.target.value)} /></label>
        <label>Invested per month<input type="number" min="0" step="any" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></label>
        <label>Expected return % / year<input type="number" min="0" max="20" step="any" value={returnPct} onChange={(e) => setReturnPct(e.target.value)} /></label>
      </div>
      <div className="field-row">
        <label>Your yearly spending<input type="number" min="0" step="any" value={spend} onChange={(e) => setSpend(e.target.value)} /></label>
        <label>Withdrawal rate %<input type="number" min="1" max="10" step="any" value={swr} onChange={(e) => setSwr(e.target.value)} /></label>
        <label>Your age now, optional<input type="number" min="0" max="100" value={age} onChange={(e) => setAge(e.target.value)} /></label>
      </div>

      {r && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.target)}</span><span className="s-label">Your FI number</span></div>
            <div className="stat">
              <span className="s-num">{r.never ? "80+ yrs" : (r.months / 12).toFixed(1) + " yrs"}</span>
              <span className="s-label">Time to reach it</span>
            </div>
            <div className="stat">
              <span className="s-num">{r.fiAge && !r.never ? Math.round(r.fiAge) : "–"}</span>
              <span className="s-label">Age at FI</span>
            </div>
          </div>

          {chart && (
            <div style={{ overflowX: "auto" }}>
              <svg viewBox={`0 0 ${chart.W} ${chart.H}`} width="100%" role="img"
                aria-label={`Projected portfolio reaching ${fmt(r.target)} in ${(r.months / 12).toFixed(1)} years`}>
                <line x1="0" y1={chart.targetY} x2={chart.W} y2={chart.targetY}
                  stroke="var(--muted)" strokeDasharray="5 5" strokeWidth="1" />
                <path d={chart.path} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" />
                <line x1={chart.fiX} y1="0" x2={chart.fiX} y2={chart.H} stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="1" />
                <text x="6" y={chart.targetY - 6} fontSize="12" fill="var(--muted)">FI: {fmt(r.target)}</text>
                <text x={chart.W - 6} y={chart.H - 4} fontSize="12" fill="var(--muted)" textAnchor="end">{chart.labels.maxX.toFixed(0)} years</text>
              </svg>
            </div>
          )}

          {r.never ? (
            <div className="error-note">
              At this saving rate the target is more than 80 years away. The two levers that actually move it:
              spending less, which shrinks the target AND frees more to invest, or investing more per month.
              The return assumption is the lever you do not control.
            </div>
          ) : (
            <p className="note">
              At {swr}% withdrawal, {fmt(r.target)} pays roughly {fmt(r.monthlyIncomeAtFi)} a month for life.
              Of the final pot, {fmt(r.contributions)} is money you put in; growth does the rest.
              This is a projection at a constant {returnPct}% return, which real markets never deliver smoothly.
              It maps the road; it does not promise the weather. Not financial advice.
            </p>
          )}
        </>
      )}
    </div>
  );
}
