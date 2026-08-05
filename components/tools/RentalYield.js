"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { rentalYield } from "@/lib/property";

/* Gross, net and cash-on-cash, because listings quote whichever flatters.
   The mortgage fields turn it from a brochure number into your number. */

const config = {
  intro: "Gross yield is the brochure number; net subtracts real costs; cash-on-cash is your actual return on the cash you put in. All three, one form.",
  fields: [
    { key: "price", label: "Purchase price", default: "200000", min: 0 },
    { key: "rent", label: "Monthly rent", default: "1500", min: 0 },
    { key: "costs", label: "Yearly costs: tax, insurance, repairs, agent", default: "3600", min: 0 },
    { key: "vacancy", label: "Vacancy % of the year", default: "4", min: 0, max: 60 },
    { key: "down", label: "Down payment % (100 = cash buy)", default: "25", min: 1, max: 100 },
    { key: "rate", label: "Mortgage rate %", default: "6", min: 0, max: 25 },
    { key: "term", label: "Term, years", default: "25", min: 5, max: 40 },
    { key: "buyCosts", label: "Buying costs %", default: "4", min: 0, max: 15 },
  ],
  compute(v) {
    const r = rentalYield({
      price: num(v.price), monthlyRent: num(v.rent), annualCosts: num(v.costs),
      vacancyPct: num(v.vacancy), downPct: num(v.down), ratePct: num(v.rate),
      termYears: num(v.term), buyCostsPct: num(v.buyCosts),
    });
    if (!(num(v.price) > 0) || !(num(v.rent) > 0)) return null;
    const financed = num(v.down) < 100;
    return {
      stats: [
        { num: fmt(r.gross, 2) + "%", label: "Gross yield" },
        { num: fmt(r.net, 2) + "%", label: "Net yield, cap rate" },
        { num: fmt(r.cashOnCash, 2) + "%", label: "Cash-on-cash return" },
      ],
      table: {
        head: ["Line", "Yearly"],
        rows: [
          ["Rent after vacancy", fmt(num(v.rent) * 12 * (1 - num(v.vacancy) / 100))],
          ["Operating costs", "-" + fmt(num(v.costs))],
          ["Net operating income", fmt(r.noi)],
          ...(financed ? [["Mortgage payments", "-" + fmt(r.debtService)], ["Cash flow", fmt(r.cashFlow)]] : []),
        ],
      },
      notes: [
        financed
          ? `The property ${r.cashFlow >= 0 ? "generates" : "consumes"} ${fmt(Math.abs(r.monthlyCashFlow))} a month after the mortgage. Cash-on-cash of ${fmt(r.cashOnCash, 2)}% is the return on the cash actually invested (deposit plus buying costs), which is the number to compare against simply investing that cash elsewhere. Leverage cuts both ways: it multiplies the return when rent covers everything and multiplies the pain when it does not.`
          : `As a cash purchase, the net yield of ${fmt(r.net, 2)}% is your return before appreciation. Compare it honestly against what the same money earns without tenants, repairs or void months attached.`,
        "The vacancy line is where listing arithmetic goes to die: even one empty month a year takes 8% off the rent. Costs of a quarter to a third of rent are normal once real repairs arrive. Numbers stay on this device; no agent sees what you are actually willing to pay.",
      ],
    };
  },
};

export default function RentalYield() {
  return <CalcTool config={config} />;
}
