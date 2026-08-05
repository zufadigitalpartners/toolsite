"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { depreciation } from "@/lib/property";

/* The steepest cost of owning a car is the one with no monthly bill.
   Industry rule of thumb: ~20% the first year, ~15% each year after,
   both editable because markets and models differ. */

const config = {
  intro: "Enter the price and the yearly loss rates. The defaults are the industry rule of thumb; sturdy brands lose less, luxury EVs often more.",
  fields: [
    { key: "price", label: "Price when new", default: "30000", min: 0 },
    { key: "y1", label: "First-year loss %", default: "20", min: 0, max: 60 },
    { key: "later", label: "Later years loss %", default: "15", min: 0, max: 50 },
    { key: "years", label: "Years to project", default: "8", min: 1, max: 20 },
  ],
  compute(v) {
    const price = num(v.price);
    if (!(price > 0)) return null;
    const rows = depreciation({ price, firstYearPct: num(v.y1), laterYearsPct: num(v.later), years: Math.round(num(v.years)) });
    const last = rows[rows.length - 1];
    const y5 = rows[Math.min(4, rows.length - 1)];
    return {
      stats: [
        { num: fmt(last.value), label: `Value after ${rows.length} years` },
        { num: fmt(last.lost), label: "Total depreciation" },
        { num: fmt((last.lost / price) * 100, 0) + "%", label: "Of the price, gone" },
      ],
      table: {
        head: ["Year", "Value", "Lost so far"],
        rows: rows.map((r) => [r.year, fmt(r.value), fmt(r.lost)]),
      },
      notes: [
        `By year five the car is worth about ${fmt(y5.value)}: depreciation of ${fmt(y5.lost)} dwarfs most fuel and insurance bills over the same period, it just never sends an invoice. This is the number to weigh when choosing new against three years old, where someone else has already paid the steep first years.`,
        "The curve is a planning model, not a valuation: condition, mileage, colour and market swings move real prices. For selling or insurance disputes, use actual market listings for your exact model and year.",
      ],
    };
  },
};

export default function CarDepreciation() {
  return <CalcTool config={config} />;
}
