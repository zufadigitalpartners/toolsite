"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";

/* Purchasing power in both directions: what today's money buys later, and
   what a future price means in today's terms. */

const config = {
  intro: "Pick the direction, set the yearly inflation rate, and read what the money is really worth.",
  fields: [
    {
      key: "dir", label: "Question", type: "select", default: "future",
      options: [
        { value: "future", label: "What will today's amount be worth later?" },
        { value: "cost", label: "What will something costing this much cost later?" },
      ],
    },
    { key: "amount", label: "Amount", default: "100000", min: 0 },
    { key: "rate", label: "Inflation % per year", default: "6", min: 0, max: 100 },
    { key: "years", label: "Years", default: "10", min: 1, max: 80 },
  ],
  compute(v) {
    const a = num(v.amount), r = num(v.rate) / 100, y = num(v.years);
    if (!(a > 0) || !(y > 0)) return null;
    const factor = Math.pow(1 + r, y);
    const rows = [1, 5, 10, 20, 30].filter((x) => x <= Math.max(y, 10)).map((x) => [
      x + " yr" + (x > 1 ? "s" : ""),
      fmt(a * Math.pow(1 + r, x)),
      fmt(a / Math.pow(1 + r, x)),
    ]);
    if (v.dir === "cost") {
      return {
        stats: [
          { num: fmt(a * factor), label: `Cost in ${y} years` },
          { num: fmt((factor - 1) * 100, 1) + "%", label: "Total price rise" },
        ],
        table: { head: ["Horizon", "Future cost", "Buying power of " + fmt(a)], rows },
        notes: [
          `At ${v.rate}% a year, something costing ${fmt(a)} today costs ${fmt(a * factor)} in ${y} years. This is why salaries, rents and savings targets all need the same adjustment before long-term plans mean anything.`,
        ],
      };
    }
    return {
      stats: [
        { num: fmt(a / factor), label: `Buys this much, in today's terms` },
        { num: fmt((1 - 1 / factor) * 100, 1) + "%", label: "Purchasing power lost" },
      ],
      table: { head: ["Horizon", "Future cost of today's " + fmt(a), "What " + fmt(a) + " will buy"], rows },
      notes: [
        `${fmt(a)} kept as cash for ${y} years at ${v.rate}% inflation buys what ${fmt(a / factor)} buys today: ${fmt((1 - 1 / factor) * 100, 1)}% of its purchasing power is gone. That erosion is the honest argument for not holding long-term savings as cash, and the rate to beat for any investment to be a real gain.`,
        "Official inflation is an average basket; your personal rate depends on what you buy. Rent-heavy and food-heavy budgets usually run hotter than the headline number.",
      ],
    };
  },
};

export default function InflationCalculator() {
  return <CalcTool config={config} />;
}
