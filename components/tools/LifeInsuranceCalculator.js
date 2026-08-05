"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";

/* The DIME method: Debt + Income replacement + Mortgage + Education,
   minus what already exists. The standard needs analysis, in the open. */

const config = {
  intro: "DIME method: add up what your family would need, subtract what they would already have. The result is the cover to shop for.",
  fields: [
    { key: "debt", label: "Debts, excluding mortgage", default: "0", min: 0 },
    { key: "income", label: "Your yearly income", default: "", min: 0, placeholder: "40000" },
    { key: "years", label: "Years of income to replace", default: "10", min: 0, max: 30 },
    { key: "mortgage", label: "Mortgage balance", default: "0", min: 0 },
    { key: "education", label: "Children's education fund", default: "0", min: 0 },
    { key: "existing", label: "Existing cover and savings", default: "0", min: 0 },
  ],
  compute(v) {
    const income = num(v.income);
    if (!(income > 0) && !(num(v.mortgage) > 0) && !(num(v.debt) > 0)) return null;
    const need = num(v.debt) + income * num(v.years) + num(v.mortgage) + num(v.education);
    const gap = Math.max(0, need - num(v.existing));
    const multiple = income > 0 ? gap / income : 0;
    return {
      stats: [
        { num: fmt(need), label: "Total family need" },
        { num: fmt(num(v.existing)), label: "Already covered" },
        { num: fmt(gap), label: "Cover to buy" },
      ],
      notes: [
        `The need breaks down as: debts ${fmt(num(v.debt))}, income replacement ${fmt(income * num(v.years))} (${v.years} years at ${fmt(income)}), mortgage ${fmt(num(v.mortgage))}, education ${fmt(num(v.education))}. Against ${fmt(num(v.existing))} in existing cover and savings, the gap is ${fmt(gap)}${income > 0 ? ", about " + fmt(multiple, 1) + " times your yearly income" : ""}.`,
        "Years of income replacement is the judgement call: until the youngest child is independent is the common anchor, giving 10 to 20 for young families and less as dependants grow up. Term insurance for exactly this gap and period is what most independent advisers point to; whole-of-life products bundle investment into insurance at a real cost.",
        "This is arithmetic to walk into a conversation with, not advice, and no insurer sees what you typed: it never leaves your device.",
      ],
    };
  },
};

export default function LifeInsuranceCalculator() {
  return <CalcTool config={config} />;
}
