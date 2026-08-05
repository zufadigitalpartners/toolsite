"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { bmr, tdee, ACTIVITY } from "@/lib/health";

/* Mifflin-St Jeor, the equation dietitians use, with honest activity
   labels and goal adjustments that are deficits, not magic. */

const config = {
  intro: "Uses the Mifflin-St Jeor equation, the standard in clinical practice since 1990. Pick the activity level honestly; it moves the answer more than anything else.",
  fields: [
    {
      key: "sex", label: "Body", type: "select", default: "male",
      options: [{ value: "male", label: "Male" }, { value: "female", label: "Female" }],
    },
    { key: "age", label: "Age", default: "30", min: 15, max: 100 },
    { key: "kg", label: "Weight, kg", default: "", min: 30, max: 300, placeholder: "75" },
    { key: "cm", label: "Height, cm", default: "", min: 120, max: 230, placeholder: "175" },
    {
      key: "activity", label: "Activity", type: "select", default: "light",
      options: ACTIVITY.map((a) => ({ value: a.id, label: a.label })),
    },
    {
      key: "goal", label: "Goal", type: "select", default: "maintain",
      options: [
        { value: "lose", label: "Lose, about 0.5 kg a week" },
        { value: "maintain", label: "Maintain" },
        { value: "gain", label: "Gain, lean bulk" },
      ],
    },
  ],
  compute(v) {
    const kg = num(v.kg), cm = num(v.cm), age = num(v.age);
    if (!(kg > 0) || !(cm > 0) || !(age > 0)) return null;
    const b = bmr({ sex: v.sex, kg, cm, age });
    const t = tdee(b, v.activity);
    const adjust = v.goal === "lose" ? -500 : v.goal === "gain" ? 300 : 0;
    const target = t + adjust;
    return {
      stats: [
        { num: fmt(b), label: "BMR, at complete rest" },
        { num: fmt(t), label: "Maintenance, TDEE" },
        { num: fmt(target), label: v.goal === "maintain" ? "Your target" : v.goal === "lose" ? "Target, losing" : "Target, gaining" },
      ],
      notes: [
        `BMR is what your body burns doing nothing at all; the activity multiplier turns it into TDEE, the level at which weight holds steady. ${v.goal === "lose" ? "The losing target sits 500 below maintenance, which works out to roughly half a kilogram a week, the pace that preserves muscle and sanity." : v.goal === "gain" ? "The gaining target adds 300, enough to build on without most of it becoming storage." : "Eat at maintenance and weight holds; the number is the reference the other goals adjust from."}`,
        "These are starting estimates with real error bars: metabolisms vary around every equation. Run the number for two or three weeks, watch the scale trend, and adjust by 100 to 200 in whichever direction reality votes. For medical conditions, pregnancy or a history of disordered eating, a professional beats any calculator, including this one.",
      ],
    };
  },
};

export default function CalorieCalculator() {
  return <CalcTool config={config} />;
}
