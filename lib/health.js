// Health formulas, all published and named. Units are metric internally:
// kg, cm, years. Conversions happen in the UI, arithmetic happens here.

export const round1 = (n) => Math.round(n * 10) / 10;

/* Mifflin-St Jeor (1990), the equation dietitians actually use.
   Men:   10W + 6.25H − 5A + 5
   Women: 10W + 6.25H − 5A − 161 */
export function bmr({ sex, kg, cm, age }) {
  const base = 10 * kg + 6.25 * cm - 5 * age;
  return base + (sex === "male" ? 5 : -161);
}

/* Standard activity multipliers. The names are the honest part: "moderate"
   means real training 3-5 days a week, not intending to. */
export const ACTIVITY = [
  { id: "sedentary", label: "Sedentary, desk life", factor: 1.2 },
  { id: "light", label: "Light, exercise 1-3 days a week", factor: 1.375 },
  { id: "moderate", label: "Moderate, exercise 3-5 days a week", factor: 1.55 },
  { id: "active", label: "Active, hard exercise 6-7 days", factor: 1.725 },
  { id: "veryActive", label: "Very active, physical job plus training", factor: 1.9 },
];

export function tdee(bmrValue, activityId) {
  const a = ACTIVITY.find((x) => x.id === activityId) || ACTIVITY[0];
  return bmrValue * a.factor;
}

/* Macro split from calories. Protein anchored to body weight, fat as a
   fraction of calories, carbs take the rest: the structure every evidence-
   based coach uses, with the knobs exposed. */
export function macros({ calories, kg, proteinPerKg = 1.8, fatPct = 0.28 }) {
  const proteinG = kg * proteinPerKg;
  const proteinKcal = proteinG * 4;
  const fatKcal = calories * fatPct;
  const fatG = fatKcal / 9;
  const carbsKcal = Math.max(0, calories - proteinKcal - fatKcal);
  return {
    proteinG: Math.round(proteinG),
    fatG: Math.round(fatG),
    carbsG: Math.round(carbsKcal / 4),
    proteinKcal: Math.round(proteinKcal),
    fatKcal: Math.round(fatKcal),
    carbsKcal: Math.round(carbsKcal),
  };
}

/* US Navy circumference method (Hodgdon & Beckett), metric log10 form.
   Men need waist and neck; women add hips. */
export function navyBodyFat({ sex, cm, waist, neck, hip = 0 }) {
  if (sex === "male") {
    if (waist - neck <= 0) return null;
    return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(cm)) - 450;
  }
  if (waist + hip - neck <= 0) return null;
  return 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(cm)) - 450;
}

/* Four published ideal-weight formulas, all in kg from height.
   They disagree with each other by design; showing all four is the honesty. */
export function idealWeights({ sex, cm }) {
  const inchesOver5ft = Math.max(0, cm / 2.54 - 60);
  const male = sex === "male";
  return {
    devine: (male ? 50 : 45.5) + 2.3 * inchesOver5ft,
    robinson: (male ? 52 : 49) + (male ? 1.9 : 1.7) * inchesOver5ft,
    miller: (male ? 56.2 : 53.1) + (male ? 1.41 : 1.36) * inchesOver5ft,
    hamwi: (male ? 48 : 45.5) + (male ? 2.7 : 2.2) * inchesOver5ft,
    // healthy BMI band 18.5-24.9 for the same height
    bmiLow: 18.5 * Math.pow(cm / 100, 2),
    bmiHigh: 24.9 * Math.pow(cm / 100, 2),
  };
}

/* Water: the common evidence-adjacent heuristic, ml per kg plus exercise
   and hot-climate additions. A guideline, clearly labelled as one. */
export function waterIntake({ kg, exerciseMinutes = 0, hotClimate = false }) {
  let ml = kg * 33;
  ml += (exerciseMinutes / 30) * 350;
  if (hotClimate) ml += 500;
  return ml;
}

/* Naegele's rule: due date = LMP + 280 days, adjusted for cycle length
   away from 28 days. Returns milestone dates too. */
export function dueDate({ lmpIso, cycleLength = 28 }) {
  const lmp = new Date(lmpIso + "T00:00:00");
  if (isNaN(lmp)) return null;
  const adjust = cycleLength - 28;
  const due = new Date(lmp);
  due.setDate(due.getDate() + 280 + adjust);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysIn = Math.floor((today - lmp) / 86400000) - adjust;
  const week = Math.floor(daysIn / 7);
  const t2 = new Date(lmp); t2.setDate(t2.getDate() + 13 * 7 + adjust);
  const t3 = new Date(lmp); t3.setDate(t3.getDate() + 27 * 7 + adjust);
  return {
    due,
    week,
    dayOfWeek: daysIn % 7,
    trimester: week < 13 ? 1 : week < 27 ? 2 : 3,
    secondTrimester: t2,
    thirdTrimester: t3,
    daysToGo: Math.max(0, Math.floor((due - today) / 86400000)),
  };
}
