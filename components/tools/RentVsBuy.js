"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { rentVsBuy } from "@/lib/property";

/* Both paths simulated year by year. Buying's cost counts what you get
   back (equity and appreciation); renting's counts the rent. The model is
   simple enough to audit, which is the point. */

const config = {
  intro: "Enter both paths as they actually look for you. The model counts equity and appreciation for the buyer and rent growth for the renter, and finds where they cross.",
  fields: [
    { key: "rent", label: "Monthly rent today", default: "1200", min: 0 },
    { key: "rentGrowth", label: "Rent rises % / year", default: "3", min: 0, max: 20 },
    { key: "price", label: "Home price", default: "300000", min: 0 },
    { key: "down", label: "Down payment %", default: "20", min: 0, max: 100 },
    { key: "rate", label: "Mortgage rate %", default: "6", min: 0, max: 25 },
    { key: "term", label: "Term, years", default: "30", min: 5, max: 40 },
    { key: "buyCosts", label: "Buying costs %", default: "4", min: 0, max: 15 },
    { key: "upkeep", label: "Upkeep and taxes % of value / yr", default: "1.5", min: 0, max: 10 },
    { key: "appreciation", label: "Home appreciates % / yr", default: "3", min: -10, max: 20 },
  ],
  compute(v) {
    const r = rentVsBuy({
      monthlyRent: num(v.rent), rentGrowthPct: num(v.rentGrowth),
      price: num(v.price), downPct: num(v.down), ratePct: num(v.rate), termYears: num(v.term),
      buyCostsPct: num(v.buyCosts), upkeepPct: num(v.upkeep), appreciationPct: num(v.appreciation),
      years: 30,
    });
    if (!(num(v.rent) > 0) || !(num(v.price) > 0)) return null;
    const show = r.rows.filter((row) => [1, 2, 3, 5, 7, 10, 15, 20, 30].includes(row.year));
    return {
      stats: [
        { num: fmt(r.payment), label: "Monthly mortgage payment" },
        { num: r.breakEvenYear ? "Year " + r.breakEvenYear : "Beyond 30 yrs", label: "Buying starts winning" },
        { num: fmt(r.rows[9].equity), label: "Equity after 10 years" },
      ],
      table: {
        head: ["Year", "Renting has cost", "Owning has cost, net of equity", "Equity built"],
        rows: show.map((row) => [row.year, fmt(row.rentTotal), fmt(row.ownNet), fmt(row.equity)]),
      },
      notes: [
        r.breakEvenYear
          ? `Before year ${r.breakEvenYear}, renting is cheaper: buying's upfront costs and interest outweigh the equity built. From year ${r.breakEvenYear} on, ownership's net cost drops below the accumulated rent. The classic finding holds here: buying rewards staying put, and the break-even is the minimum stay for it to make financial sense.`
          : "On these numbers renting stays cheaper for three decades: the price is high relative to rent, and the interest, upkeep and entry costs outweigh what equity and appreciation return. Cities genuinely differ in this ratio, which is why the same salary rents in one market and buys in another.",
        "The model deliberately leaves out what a renter might earn investing the difference, and any tax treatment of either path, because both double the assumptions. It compares cash cost against cash cost with equity honestly counted. Ownership also buys things without prices: stability, the right to paint walls; renting buys mobility. The table prices what can be priced.",
      ],
    };
  },
};

export default function RentVsBuy() {
  return <CalcTool config={config} />;
}
