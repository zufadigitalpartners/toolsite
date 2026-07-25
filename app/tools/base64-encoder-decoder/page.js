import ToolShell from "@/components/ToolShell";
import Base64Tool from "@/components/tools/Base64Tool";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("base64-encoder-decoder");

export default function Page() {
  return (
    <ToolShell slug="base64-encoder-decoder">
      <Base64Tool />
    </ToolShell>
  );
}
