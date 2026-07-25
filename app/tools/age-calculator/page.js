import ToolShell from "@/components/ToolShell";
import AgeCalculator from "@/components/tools/AgeCalculator";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("age-calculator");

export default function Page() {
  return (
    <ToolShell slug="age-calculator">
      <AgeCalculator />
    </ToolShell>
  );
}
