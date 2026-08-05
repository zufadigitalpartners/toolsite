"use client";

import { useMemo, useState } from "react";
import { freelanceRate } from "@/lib/finance";

/* Works backwards from the life you want to the rate you must charge.
   The billable-hours default is deliberately low: new freelancers assume
   40 billable hours a week and there is no such thing. Admin, proposals,
   invoicing and finding the next client eat a third to a half of every
   week, unbilled. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

export default function FreelanceRateCalculator() {
  const [income, setIncome] = useState("60000");
  const [costs, setCosts] = useState("8000");
  const [billable, setBillable] = useState("22");
  const [weeksOff, setWeeksOff] = useState("6");

  const r = useMemo(() => {
    const weeksWorked = 52 - (Number(weeksOff) || 0);
    if (weeksWorked <= 0) return null;
    return freelanceRate({
      targetIncome: Number(income) || 0,
      annualCosts: Number(costs) || 0,
      billableHoursPerWeek: Number(billable) || 0,
      weeksWorked,
    });
  }, [income, costs, billable, weeksOff]);

  return (
    <div className="pdfw">
      <div className="field-row">
        <label>Income you want per year, before tax<input type="number" min="0" step="any" value={income} onChange={(e) => setIncome(e.target.value)} /></label>
        <label>Business costs per year<input type="number" min="0" step="any" value={costs} onChange={(e) => setCosts(e.target.value)} /></label>
      </div>
      <div className="field-row">
        <label>Billable hours per week<input type="number" min="1" max="60" step="any" value={billable} onChange={(e) => setBillable(e.target.value)} /></label>
        <label>Weeks off per year, holidays and sick<input type="number" min="0" max="30" step="any" value={weeksOff} onChange={(e) => setWeeksOff(e.target.value)} /></label>
      </div>
      <p className="note">
        Costs mean everything the business pays: software, hardware, insurance, accountant, coworking, that
        conference. Billable hours mean hours a client actually pays for, which is far fewer than hours worked.
      </p>

      {r && r.hourly > 0 && isFinite(r.hourly) && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.hourly)}</span><span className="s-label">Minimum hourly rate</span></div>
            <div className="stat"><span className="s-num">{fmt(r.day)}</span><span className="s-label">Day rate, 8 hours</span></div>
            <div className="stat"><span className="s-num">{fmt(r.billableHours)}</span><span className="s-label">Billable hours / year</span></div>
          </div>
          <p className="note">
            To take home {fmt(Number(income) || 0)} before tax, the business must bring in {fmt(r.revenueNeeded)}
            across {r.billableHours} billable hours, which floors your rate at {fmt(r.hourly)} an hour. Quote below
            it and the shortfall comes out of your evenings or your savings. Rates are rounded up on purpose;
            rounding down defeats the exercise. This floor is where negotiation starts, not where it ends: value
            pricing can take you well above it, and nothing here stops you charging more.
          </p>
          <p className="note">
            Remember tax: this is the pre-tax income figure. Your effective rate depends on your country and setup,
            so ask an accountant what to reserve, and add it to the income box rather than discovering it in April.
          </p>
        </>
      )}
    </div>
  );
}
