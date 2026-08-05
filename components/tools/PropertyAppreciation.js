"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";

/* Compound growth on a property, with the honest twin lines: nominal
   value, and what it means after inflation. */

const config = {
  intro: "Project a property's value at a growth rate, and see it honestly: nominal, after inflation, and with rent counted if it earns any.",
  fields: [
    { key: "value", label: "Value today", default: "250000", min: 0 },
    { key: "growth", label: "Appreciation % / year", default: "4", min: -10, max: 25 },
    { key: "years", label: "Years", default: "10", min: 1, max: 50 },
    { key: "inflation", label: "Inflation % / year", default: "3", min: 0, max: 30 },
    { key: "rent", label: "Net yearly rent, optional", default: "0", min: 0 },
  ],
  compute(v) {
    const value = num(v.value), years = Math.round(num(v.years));
    if (!(value > 0) || !(years > 0)) return null;
    const g = num(v.growth) / 100, inf = num(v.inflation) / 100;
    const future = value * Math.pow(1 + g, years);
    const real = future / Math.pow(1 + inf, years);
    const rentTotal = num(v.rent) * years;
    const rows = [1, 5, 10, 15, 20, 30].filter((y) => y <= years).map((y) => [
      y,
      fmt(value * Math.pow(1 + g, y)),
      fmt((value * Math.pow(1 + g, y)) / Math.pow(1 + inf, y)),
    ]);
    return {
      stats: [
        { num: fmt(future), label: `Nominal value in ${years} yrs` },
        { num: fmt(real), label: "In today's money" },
        ...(rentTotal > 0 ? [{ num: fmt(future - value + rentTotal), label: "Total gain with rent" }] : []),
      ],
      table: { head: ["Year", "Nominal value", "In today's money"], rows },
      notes: [
        `At ${v.growth}% growth the number on the deed reaches ${fmt(future)}, but with ${v.inflation}% inflation its purchasing power is ${fmt(real)} in today's terms: the real gain is ${fmt(((real / value - 1) * 100), 1)}%, not ${fmt(((future / value - 1) * 100), 1)}%. Headlines quote the first number; wealth is the second.`,
        "Property growth is lumpy and local: a decade of flat can follow a decade of boom, and the street matters as much as the country. The projection prices a steady assumption, useful for comparing scenarios, useless as a promise. Rent, if entered, is net of costs and added without compounding, the conservative reading.",
      ],
    };
  },
};

export default function PropertyAppreciation() {
  return <CalcTool config={config} />;
}
