"use client";

import { useMemo, useState } from "react";
import { zakat, NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from "@/lib/finance";

/* Zakat on wealth: assets minus debts, checked against nisab, 2.5% if due.

   Gold and silver prices are typed in, not fetched, for two reasons. The
   honest one: this site calls no servers, and a stale bundled price would
   be worse than asking. The practical one: the correct price is the one in
   your local market in your currency today, which you know and we cannot.

   The constants are the classical ones: nisab at 87.48 g of gold or
   612.36 g of silver, zakat at 2.5% of net zakatable wealth held for a
   lunar year. Schools of thought differ on details; the disclaimer says
   so plainly. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

export default function ZakatCalculator() {
  const [cash, setCash] = useState("");
  const [goldGrams, setGoldGrams] = useState("");
  const [goldPrice, setGoldPrice] = useState("");
  const [silverGrams, setSilverGrams] = useState("");
  const [silverPrice, setSilverPrice] = useState("");
  const [business, setBusiness] = useState("");
  const [receivables, setReceivables] = useState("");
  const [investments, setInvestments] = useState("");
  const [liabilities, setLiabilities] = useState("");
  const [basis, setBasis] = useState("silver");

  const r = useMemo(() => {
    const n = (v) => Math.max(0, Number(v) || 0);
    const goldP = n(goldPrice);
    const silverP = n(silverPrice);
    // The chosen basis needs its metal's price to compute nisab at all.
    if (basis === "gold" && goldP <= 0) return { needPrice: "gold" };
    if (basis === "silver" && silverP <= 0) return { needPrice: "silver" };
    return zakat({
      cash: n(cash),
      goldGrams: n(goldGrams),
      goldPricePerGram: goldP,
      silverGrams: n(silverGrams),
      silverPricePerGram: silverP,
      business: n(business),
      receivables: n(receivables),
      investments: n(investments),
      liabilities: n(liabilities),
      nisabBasis: basis,
    });
  }, [cash, goldGrams, goldPrice, silverGrams, silverPrice, business, receivables, investments, liabilities, basis]);

  const anyInput = [cash, goldGrams, business, receivables, investments].some((v) => Number(v) > 0);

  return (
    <div className="pdfw">
      <div className="field-row">
        <label>Cash, in hand and in banks<input type="number" min="0" step="any" value={cash} onChange={(e) => setCash(e.target.value)} /></label>
        <label>Business stock value<input type="number" min="0" step="any" value={business} onChange={(e) => setBusiness(e.target.value)} /></label>
        <label>Money owed to you<input type="number" min="0" step="any" value={receivables} onChange={(e) => setReceivables(e.target.value)} /></label>
        <label>Shares and investments<input type="number" min="0" step="any" value={investments} onChange={(e) => setInvestments(e.target.value)} /></label>
      </div>
      <div className="field-row">
        <label>Gold, grams<input type="number" min="0" step="any" value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} /></label>
        <label>Gold price per gram today<input type="number" min="0" step="any" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} /></label>
        <label>Silver, grams<input type="number" min="0" step="any" value={silverGrams} onChange={(e) => setSilverGrams(e.target.value)} /></label>
        <label>Silver price per gram today<input type="number" min="0" step="any" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} /></label>
      </div>
      <div className="field-row">
        <label>Debts you owe, due now<input type="number" min="0" step="any" value={liabilities} onChange={(e) => setLiabilities(e.target.value)} /></label>
        <label>
          Nisab basis
          <select value={basis} onChange={(e) => setBasis(e.target.value)}>
            <option value="silver">Silver, {NISAB_SILVER_GRAMS} g. Lower threshold, more people pay. Most scholars advise this.</option>
            <option value="gold">Gold, {NISAB_GOLD_GRAMS} g</option>
          </select>
        </label>
      </div>

      {r?.needPrice && anyInput && (
        <p className="note">
          Enter today's {r.needPrice} price per gram in your currency to set the nisab threshold. Any jeweller's
          site or today's paper has it; type the number as it is quoted.
        </p>
      )}

      {r && !r.needPrice && anyInput && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.net)}</span><span className="s-label">Zakatable wealth</span></div>
            <div className="stat"><span className="s-num">{fmt(r.nisab)}</span><span className="s-label">Nisab threshold</span></div>
            <div className="stat"><span className="s-num">{r.due ? fmt(r.amount) : "0"}</span><span className="s-label">Zakat due, 2.5%</span></div>
          </div>

          {r.due ? (
            <p className="note">
              Your net zakatable wealth of {fmt(r.net)} is at or above the nisab of {fmt(r.nisab)}, so zakat applies
              at 2.5%: {fmt(r.amount)}. This assumes the wealth has been held for one full lunar year.
            </p>
          ) : (
            <p className="note">
              Your net zakatable wealth of {fmt(r.net)} is below the nisab of {fmt(r.nisab)} on the {basis} basis,
              so zakat is not obligatory on it. Recheck when your savings cross the threshold.
            </p>
          )}

          <p className="note">
            This calculator does the arithmetic with the classical constants; it is not a fatwa. Rulings differ on
            personal-use gold, on which debts deduct, and on business assets. For anything beyond straightforward
            savings, confirm with a scholar you trust. Everything you typed stays on this device.
          </p>
        </>
      )}

      {!anyInput && (
        <p className="note">
          Fill in what you own and the calculation appears. Personal items you use, your home and your car are not
          zakatable and do not belong in these fields.
        </p>
      )}
    </div>
  );
}
