"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { cryptoProfit } from "@/lib/crypto";

/* Buy, sell, both fees, truth. The breakeven line exists because fees move
   it above the buy price, which is the part people forget. */

const config = {
  intro: "Enter what you spent and the two prices. Fees default to zero; exchange spot fees are commonly 0.1% to 1% per side.",
  fields: [
    { key: "spent", label: "Amount spent", default: "1000", min: 0 },
    { key: "buy", label: "Buy price per coin", default: "", min: 0, placeholder: "50000" },
    { key: "sell", label: "Sell price per coin", default: "", min: 0, placeholder: "65000" },
    { key: "buyFee", label: "Buy fee %", default: "0.1", min: 0, max: 10 },
    { key: "sellFee", label: "Sell fee %", default: "0.1", min: 0, max: 10 },
  ],
  compute(v) {
    const r = cryptoProfit({
      amountSpent: num(v.spent), buyPrice: num(v.buy), sellPrice: num(v.sell),
      buyFeePct: num(v.buyFee), sellFeePct: num(v.sellFee),
    });
    if (!r || !(num(v.sell) > 0)) return null;
    const coinsStr = r.coins >= 1 ? fmt(r.coins, 4) : r.coins.toPrecision(6);
    return {
      stats: [
        { num: (r.profit >= 0 ? "+" : "") + fmt(r.profit, 2), label: "Profit after fees" },
        { num: (r.roiPct >= 0 ? "+" : "") + fmt(r.roiPct, 2) + "%", label: "Return on spend" },
        { num: fmt(r.breakeven, r.breakeven < 10 ? 4 : 2), label: "Breakeven sell price" },
      ],
      notes: [
        `Your spend bought ${coinsStr} coins after the buy fee. Selling them all at ${fmt(num(v.sell), 2)} returns ${fmt(r.proceeds, 2)} after the sell fee.`,
        "Breakeven sits above the buy price because both fees must be earned back before the first unit of profit. Computed on this device; nothing you type is sent anywhere, and no exchange account is involved.",
      ],
    };
  },
};

export default function CryptoProfit() {
  return <CalcTool config={config} />;
}
