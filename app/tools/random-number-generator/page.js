import ToolShell from "@/components/ToolShell";
import RandomNumber from "@/components/tools/RandomNumber";

export const metadata = {
  title: "Random Number Generator — Pick Numbers in Any Range",
  description:
    "Free random number generator. Generate one or many random numbers in any range, with or without duplicates — perfect for draws, games and picks.",
};

export default function Page() {
  return (
    <ToolShell slug="random-number-generator">
      <RandomNumber />
    </ToolShell>
  );
}
