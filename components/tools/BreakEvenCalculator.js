"use client";

import { useMemo, useState } from "react";
import { breakEven } from "@/lib/finance";

/* How many do I have to sell before this stops costing me money.
   The margin-of-safety row appears once expected sales are given, because
   "we break even at 412" only matters relative to what you expect to sell. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));
const fmt2 = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n);

export default function BreakEvenCalculator() {
  const [fixed, setFixed] = useState("5000");
  const [price, setPrice] = useState("25");
  const [variable, setVariable] = useState("15");
  const [expected, setExpected] = useState("");

  const r = useMemo(() => {
    const f = Number(fixed) || 0;
    const p = Number(price) || 0;
    const v = Number(variable) || 0;
    if (f < 0 || p <= 0) return null;
    return breakEven(f, p, v);
  }, [fixed, price, variable]);

  const exp = Number(expected) || 0;

  return (
    <div className="pdfw">
      <div className="field-row">
        <label>Fixed costs per month<input type="number" min="0" step="any" value={fixed} onChange={(e) => setFixed(e.target.value)} /></label>
        <label>Selling price per unit<input type="number" min="0" step="any" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
        <label>Variable cost per unit<input type="number" min="0" step="any" value={variable} onChange={(e) => setVariable(e.target.value)} /></label>
        <label>Expected sales per month, optional<input type="number" min="0" step="any" value={expected} onChange={(e) => setExpected(e.target.value)} /></label>
      </div>
      <p className="note">
        Fixed costs happen whether you sell or not: rent, salaries, software, insurance. Variable costs happen per
        unit: materials, packaging, payment fees, shipping you pay for.
      </p>

      {r && !r.possible && (
        <div className="error-note">
          Each unit sells for less than it costs to make: the contribution is {fmt2(r.contribution)}. No sales
          volume fixes that; selling more loses more. The price must rise or the unit cost must fall before
          break-even exists at all.
        </div>
      )}

      {r && r.possible && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.units)}</span><span className="s-label">Units to break even</span></div>
            <div className="stat"><span className="s-num">{fmt(r.revenue)}</span><span className="s-label">Revenue at break-even</span></div>
            <div className="stat"><span className="s-num">{fmt2(r.contribution)}</span><span className="s-label">Contribution per unit</span></div>
          </div>
          <p className="note">
            Every sale contributes {fmt2(r.contribution)} ({r.contributionPct}% of the price) toward the fixed
            costs; after {fmt(r.units)} units the fixed costs are covered and each further sale is profit of
            {" "}{fmt2(r.contribution)}.
          </p>
          {exp > 0 && (
            exp >= r.unitsExact ? (
              <p className="note">
                At {fmt(exp)} expected sales you are {fmt(((exp - r.unitsExact) / exp) * 100)}% above break-even,
                which is your margin of safety: sales can fall that far before losses start. Expected profit:
                {" "}{fmt((exp - r.unitsExact) * r.contribution)} a month.
              </p>
            ) : (
              <div className="error-note">
                At {fmt(exp)} expected sales you are below break-even by {fmt(r.unitsExact - exp)} units, a loss of
                about {fmt((r.unitsExact - exp) * r.contribution)} a month. The levers, in the order they usually
                work: raise the price, cut the unit cost, then cut fixed costs.
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
