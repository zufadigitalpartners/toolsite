"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { waterIntake } from "@/lib/health";

/* Weight-based guideline plus exercise and climate. A guideline, labelled
   as one, with thirst given its due. */

const config = {
  intro: "A weight-based guideline: about 33 ml per kilogram, plus extra for training and hot weather.",
  fields: [
    { key: "kg", label: "Weight, kg", default: "", min: 30, max: 300, placeholder: "70" },
    { key: "exercise", label: "Exercise minutes per day", default: "30", min: 0, max: 300 },
    {
      key: "climate", label: "Climate", type: "select", default: "temperate",
      options: [
        { value: "temperate", label: "Temperate" },
        { value: "hot", label: "Hot, or hot season" },
      ],
    },
  ],
  compute(v) {
    const kg = num(v.kg);
    if (!(kg > 0)) return null;
    const ml = waterIntake({ kg, exerciseMinutes: num(v.exercise), hotClimate: v.climate === "hot" });
    const glasses = Math.round(ml / 250);
    return {
      stats: [
        { num: fmt(ml / 1000, 1) + " L", label: "Daily guideline" },
        { num: glasses + " glasses", label: "In 250 ml glasses" },
      ],
      notes: [
        `The base is ${fmt(kg * 33 / 1000, 1)} litres for your weight, plus ${fmt((num(v.exercise) / 30) * 0.35, 1)} for training${v.climate === "hot" ? " and half a litre for the heat" : ""}. Food typically contributes another fifth on top of what you drink, and tea and coffee count toward the total despite the myth.`,
        "This is a guideline, not a prescription: thirst is a working signal for most healthy people, and pale-straw urine is the practical check. Kidney or heart conditions change the rules entirely, and that conversation belongs to a doctor, not a calculator.",
      ],
    };
  },
};

export default function WaterIntakeCalculator() {
  return <CalcTool config={config} />;
}
