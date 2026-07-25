"use client";

import { useState } from "react";

export default function DateDifference() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  let result = null;
  if (start && end) {
    const a = new Date(start + "T00:00:00");
    const b = new Date(end + "T00:00:00");
    if (!isNaN(a) && !isNaN(b)) {
      const from = a <= b ? a : b;
      const to = a <= b ? b : a;
      const totalDays = Math.round((to - from) / 86400000);

      let years = to.getFullYear() - from.getFullYear();
      let months = to.getMonth() - from.getMonth();
      let days = to.getDate() - from.getDate();
      if (days < 0) {
        months -= 1;
        days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      result = { totalDays, weeks: Math.floor(totalDays / 7), years, months, days };
    }
  }

  return (
    <div>
      <div className="input-2col">
        <label className="input-row" style={{ display: "grid", gap: 6, fontWeight: 600, fontSize: "0.92rem" }}>
          Start date
          <input className="tool-text" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label style={{ display: "grid", gap: 6, fontWeight: 600, fontSize: "0.92rem" }}>
          End date
          <input className="tool-text" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>

      {result && (
        <div className="stat-grid">
          <div className="stat"><div className="s-num">{result.totalDays.toLocaleString()}</div><div className="s-label">Total days</div></div>
          <div className="stat"><div className="s-num">{result.weeks.toLocaleString()}</div><div className="s-label">Weeks</div></div>
          <div className="stat"><div className="s-num">{result.years}</div><div className="s-label">Years</div></div>
          <div className="stat"><div className="s-num">{result.months}</div><div className="s-label">Months</div></div>
          <div className="stat"><div className="s-num">{result.days}</div><div className="s-label">Days</div></div>
        </div>
      )}
      {!result && <p className="result-note">Pick both dates to see the difference.</p>}
    </div>
  );
}
