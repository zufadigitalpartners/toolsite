"use client";

import { useMemo, useState } from "react";
import { zakat, GRAMS_PER_TOLA, NISAB_GOLD_GRAMS, NISAB_SILVER_GRAMS } from "@/lib/finance";

/* Zakat on wealth: assets minus due debts, checked against nisab, 2.5%.

   Two decisions came from watching this tool confuse its first users.

   Tola first: in Pakistan and across South Asia nobody owns "87 grams"
   of gold, they own 7.5 tola, and the classical nisab constants ARE tola
   figures (7.5 tola gold, 52.5 tola silver, at 11.664 g each). The unit
   toggle speaks both languages and converts exactly.

   Nisab as a typed amount second: authorities publish each year's nisab
   as a currency figure, and a cash-only user should never be blocked by
   a silver-price field they do not understand. Choose the published-
   amount option, type it, done. The metal-basis options remain for
   people who prefer to derive it from today's price. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));

export default function ZakatCalculator() {
  const [unit, setUnit] = useState("tola");
  const [cash, setCash] = useState("");
  const [goldQty, setGoldQty] = useState("");
  const [goldPrice, setGoldPrice] = useState("");
  const [silverQty, setSilverQty] = useState("");
  const [silverPrice, setSilverPrice] = useState("");
  const [business, setBusiness] = useState("");
  const [receivables, setReceivables] = useState("");
  const [investments, setInvestments] = useState("");
  const [liabilities, setLiabilities] = useState("");
  const [basis, setBasis] = useState("amount");
  const [nisabAmount, setNisabAmount] = useState("");

  const toGrams = unit === "tola" ? GRAMS_PER_TOLA : 1;
  const unitLabel = unit === "tola" ? "tola" : "grams";

  const r = useMemo(() => {
    const n = (v) => Math.max(0, Number(v) || 0);
    // Prices arrive per chosen unit; the lib thinks in grams.
    const goldPerGram = n(goldPrice) / toGrams;
    const silverPerGram = n(silverPrice) / toGrams;

    if (basis === "amount" && !(n(nisabAmount) > 0)) return { need: "amount" };
    if (basis === "gold" && !(goldPerGram > 0)) return { need: "gold" };
    if (basis === "silver" && !(silverPerGram > 0)) return { need: "silver" };
    // Metals owned need their price to be valued, whatever the nisab basis.
    if (n(goldQty) > 0 && !(goldPerGram > 0)) return { need: "goldValue" };
    if (n(silverQty) > 0 && !(silverPerGram > 0)) return { need: "silverValue" };

    return zakat({
      cash: n(cash),
      goldGrams: n(goldQty) * toGrams,
      goldPricePerGram: goldPerGram,
      silverGrams: n(silverQty) * toGrams,
      silverPricePerGram: silverPerGram,
      business: n(business),
      receivables: n(receivables),
      investments: n(investments),
      liabilities: n(liabilities),
      nisabBasis: basis,
      nisabValue: basis === "amount" ? n(nisabAmount) : 0,
    });
  }, [unit, cash, goldQty, goldPrice, silverQty, silverPrice, business, receivables, investments, liabilities, basis, nisabAmount, toGrams]);

  const anyInput = [cash, goldQty, silverQty, business, receivables, investments].some((v) => Number(v) > 0);

  const NEED_MESSAGES = {
    amount: "Enter this year's nisab amount in your currency. It is published every year; searching \"nisab today\" with your country's name finds it in seconds.",
    gold: `Enter today's gold price per ${unitLabel} to set the nisab threshold from it. Or switch the nisab option to the published amount and type that instead.`,
    silver: `Enter today's silver price per ${unitLabel} to set the nisab threshold from it. Or switch the nisab option to the published amount and type that instead.`,
    goldValue: `You listed gold, so its value needs today's gold price per ${unitLabel}. Any jeweller's listing has it.`,
    silverValue: `You listed silver, so its value needs today's silver price per ${unitLabel}.`,
  };

  return (
    <div className="pdfw">
      <div className="pdfw-opts" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
        <p className="note" style={{ marginTop: 0 }}><b>1.</b> What you own on your zakat date. Leave anything you do not have at zero.</p>
        <div className="field-row">
          <label>Cash, in hand and in banks<input type="number" min="0" step="any" inputMode="decimal" value={cash} onChange={(e) => setCash(e.target.value)} /></label>
          <label>Business stock value<input type="number" min="0" step="any" inputMode="decimal" value={business} onChange={(e) => setBusiness(e.target.value)} /></label>
          <label>Money owed to you<input type="number" min="0" step="any" inputMode="decimal" value={receivables} onChange={(e) => setReceivables(e.target.value)} /></label>
          <label>Shares and investments<input type="number" min="0" step="any" inputMode="decimal" value={investments} onChange={(e) => setInvestments(e.target.value)} /></label>
        </div>

        <div className="field-row">
          <label>
            Gold and silver unit
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="tola">Tola</option>
              <option value="gram">Grams</option>
            </select>
          </label>
          <label>Gold, {unitLabel}<input type="number" min="0" step="any" inputMode="decimal" value={goldQty} placeholder={unit === "tola" ? "7.5" : "87.48"} onChange={(e) => setGoldQty(e.target.value)} /></label>
          <label>Gold price per {unitLabel}<input type="number" min="0" step="any" inputMode="decimal" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} /></label>
          <label>Silver, {unitLabel}<input type="number" min="0" step="any" inputMode="decimal" value={silverQty} onChange={(e) => setSilverQty(e.target.value)} /></label>
          <label>Silver price per {unitLabel}<input type="number" min="0" step="any" inputMode="decimal" value={silverPrice} onChange={(e) => setSilverPrice(e.target.value)} /></label>
        </div>

        <p className="note"><b>2.</b> What you owe, due now: bills, instalments currently payable, borrowed money being repaid.</p>
        <div className="field-row">
          <label>Debts due now<input type="number" min="0" step="any" inputMode="decimal" value={liabilities} onChange={(e) => setLiabilities(e.target.value)} /></label>
        </div>

        <p className="note">
          <b>3.</b> The nisab threshold. Zakat is due only if your net wealth reaches it.
          The classical thresholds are 52.5 tola of silver ({NISAB_SILVER_GRAMS} g) or 7.5 tola of gold ({NISAB_GOLD_GRAMS} g);
          most authorities publish the silver-based figure in currency every year.
        </p>
        <div className="field-row">
          <label>
            Set nisab by
            <select value={basis} onChange={(e) => setBasis(e.target.value)}>
              <option value="amount">The published amount, typed in</option>
              <option value="silver">Silver, 52.5 tola, from the price above</option>
              <option value="gold">Gold, 7.5 tola, from the price above</option>
            </select>
          </label>
          {basis === "amount" && (
            <label>
              Nisab amount in your currency
              <input type="number" min="0" step="any" inputMode="decimal" value={nisabAmount}
                placeholder="as published this year" onChange={(e) => setNisabAmount(e.target.value)} />
            </label>
          )}
        </div>
      </div>

      {r?.need && anyInput && <p className="note">{NEED_MESSAGES[r.need]}</p>}

      {r && !r.need && anyInput && (
        <>
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{fmt(r.net)}</span><span className="s-label">Zakatable wealth</span></div>
            <div className="stat"><span className="s-num">{fmt(r.nisab)}</span><span className="s-label">Nisab threshold</span></div>
            <div className="stat"><span className="s-num">{r.due ? fmt(r.amount) : "0"}</span><span className="s-label">Zakat due, 2.5%</span></div>
          </div>

          {(r.goldValue > 0 || r.silverValue > 0) && (
            <p className="note">
              Valuations: {r.goldValue > 0 ? `gold ${fmt(r.goldValue)}` : ""}{r.goldValue > 0 && r.silverValue > 0 ? ", " : ""}
              {r.silverValue > 0 ? `silver ${fmt(r.silverValue)}` : ""}, included in the wealth figure above.
            </p>
          )}

          {r.due ? (
            <p className="note">
              Your net zakatable wealth of {fmt(r.net)} is at or above the nisab of {fmt(r.nisab)}, so zakat applies
              at 2.5%: <b>{fmt(r.amount)}</b>. This assumes the wealth has been held for one full lunar year.
            </p>
          ) : (
            <p className="note">
              Your net zakatable wealth of {fmt(r.net)} is below the nisab of {fmt(r.nisab)}, so zakat is not
              obligatory on it. Recheck when your savings cross the threshold.
            </p>
          )}

          <p className="note">
            This calculator does the arithmetic with the classical constants; it is not a fatwa. Rulings differ on
            personal-use gold, on which debts deduct, and on business assets. For anything beyond straightforward
            savings, confirm with a scholar you trust. Everything you typed stays on this device; nothing is sent
            anywhere.
          </p>
        </>
      )}

      {!anyInput && (
        <p className="note">
          Fill in what you own and the calculation appears as you type. Personal items you use, your home and your
          car are not zakatable and do not belong in these fields.
        </p>
      )}
    </div>
  );
}
