"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";

/* 50/30/20 with the ratios exposed, because the rule is a starting point
   and rents in real cities do not read the rule. */

const config = {
  intro: "Enter your take-home monthly income. The classic split is 50% needs, 30% wants, 20% saving; adjust the sliders of your life below.",
  fields: [
    { key: "income", label: "Monthly income after tax", default: "", min: 0, placeholder: "4000", flex: "1 1 180px" },
    { key: "needs", label: "Needs %", default: "50", min: 0, max: 100 },
    { key: "wants", label: "Wants %", default: "30", min: 0, max: 100 },
    { key: "savings", label: "Savings and debt %", default: "20", min: 0, max: 100 },
  ],
  compute(v) {
    const inc = num(v.income);
    const n = num(v.needs), w = num(v.wants), s = num(v.savings);
    if (!(inc > 0)) return null;
    const total = n + w + s;
    const warn = Math.abs(total - 100) > 0.01
      ? `Your percentages add to ${fmt(total, 1)}%, not 100%. The amounts below still use your numbers, so the plan ${total > 100 ? "spends more than the income" : "leaves " + fmt(100 - total, 1) + "% unassigned"}.`
      : null;
    return {
      warn,
      stats: [
        { num: fmt((inc * n) / 100), label: `Needs, ${n}%` },
        { num: fmt((inc * w) / 100), label: `Wants, ${w}%` },
        { num: fmt((inc * s) / 100), label: `Savings and debt, ${s}%` },
      ],
      notes: [
        "Needs are the bills that arrive whether you enjoy them or not: rent, groceries, utilities, transport to work, minimum debt payments. Wants are everything chosen: eating out, subscriptions, travel, the nicer phone. Savings covers actual saving plus debt payments beyond the minimums.",
        `The rule is a diagnostic, not a law. If needs alone exceed ${fmt((inc * 50) / 100)}, that is the budget telling you the housing or transport cost is the problem, not the coffee. Adjust the ratios to something honest for your city, and treat the savings line as a bill that pays your future self first.`,
        "Computed on this device; your income is not stored or sent anywhere.",
      ],
    };
  },
};

export default function BudgetCalculator() {
  return <CalcTool config={config} />;
}
