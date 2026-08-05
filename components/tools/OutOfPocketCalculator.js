"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";

/* Deductible, then coinsurance, capped by the out-of-pocket maximum: the
   three-stage machine nobody explains at the moment you need it. */

const config = {
  intro: "Enter your plan's numbers and a medical bill, and see exactly who pays what and why.",
  fields: [
    { key: "bill", label: "Medical bill amount", default: "", min: 0, placeholder: "8000" },
    { key: "deductible", label: "Yearly deductible", default: "1500", min: 0 },
    { key: "paidSoFar", label: "Already paid toward it this year", default: "0", min: 0 },
    { key: "coinsurance", label: "Your coinsurance % after deductible", default: "20", min: 0, max: 100 },
    { key: "oopMax", label: "Out-of-pocket maximum", default: "6000", min: 0 },
    { key: "oopSoFar", label: "Out-of-pocket spent this year", default: "0", min: 0 },
  ],
  compute(v) {
    const bill = num(v.bill);
    if (!(bill > 0)) return null;
    const dedLeft = Math.max(0, num(v.deductible) - num(v.paidSoFar));
    const oopLeft = Math.max(0, num(v.oopMax) - num(v.oopSoFar));
    // stage 1: you pay the remaining deductible
    const dedPay = Math.min(bill, dedLeft);
    // stage 2: coinsurance on the rest
    const afterDed = bill - dedPay;
    const coinsPay = afterDed * (num(v.coinsurance) / 100);
    // stage 3: the cap
    let you = dedPay + coinsPay;
    const capped = you > oopLeft;
    if (capped) you = oopLeft;
    const insurer = bill - you;
    return {
      stats: [
        { num: fmt(you, 2), label: "You pay" },
        { num: fmt(insurer, 2), label: "Insurance pays" },
        { num: fmt(Math.max(0, oopLeft - you), 2), label: "Left before your cap" },
      ],
      notes: [
        `The bill flows through three stages. First the deductible: ${fmt(dedPay, 2)} of it is yours because ${fmt(dedLeft, 2)} of the yearly deductible was unmet. Then coinsurance: ${v.coinsurance}% of the remaining ${fmt(afterDed, 2)} is ${fmt(coinsPay, 2)}. ${capped ? "That total would pass your out-of-pocket maximum, so the cap takes over: you pay " + fmt(you, 2) + " and not a unit more this year." : "Together that is " + fmt(you, 2) + ", still below your yearly cap."}`,
        "After the out-of-pocket maximum is reached, covered care costs you nothing for the rest of the plan year, which is the single most misunderstood and most valuable line in any policy. This assumes in-network, covered services; out-of-network care often has separate, higher numbers.",
        "Plan numbers stay on this device. For what a policy actually covers, the policy document wins over any calculator, this one included.",
      ],
    };
  },
};

export default function OutOfPocketCalculator() {
  return <CalcTool config={config} />;
}
