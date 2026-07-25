import ToolShell from "@/components/ToolShell";
import CaseConverter from "@/components/tools/CaseConverter";

export const metadata = {
  title: "Case Converter — UPPERCASE, lowercase & Title Case Online",
  description:
    "Free online case converter. Change text to UPPERCASE, lowercase, Title Case or Sentence case instantly and copy the result. No signup needed.",
};

export default function Page() {
  return (
    <ToolShell slug="case-converter">
      <CaseConverter />
    </ToolShell>
  );
}
