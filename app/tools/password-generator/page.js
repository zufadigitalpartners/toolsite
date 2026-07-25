import ToolShell from "@/components/ToolShell";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("password-generator");

export default function Page() {
  return (
    <ToolShell slug="password-generator">
      <PasswordGenerator />
    </ToolShell>
  );
}
