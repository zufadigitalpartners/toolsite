"use client";

import CalcTool, { fmt, num } from "@/components/tools/calc/CalcTool";
import { dueDate } from "@/lib/health";

/* Naegele's rule with cycle adjustment: LMP + 280 days, shifted by how
   far the cycle runs from 28. Formatted locally, never through UTC. */

const local = (d) =>
  d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const config = {
  intro: "Enter the first day of the last period. A cycle longer or shorter than 28 days shifts the estimate; set it if you know it.",
  fields: [
    { key: "lmp", label: "First day of last period", type: "date", default: "", flex: "1 1 200px" },
    { key: "cycle", label: "Cycle length, days", default: "28", min: 20, max: 45 },
  ],
  compute(v) {
    if (!v.lmp) return null;
    const r = dueDate({ lmpIso: v.lmp, cycleLength: num(v.cycle) || 28 });
    if (!r) return null;
    if (r.week < 0 || r.week > 44) {
      return { error: "That date is not within a plausible pregnancy window. Check the year." };
    }
    return {
      stats: [
        { num: local(r.due), label: "Estimated due date" },
        { num: r.week + "w " + r.dayOfWeek + "d", label: "Along today" },
        { num: "Trimester " + r.trimester, label: r.daysToGo + " days to go" },
      ],
      table: {
        head: ["Milestone", "Date"],
        rows: [
          ["Second trimester begins, week 14", local(r.secondTrimester)],
          ["Third trimester begins, week 28", local(r.thirdTrimester)],
          ["Estimated due date, week 40", local(r.due)],
        ],
      },
      notes: [
        "This is Naegele's rule: 280 days from the last period, adjusted for cycle length, the same arithmetic printed in obstetric textbooks. It estimates; babies do not read textbooks. Only about one in twenty arrives on the date itself, while the strong majority arrive within two weeks either side.",
        "The dating scan between weeks 8 and 14 measures the embryo directly and overrides any calendar estimate, including this one. Care decisions belong with your midwife or doctor; this page only does the calendar honestly, and the date you entered stays on this device.",
      ],
    };
  },
};

export default function PregnancyDueDate() {
  return <CalcTool config={config} />;
}
