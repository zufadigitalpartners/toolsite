"use client";

import { useMemo, useState } from "react";
import { averageCost } from "@/lib/crypto";

/* A messy series of buys and sells becomes one honest average cost and
   break-even price. Sells reduce holdings at average cost, the common
   portfolio convention, and the page says so. */

const fmt = (n, d = 2) => new Intl.NumberFormat("en-US", { maximumFractionDigits: d, minimumFractionDigits: Math.min(d, 2) }).format(n);
const emptyRow = () => ({ type: "buy", amount: "", price: "" });

export default function CryptoAverageCost() {
  const [rows, setRows] = useState([emptyRow()]);
  const [current, setCurrent] = useState("");

  const setR = (i, k, v) => setRows((p) => p.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const r = useMemo(() => {
    const entries = rows.map((x) => ({ type: x.type, amount: Number(x.amount), price: Number(x.price) }));
    if (!entries.some((e) => e.amount > 0)) return null;
    return averageCost(entries, Number(current) || 0);
  }, [rows, current]);

  return (
    <div className="pdfw">
      {rows.map((row, i) => (
        <div className="field-row" key={i}>
          <label style={{ width: 110 }}>
            {i === 0 ? "Type" : ""}
            <select value={row.type} onChange={(e) => setR(i, "type", e.target.value)}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </label>
          <label style={{ flex: "1 1 130px" }}>
            {i === 0 ? "Coins" : ""}
            <input type="number" min="0" step="any" inputMode="decimal" value={row.amount}
              placeholder="0.5" onChange={(e) => setR(i, "amount", e.target.value)} />
          </label>
          <label style={{ flex: "1 1 130px" }}>
            {i === 0 ? "Price per coin" : ""}
            <input type="number" min="0" step="any" inputMode="decimal" value={row.price}
              placeholder="42000" onChange={(e) => setR(i, "price", e.target.value)} />
          </label>
          <button type="button" className="btn" aria-label={`Remove row ${i + 1}`}
            disabled={rows.length === 1}
            onClick={() => setRows((p) => p.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <div className="btn-row">
        <button type="button" className="btn" onClick={() => setRows((p) => [...p, emptyRow()])}>
          Add a trade
        </button>
      </div>
      <div className="field-row">
        <label style={{ flex: "1 1 200px" }}>
          Current price, optional
          <input type="number" min="0" step="any" inputMode="decimal" value={current}
            placeholder="for the profit line" onChange={(e) => setCurrent(e.target.value)} />
        </label>
      </div>

      {r && r.coins > 0 && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.avgCost, r.avgCost < 10 ? 4 : 2)}</span><span className="s-label">Average cost, break-even</span></div>
            <div className="stat"><span className="s-num">{fmt(r.coins, 6)}</span><span className="s-label">Coins held</span></div>
            <div className="stat"><span className="s-num">{fmt(r.totalCost)}</span><span className="s-label">Money in</span></div>
          </div>
          {Number(current) > 0 && (
            <div className="stat-grid">
              <div className="stat"><span className="s-num">{fmt(r.value)}</span><span className="s-label">Value now</span></div>
              <div className="stat"><span className="s-num">{(r.unrealized >= 0 ? "+" : "") + fmt(r.unrealized)}</span><span className="s-label">Unrealized P/L</span></div>
              <div className="stat"><span className="s-num">{(r.unrealizedPct >= 0 ? "+" : "") + fmt(r.unrealizedPct, 2) + "%"}</span><span className="s-label">Against cost</span></div>
            </div>
          )}
          {r.realized !== 0 && (
            <p className="note">
              Realized so far from sells: {(r.realized >= 0 ? "+" : "") + fmt(r.realized)}. Sells here reduce the
              position at its average cost, the common portfolio convention. Tax rules in many countries use FIFO
              or specific lots instead, so use your jurisdiction&apos;s method for tax reporting.
            </p>
          )}
          <p className="note">
            Your break-even is the average cost: above it the position is green. Averaging down moves it, and this
            list shows exactly where it lands before you place the order. Nothing entered here leaves this device.
          </p>
        </>
      )}
    </div>
  );
}
