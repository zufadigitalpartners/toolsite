"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { affordability } from "@/lib/property";

/* The 28/36 lending ratios, run in the open. Banks apply these before
   they smile at you; running them first makes the viewing list honest. */

const config = {
  intro: "The standard lending test: housing costs within 28% of gross monthly income, all debt within 36%. Enter your numbers and see the ceiling banks calculate.",
  fields: [
    { key: "income", label: "Gross monthly income", default: "", min: 0, placeholder: "6000" },
    { key: "debts", label: "Monthly debt payments", default: "0", min: 0 },
    { key: "rate", label: "Mortgage rate %", default: "6", min: 0, max: 25 },
    { key: "term", label: "Term, years", default: "30", min: 5, max: 40 },
    { key: "down", label: "Down payment saved", default: "0", min: 0 },
  ],
  compute(v) {
    const income = num(v.income);
    if (!(income > 0)) return null;
    const r = affordability({
      monthlyIncome: income, monthlyDebts: num(v.debts),
      ratePct: num(v.rate), termYears: num(v.term), downPayment: num(v.down),
    });
    if (r.maxPayment <= 0) {
      return { error: "Existing debt payments already exceed the total-debt ratio: on these rules no mortgage payment fits. Reducing the monthly debts is the lever that reopens the calculation." };
    }
    return {
      stats: [
        { num: fmt(r.maxPrice), label: "Home price ceiling" },
        { num: fmt(r.maxPayment), label: "Max monthly payment" },
        { num: fmt(r.maxLoan), label: "Max loan" },
      ],
      notes: [
        `The binding constraint is the ${r.limitedBy}: ${r.limitedBy === "housing ratio" ? "28% of income caps the housing payment before total debt does" : "existing debts eat into the 36% total-debt allowance, capping the mortgage below what income alone would carry"}. Payment ${fmt(r.maxPayment)} at ${v.rate}% over ${v.term} years supports a loan of ${fmt(r.maxLoan)}, plus your ${fmt(num(v.down))} down.`,
        "Two honest cautions. This is the lender's ceiling, not a recommendation: living at the top of it leaves nothing for the roof that leaks in year two. And banks vary the ratios by market and product, some stretching to 43% total debt; treat 28/36 as the conservative standard it is. Upkeep, insurance and taxes sit on top of the payment; our rent vs buy calculator counts those.",
      ],
    };
  },
};

export default function HomeAffordability() {
  return <CalcTool config={config} />;
}
