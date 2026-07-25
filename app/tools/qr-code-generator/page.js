import ToolShell from "@/components/ToolShell";
import QrGenerator from "@/components/tools/QrGenerator";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("qr-code-generator");

export default function Page() {
  return (
    <ToolShell slug="qr-code-generator">
      <QrGenerator />
    </ToolShell>
  );
}
