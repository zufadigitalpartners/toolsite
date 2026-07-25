import ToolShell from "@/components/ToolShell";
import WordCounter from "@/components/tools/WordCounter";
import { toolMetadata } from "@/lib/seo";

export const metadata = toolMetadata("word-counter");

export default function Page() {
  return (
    <ToolShell slug="word-counter">
      <WordCounter />
    </ToolShell>
  );
}
