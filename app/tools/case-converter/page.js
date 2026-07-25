import ToolShell from "@/components/ToolShell";
import CaseConverter from "@/components/tools/CaseConverter";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("case-converter");

export default function Page() {
  return (
    <ToolShell slug="case-converter">
      <CaseConverter />
    </ToolShell>
  );
}
