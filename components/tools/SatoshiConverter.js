"use client";

import { useMemo, useState } from "react";
import { btcConvert, SATS_PER_BTC } from "@/lib/crypto";

/* BTC ↔ sats ↔ mBTC ↔ µBTC, plus value at a price you type. Integer sats
   internally, so the unit lines can never disagree by a float hair. */

const fmt = (n, d = 0) => new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(n);

const UNITS = [
  { id: "btc", label: "BTC", decimals: 8 },
  { id: "mbtc", label: "mBTC", decimals: 5 },
  { id: "ubtc", label: "µBTC (bits)", decimals: 2 },
  { id: "sats", label: "Satoshi", decimals: 0 },
];

export default function SatoshiConverter() {
  const [edited, setEdited] = useState({ unit: "btc", value: "0.1" });
  const [price, setPrice] = useState("");

  const r = useMemo(() => {
    const v = Number(edited.value);
    if (!(v >= 0)) return null;
    return btcConvert({ value: v, unit: edited.unit });
  }, [edited]);

  const p = Number(price) || 0;

  return (
    <div className="pdfw">
      <div className="field-row">
        {UNITS.map((u) => (
          <label key={u.id} style={{ flex: "1 1 130px" }}>
            {u.label}
            <input
              type="number" min="0" step="any" inputMode="decimal"
              value={edited.unit === u.id ? edited.value : r ? String(r[u.id]) : ""}
              onChange={(e) => setEdited({ unit: u.id, value: e.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="field-row">
        <label style={{ flex: "1 1 200px" }}>
          BTC price in your currency, optional
          <input type="number" min="0" step="any" inputMode="decimal" value={price}
            placeholder="e.g. 65000" onChange={(e) => setPrice(e.target.value)} />
        </label>
      </div>

      {r && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.sats)}</span><span className="s-label">Satoshi</span></div>
            <div className="stat"><span className="s-num">{r.btc.toFixed(8).replace(/0+$/, "").replace(/\.$/, "") || "0"}</span><span className="s-label">BTC</span></div>
            {p > 0 && (
              <div className="stat"><span className="s-num">{fmt(r.btc * p, 2)}</span><span className="s-label">Value at your price</span></div>
            )}
          </div>
          <p className="note">
            One bitcoin is exactly {fmt(SATS_PER_BTC)} satoshi; a millibitcoin is 100,000 sats and a bit is 100.
            The conversion runs in whole satoshi underneath, so the lines always agree exactly. No price is fetched:
            type today&apos;s price if you want the value line, and nothing you enter leaves this device.
          </p>
        </>
      )}
    </div>
  );
}
