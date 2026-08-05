"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { idealWeights } from "@/lib/health";

/* Four published formulas that disagree, shown together, because showing
   one as "the" ideal would be a lie of omission. */

const config = {
  intro: "Four published formulas, side by side, plus the healthy-BMI band for your height. They disagree; that is the honest answer.",
  fields: [
    {
      key: "sex", label: "Body", type: "select", default: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }],
    },
    { key: "cm", label: "Height, cm", default: "", min: 120, max: 230, placeholder: "170" },
  ],
  compute(v) {
    const cm = num(v.cm);
    if (!(cm > 0)) return null;
    const w = idealWeights({ sex: v.sex, cm });
    return {
      stats: [
        { num: fmt(w.bmiLow, 1) + "-" + fmt(w.bmiHigh, 1) + " kg", label: "Healthy BMI band" },
        { num: fmt((w.devine + w.robinson + w.miller + w.hamwi) / 4, 1) + " kg", label: "Average of the formulas" },
      ],
      table: {
        head: ["Formula", "Ideal weight", "Origin"],
        rows: [
          ["Devine (1974)", fmt(w.devine, 1) + " kg", "Drug dosing; the medical default"],
          ["Robinson (1983)", fmt(w.robinson, 1) + " kg", "Refit of Devine on better data"],
          ["Miller (1983)", fmt(w.miller, 1) + " kg", "Another refit, runs heavier at short heights"],
          ["Hamwi (1964)", fmt(w.hamwi, 1) + " kg", "Diabetes practice rule of thumb"],
        ],
      },
      notes: [
        "Every formula here was built for clinical arithmetic, mostly drug dosing, not as a target for a person to chase. They ignore muscle, frame and age entirely, which is why a fit heavyweight fails all of them while being perfectly healthy.",
        "The healthy-BMI band is the widest and most honest of the numbers: anywhere inside it, weight alone is not a health concern by the population evidence. Where in the band a body naturally sits varies by build, and body composition tells more than scale weight; our body fat calculator measures that side.",
      ],
    };
  },
};

export default function IdealWeightCalculator() {
  return <CalcTool config={config} />;
}
