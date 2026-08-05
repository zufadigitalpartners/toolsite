"use client";

import { useMemo, useState } from "react";
import { vatAdd, vatRemove } from "@/lib/finance";

/* Add tax to a net price, or pull the tax out of a gross one. The second
   direction is the whole reason this tool exists: dividing by 1.18 is not
   the same as subtracting 18%, and receipts are reconciled wrongly every
   day because of it. */

const fmt = (n) => new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const PRESETS = [5, 10, 12, 15, 17, 18, 20, 25];

export default function VatCalculator() {
  const [mode, setMode] = useState("add");
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");

  const r = useMemo(() => {
    const a = Number(amount);
    const rt = Number(rate);
    if (!(a > 0) || !(rt >= 0)) return null;
    return mode === "add" ? vatAdd(a, rt) : vatRemove(a, rt);
  }, [mode, amount, rate]);

  return (
    <div className="pdfw">
      <div className="btn-row" role="tablist" aria-label="Direction">
        <button type="button" role="tab" aria-selected={mode === "add"}
          className={"btn" + (mode === "add" ? " btn-primary" : "")} onClick={() => setMode("add")}>
          Add tax to a net price
        </button>
        <button type="button" role="tab" aria-selected={mode === "remove"}
          className={"btn" + (mode === "remove" ? " btn-primary" : "")} onClick={() => setMode("remove")}>
          Take tax out of a gross price
        </button>
      </div>

      <div className="field-row">
        <label>
          {mode === "add" ? "Price before tax" : "Price including tax"}
          <input type="number" min="0" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>
          Tax rate %
          <input type="number" min="0" max="100" step="any" value={rate} onChange={(e) => setRate(e.target.value)} />
        </label>
      </div>
      <div className="btn-row">
        {PRESETS.map((p) => (
          <button key={p} type="button" className={"btn" + (Number(rate) === p ? " btn-primary" : "")}
            onClick={() => setRate(String(p))}>
            {p}%
          </button>
        ))}
      </div>

      {r && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.net)}</span><span className="s-label">Net, before tax</span></div>
            <div className="stat"><span className="s-num">{fmt(r.tax)}</span><span className="s-label">Tax at {rate}%</span></div>
            <div className="stat"><span className="s-num">{fmt(r.gross)}</span><span className="s-label">Gross, with tax</span></div>
          </div>
          {mode === "remove" && (
            <p className="note">
              The tax inside {fmt(r.gross)} is {fmt(r.tax)}, because the {rate}% was charged on the net {fmt(r.net)},
              not on the gross. Subtracting {rate}% of the gross would overstate the tax; that is the classic
              reconciliation error this direction exists to prevent.
            </p>
          )}
          <p className="note">
            Common rates: 20% UK VAT, 10% Australian GST, 5% Canadian GST, 19 to 25% across the EU, 18% Pakistan.
            Rates change by budget year and by goods; use the rate on your invoice. Computed on this device.
          </p>
        </>
      )}
    </div>
  );
}
