import ToolShell from "@/components/ToolShell";
import WordCounter from "@/components/tools/WordCounter";

export const metadata = {
  title: "Word Counter — Count Words & Characters Online Free",
  description:
    "Free online word counter. Count words, characters, sentences, paragraphs and reading time instantly. No signup, works in your browser.",
};

export default function Page() {
  return (
    <ToolShell slug="word-counter">
      <WordCounter />
    </ToolShell>
  );
}
