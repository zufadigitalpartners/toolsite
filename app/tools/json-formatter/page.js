import ToolShell from "@/components/ToolShell";
import JsonFormatter from "@/components/tools/JsonFormatter";

export const metadata = {
  title: "JSON Formatter — Format, Minify & Validate JSON Online",
  description:
    "Free JSON formatter and validator. Pretty-print or minify JSON instantly in your browser with clear error messages. Safe for sensitive data — nothing is uploaded.",
};

export default function Page() {
  return (
    <ToolShell slug="json-formatter">
      <JsonFormatter />
    </ToolShell>
  );
}
