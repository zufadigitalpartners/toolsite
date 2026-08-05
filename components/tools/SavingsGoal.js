"use client";

import { useMemo, useState } from "react";
import { futureValue, monthlyForGoal, monthsToGoal } from "@/lib/finance";

/* One savings question, three directions:
   how much per month, how long will it take, or where do I end up.
   Same formula each time, solved for a different variable. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

const MODES = [
  { id: "monthly", label: "How much per month?" },
  { id: "time", label: "How long will it take?" },
  { id: "result", label: "What will I end up with?" },
];

function labelMonths(m) {
  if (!isFinite(m)) return "more than 100 years";
  const y = Math.floor(m / 12), r = m % 12;
  if (y === 0) return m + " month" + (m === 1 ? "" : "s");
  return y + " year" + (y === 1 ? "" : "s") + (r ? " " + r + " month" + (r === 1 ? "" : "s") : "");
}

export default function SavingsGoal() {
  const [mode, setMode] = useState("monthly");
  const [target, setTarget] = useState("20000");
  const [start, setStart] = useState("2000");
  const [monthly, setMonthly] = useState("300");
  const [years, setYears] = useState("3");
  const [ratePct, setRatePct] = useState("4");

  const r = useMemo(() => {
    const t = Number(target) || 0;
    const s = Number(start) || 0;
    const m = Number(monthly) || 0;
    const n = Math.round((Number(years) || 0) * 12);
    const rt = Number(ratePct) || 0;
    if (mode === "monthly") {
      if (t <= 0 || n <= 0) return null;
      if (s >= t) return { done: true };
      const need = monthlyForGoal(t, s, rt, n);
      return { need, interest: t - s - need * n, months: n };
    }
    if (mode === "time") {
      if (t <= 0) return null;
      if (s >= t) return { done: true };
      if (m <= 0) return { stuck: true };
      const months = monthsToGoal(t, s, m, rt);
      return { months, contributed: s + m * (isFinite(months) ? months : 0) };
    }
    if (n <= 0) return null;
    const fv = futureValue(s, m, rt, n);
    return { fv, contributed: s + m * n, growth: fv - s - m * n, months: n };
  }, [mode, target, start, monthly, years, ratePct]);

  return (
    <div className="pdfw">
      <div className="btn-row" role="tablist" aria-label="Question">
        {MODES.map((mo) => (
          <button key={mo.id} type="button" role="tab" aria-selected={mode === mo.id}
            className={"btn" + (mode === mo.id ? " btn-primary" : "")} onClick={() => setMode(mo.id)}>
            {mo.label}
          </button>
        ))}
      </div>

      <div className="field-row">
        {mode !== "result" && (
          <label>Target amount<input type="number" min="0" step="any" value={target} onChange={(e) => setTarget(e.target.value)} /></label>
        )}
        <label>Already saved<input type="number" min="0" step="any" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        {mode !== "monthly" && (
          <label>Saving per month<input type="number" min="0" step="any" value={monthly} onChange={(e) => setMonthly(e.target.value)} /></label>
        )}
        {mode !== "time" && (
          <label>Over how many years<input type="number" min="0.1" max="60" step="any" value={years} onChange={(e) => setYears(e.target.value)} /></label>
        )}
        <label>Interest % / year<input type="number" min="0" max="20" step="any" value={ratePct} onChange={(e) => setRatePct(e.target.value)} /></label>
      </div>

      {r?.done && <p className="note">You are already there: what you have saved meets the target. Set a bigger goal.</p>}
      {r?.stuck && <p className="note">With nothing going in monthly and the target above what you have, the answer is only as good as the interest, which would take a very long time. Add a monthly amount.</p>}

      {r && !r.done && !r.stuck && mode === "monthly" && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(Math.max(0, r.need))}</span><span className="s-label">Needed per month</span></div>
            <div className="stat"><span className="s-num">{fmt(Math.max(0, r.interest))}</span><span className="s-label">Interest does this much</span></div>
            <div className="stat"><span className="s-num">{labelMonths(r.months)}</span><span className="s-label">Timeline</span></div>
          </div>
          <p className="note">
            Save {fmt(Math.max(0, r.need))} a month at {ratePct}% and the target lands on schedule. The interest
            figure is honest about how little compounding does over short horizons; over three years the saving is
            what matters, and the rate barely does.
          </p>
        </>
      )}

      {r && !r.done && !r.stuck && mode === "time" && (
        <div className="stat-grid">
          <div className="stat"><span className="s-num">{labelMonths(r.months)}</span><span className="s-label">Time to target</span></div>
          <div className="stat"><span className="s-num">{fmt(r.contributed)}</span><span className="s-label">You will have put in</span></div>
        </div>
      )}

      {r && !r.done && mode === "result" && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.fv)}</span><span className="s-label">Final amount</span></div>
            <div className="stat"><span className="s-num">{fmt(r.contributed)}</span><span className="s-label">You put in</span></div>
            <div className="stat"><span className="s-num">{fmt(r.growth)}</span><span className="s-label">Growth</span></div>
          </div>
          <p className="note">
            Contributions land at the end of each month, which matches how standing orders behave. A savings
            account rate is guaranteed; an investment return is not, so treat the growth figure accordingly.
          </p>
        </>
      )}
    </div>
  );
}
