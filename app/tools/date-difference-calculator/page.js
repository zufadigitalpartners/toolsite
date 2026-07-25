import ToolShell from "@/components/ToolShell";
import DateDifference from "@/components/tools/DateDifference";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("date-difference-calculator");

export default function Page() {
  return (
    <ToolShell slug="date-difference-calculator">
      <DateDifference />
    </ToolShell>
  );
}
