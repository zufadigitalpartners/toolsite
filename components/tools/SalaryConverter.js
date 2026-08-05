"use client";

import { useMemo, useState } from "react";

/* Hourly, daily, weekly, monthly, yearly: type any one, read the rest.
   One canonical value (yearly) computed from whichever box was edited
   last, so the numbers can never disagree with each other. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);

const FIELDS = [
  { id: "hourly", label: "Per hour" },
  { id: "daily", label: "Per day" },
  { id: "weekly", label: "Per week" },
  { id: "monthly", label: "Per month" },
  { id: "yearly", label: "Per year" },
];

export default function SalaryConverter() {
  const [edited, setEdited] = useState({ id: "hourly", value: "25" });
  const [hoursPerDay, setHoursPerDay] = useState("8");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [weeksPerYear, setWeeksPerYear] = useState("52");

  const values = useMemo(() => {
    const v = Number(edited.value);
    const hpd = Number(hoursPerDay) || 8;
    const dpw = Number(daysPerWeek) || 5;
    const wpy = Number(weeksPerYear) || 52;
    if (!(v > 0)) return null;
    const toYear = {
      hourly: v * hpd * dpw * wpy,
      daily: v * dpw * wpy,
      weekly: v * wpy,
      monthly: v * 12,
      yearly: v,
    }[edited.id];
    return {
      hourly: toYear / (hpd * dpw * wpy),
      daily: toYear / (dpw * wpy),
      weekly: toYear / wpy,
      monthly: toYear / 12,
      yearly: toYear,
    };
  }, [edited, hoursPerDay, daysPerWeek, weeksPerYear]);

  return (
    <div className="pdfw">
      <div className="field-row">
        {FIELDS.map((f) => (
          <label key={f.id} style={{ flex: "1 1 120px" }}>
            {f.label}
            <input
              type="number" min="0" step="any"
              value={edited.id === f.id ? edited.value : values ? String(Math.round(values[f.id] * 100) / 100) : ""}
              onChange={(e) => setEdited({ id: f.id, value: e.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="field-row">
        <label>Hours per day<input type="number" min="1" max="24" step="any" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} /></label>
        <label>Days per week<input type="number" min="1" max="7" step="any" value={daysPerWeek} onChange={(e) => setDaysPerWeek(e.target.value)} /></label>
        <label>Paid weeks per year<input type="number" min="1" max="53" step="any" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} /></label>
      </div>

      {values && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(values.hourly)}</span><span className="s-label">Hourly</span></div>
            <div className="stat"><span className="s-num">{fmt(values.monthly)}</span><span className="s-label">Monthly</span></div>
            <div className="stat"><span className="s-num">{fmt(values.yearly)}</span><span className="s-label">Yearly</span></div>
          </div>
          <p className="note">
            Type in whichever box matches the offer you received; every other box converts instantly using your
            hours and weeks. The defaults are the standard full-time week. Comparing a salaried offer against
            contracting? Set paid weeks to what you would really invoice, not 52, and watch the hourly figure move.
            Works in any currency because it never asks which one.
          </p>
        </>
      )}
    </div>
  );
}
