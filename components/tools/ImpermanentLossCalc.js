"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { lpVsHold, impermanentLoss } from "@/lib/crypto";

/* The standard 50/50 pool formula: IL = 2·sqrt(r)/(1+r) − 1. The table of
   reference points is fixed, because seeing the curve teaches more than
   one answer does. */

const REF = [1.1, 1.25, 1.5, 2, 3, 4, 5, 10];

const config = {
  intro: "Enter your deposit and how the price of one asset moved against the other since you entered the pool.",
  fields: [
    { key: "deposit", label: "Deposit value when you entered", default: "1000", min: 0 },
    { key: "ratio", label: "Price change factor, e.g. 2 = doubled, 0.5 = halved", default: "2", min: 0.01 },
  ],
  compute(v) {
    const r = lpVsHold({ deposit: num(v.deposit), priceRatio: num(v.ratio) });
    if (!r) return null;
    return {
      stats: [
        { num: fmt(r.ilPct, 2) + "%", label: "Impermanent loss" },
        { num: fmt(r.lp, 2), label: "LP position worth" },
        { num: fmt(r.hold, 2), label: "Just holding worth" },
      ],
      table: {
        head: ["Price change", "Impermanent loss"],
        rows: REF.map((x) => [x + "x", fmt(impermanentLoss(x) * 100, 2) + "%"]),
      },
      notes: [
        `Providing liquidity is worth ${fmt(r.lost, 2)} less than holding the same deposit, before counting the trading fees the pool paid you. Whether the position was worth it is exactly the question of whether fees earned exceed ${fmt(r.lost, 2)}.`,
        "The loss is symmetric: a halving costs the same as a doubling, and it is only locked in when you withdraw. This assumes the standard 50/50 constant-product pool; concentrated and weighted pools differ.",
      ],
    };
  },
};

export default function ImpermanentLossCalc() {
  return <CalcTool config={config} />;
}
