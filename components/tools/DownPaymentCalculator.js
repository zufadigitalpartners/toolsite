"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { monthlyForGoal, monthsToGoal } from "@/lib/finance";

/* A house target turned into a standing order: the deposit, the extras
   people forget, and the monthly saving that gets there. */

const config = {
  intro: "The target is more than the deposit: buying costs and a moving buffer belong in it. Set a timeline and read the monthly amount.",
  fields: [
    { key: "price", label: "Home price you expect", default: "250000", min: 0 },
    { key: "downPct", label: "Down payment %", default: "20", min: 1, max: 100 },
    { key: "extras", label: "Buying costs and buffer", default: "10000", min: 0 },
    { key: "saved", label: "Already saved", default: "0", min: 0 },
    { key: "years", label: "Years until buying", default: "4", min: 0.5, max: 30 },
    { key: "rate", label: "Savings interest % / yr", default: "4", min: 0, max: 15 },
  ],
  compute(v) {
    const price = num(v.price);
    if (!(price > 0)) return null;
    const target = price * (num(v.downPct) / 100) + num(v.extras);
    const months = Math.round(num(v.years) * 12);
    const saved = num(v.saved);
    if (saved >= target) {
      return {
        stats: [{ num: fmt(target), label: "Target reached" }],
        notes: ["What you have saved already covers the deposit and costs. The next tool is the home affordability calculator, and then the mortgage itself."],
      };
    }
    const monthly = monthlyForGoal(target, saved, num(v.rate), months);
    const at500 = monthsToGoal(target, saved, 500, num(v.rate));
    return {
      stats: [
        { num: fmt(target), label: "Total target" },
        { num: fmt(Math.max(0, monthly)), label: "Needed per month" },
        { num: fmt(target - saved), label: "Still to save" },
      ],
      notes: [
        `The target is ${fmt(price * (num(v.downPct) / 100))} deposit plus ${fmt(num(v.extras))} for costs and buffer. Saving ${fmt(Math.max(0, monthly))} a month at ${v.rate}% lands it in ${v.years} years. ${isFinite(at500) ? "At a flat 500 a month it would take " + Math.ceil(at500 / 12 * 10) / 10 + " years, if that comparison helps size the plan." : ""}`,
        "A bigger deposit does three jobs at once: smaller loan, better rate brackets at 20% and up in most markets, and no costly loan insurance that thinner deposits trigger. The extras line matters because legal fees, taxes, surveys and the van all land in the same month, and the plan that ignored them starts homeownership on a credit card.",
      ],
    };
  },
};

export default function DownPaymentCalculator() {
  return <CalcTool config={config} />;
}
