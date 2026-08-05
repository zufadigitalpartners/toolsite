"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { navyBodyFat } from "@/lib/health";

/* US Navy circumference method: a tape measure and two or three numbers.
   Accurate to a few points, which is enough for the trend, and the trend
   is the point. */

const BANDS_M = [["Essential", 2, 5], ["Athletic", 6, 13], ["Fit", 14, 17], ["Average", 18, 24], ["Above", 25, 40]];
const BANDS_F = [["Essential", 10, 13], ["Athletic", 14, 20], ["Fit", 21, 24], ["Average", 25, 31], ["Above", 32, 45]];

const config = {
  intro: "US Navy tape method. Measure the waist at the navel, the neck below the larynx, both relaxed, tape level. Women add the widest point of the hips.",
  fields: [
    {
      key: "sex", label: "Body", type: "select", default: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }],
    },
    { key: "cm", label: "Height, cm", default: "", min: 120, max: 230, placeholder: "175" },
    { key: "waist", label: "Waist, cm", default: "", min: 40, max: 220, placeholder: "85" },
    { key: "neck", label: "Neck, cm", default: "", min: 20, max: 70, placeholder: "37" },
    { key: "hip", label: "Hips, cm (women)", default: "", min: 40, max: 220 },
  ],
  compute(v) {
    const cm = num(v.cm), waist = num(v.waist), neck = num(v.neck), hip = num(v.hip);
    if (!(cm > 0) || !(waist > 0) || !(neck > 0)) return null;
    if (v.sex === "female" && !(hip > 0)) return null;
    const bf = navyBodyFat({ sex: v.sex, cm, waist, neck, hip });
    if (bf === null || bf < 1 || bf > 70) {
      return { error: "Those measurements do not combine into a plausible result. The usual culprit is the waist and neck being swapped, or inches entered as centimetres." };
    }
    const bands = v.sex === "male" ? BANDS_M : BANDS_F;
    const band = bands.find(([, lo, hi]) => bf >= lo && bf <= hi)?.[0] || (bf < bands[0][1] ? "Below essential" : "Above");
    return {
      stats: [
        { num: fmt(bf, 1) + "%", label: "Estimated body fat" },
        { num: band, label: "Category" },
      ],
      table: {
        head: ["Category", v.sex === "male" ? "Men" : "Women"],
        rows: bands.map(([name, lo, hi]) => [name, lo + "-" + hi + "%"]),
      },
      notes: [
        "The Navy method estimates within three to four points of a lab scan for most bodies, which sounds rough until you realise the trend is what matters: measured the same way at the same time of day, the direction of change is reliable even when the absolute number is off.",
        "It reads less accurately at the muscular and very lean extremes, where waists are small for reasons other than fat. Measure monthly, not daily; circumference moves with meals and water long before it moves with fat.",
      ],
    };
  },
};

export default function BodyFatCalculator() {
  return <CalcTool config={config} />;
}
