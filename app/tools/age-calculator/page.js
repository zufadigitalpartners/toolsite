import ToolShell from "@/components/ToolShell";
import AgeCalculator from "@/components/tools/AgeCalculator";

export const metadata = {
  title: "Age Calculator — Exact Age in Years, Months & Days",
  description:
    "Free age calculator. Find your exact age in years, months and days from your date of birth, plus total days lived and days until your next birthday.",
};

export default function Page() {
  return (
    <ToolShell slug="age-calculator">
      <AgeCalculator />
    </ToolShell>
  );
}
