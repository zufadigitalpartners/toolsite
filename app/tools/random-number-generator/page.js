import ToolShell from "@/components/ToolShell";
import RandomNumber from "@/components/tools/RandomNumber";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("random-number-generator");

export default function Page() {
  return (
    <ToolShell slug="random-number-generator">
      <RandomNumber />
    </ToolShell>
  );
}
