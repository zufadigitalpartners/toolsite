"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";

/* Compound annual growth rate: the one honest way to compare growth over
   different periods. */

const config = {
  intro: "Enter what it was worth at the start, what it is worth now, and the years between.",
  fields: [
    { key: "start", label: "Starting value", default: "10000", min: 0 },
    { key: "end", label: "Ending value", default: "18000", min: 0 },
    { key: "years", label: "Years between", default: "5", min: 0.1, max: 100 },
  ],
  compute(v) {
    const s = num(v.start), e = num(v.end), y = num(v.years);
    if (!(s > 0) || !(e > 0) || !(y > 0)) return null;
    const cagr = (Math.pow(e / s, 1 / y) - 1) * 100;
    const total = ((e - s) / s) * 100;
    const doubling = cagr > 0 ? 72 / cagr : null;
    const notes = [
      `Total growth is ${fmt(total, 1)}%, but spread over ${y} years the compound rate is ${fmt(cagr, 2)}% a year. CAGR is the rate that, applied every year, turns ${fmt(s)} into exactly ${fmt(e)}, which makes investments of different lengths comparable on one number.`,
      cagr > 0
        ? `Rule of 72: at ${fmt(cagr, 2)}% a year, money doubles roughly every ${fmt(doubling, 1)} years.`
        : "The rate is negative: the value shrank on average every year of the period.",
      "CAGR smooths the path. A wild ride and a steady climb can share the same CAGR; it describes endpoints, not comfort.",
    ];
    return {
      stats: [
        { num: fmt(cagr, 2) + "%", label: "CAGR per year" },
        { num: (total >= 0 ? "+" : "") + fmt(total, 1) + "%", label: "Total change" },
        { num: doubling ? fmt(doubling, 1) + " yrs" : "n/a", label: "Doubling time" },
      ],
      notes,
    };
  },
};

export default function CagrCalculator() {
  return <CalcTool config={config} />;
}
