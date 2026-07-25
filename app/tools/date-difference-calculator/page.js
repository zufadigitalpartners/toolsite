import ToolShell from "@/components/ToolShell";
import DateDifference from "@/components/tools/DateDifference";

export const metadata = {
  title: "Date Difference Calculator — Days Between Two Dates",
  description:
    "Free date difference calculator. Count the exact days, weeks, months and years between any two dates — for deadlines, countdowns and anniversaries.",
};

export default function Page() {
  return (
    <ToolShell slug="date-difference-calculator">
      <DateDifference />
    </ToolShell>
  );
}
