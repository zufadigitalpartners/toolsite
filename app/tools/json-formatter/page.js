import ToolShell from "@/components/ToolShell";
import JsonFormatter from "@/components/tools/JsonFormatter";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("json-formatter");

export default function Page() {
  return (
    <ToolShell slug="json-formatter">
      <JsonFormatter />
    </ToolShell>
  );
}
