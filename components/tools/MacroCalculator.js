"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { macros } from "@/lib/health";

/* Calories into protein, fat and carbs: protein anchored to body weight,
   fat as a calorie fraction, carbs fill the rest. The structure every
   evidence-based coach uses, with the knobs exposed. */

const config = {
  intro: "Get your calorie number from our calorie calculator first, then split it here. Protein anchors to body weight; carbs take what remains.",
  fields: [
    { key: "calories", label: "Daily calories", default: "", min: 800, max: 6000, placeholder: "2400" },
    { key: "kg", label: "Weight, kg", default: "", min: 30, max: 300, placeholder: "75" },
    {
      key: "protein", label: "Protein level", type: "select", default: "1.8",
      options: [
        { value: "1.2", label: "1.2 g/kg, sedentary baseline" },
        { value: "1.6", label: "1.6 g/kg, active" },
        { value: "1.8", label: "1.8 g/kg, training regularly" },
        { value: "2.2", label: "2.2 g/kg, building or cutting hard" },
      ],
    },
    {
      key: "fat", label: "Fat share of calories", type: "select", default: "0.28",
      options: [
        { value: "0.22", label: "Lower fat, 22%" },
        { value: "0.28", label: "Balanced, 28%" },
        { value: "0.35", label: "Higher fat, 35%" },
      ],
    },
  ],
  compute(v) {
    const calories = num(v.calories), kg = num(v.kg);
    if (!(calories > 0) || !(kg > 0)) return null;
    const m = macros({ calories, kg, proteinPerKg: Number(v.protein), fatPct: Number(v.fat) });
    if (m.carbsKcal <= 0) {
      return { error: "Protein and fat alone exceed these calories. Either the calorie number is very low for your weight, or pick a lower protein or fat setting." };
    }
    return {
      stats: [
        { num: m.proteinG + " g", label: `Protein, ${m.proteinKcal} kcal` },
        { num: m.carbsG + " g", label: `Carbs, ${m.carbsKcal} kcal` },
        { num: m.fatG + " g", label: `Fat, ${m.fatKcal} kcal` },
      ],
      notes: [
        `Protein comes first at ${v.protein} g per kg of body weight, because it is the macro with a job beyond energy: it holds muscle while losing and builds it while gaining, and it is the most filling of the three. Fat takes ${Math.round(Number(v.fat) * 100)}% of calories, enough for hormones and for meals worth eating. Carbs fill the remaining ${m.carbsKcal} kcal and fuel the actual training.`,
        "Hitting these within about 10 grams is plenty; nobody measures rice to the grain sustainably. Protein is the one to be least flexible about. The split assumes 4 kcal per gram of protein and carbs and 9 for fat, the standard Atwater values.",
      ],
    };
  },
};

export default function MacroCalculator() {
  return <CalcTool config={config} />;
}
