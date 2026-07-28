import ToolEmbed from "@/components/ToolEmbed";
import { buildEmbedDoc } from "@/lib/embedStyles";

import AgeCalculator from "@/components/tools/AgeCalculator";
import Base64Tool from "@/components/tools/Base64Tool";
import CaseConverter from "@/components/tools/CaseConverter";
import DateDifference from "@/components/tools/DateDifference";
import JsonFormatter from "@/components/tools/JsonFormatter";
import PasswordGenerator from "@/components/tools/PasswordGenerator";
import QrGenerator from "@/components/tools/QrGenerator";
import RandomNumber from "@/components/tools/RandomNumber";
import WordCounter from "@/components/tools/WordCounter";

// Tools that ship as real React components. Anything not listed here falls
// back to the code stored on the tool in TinaCMS, which is how new tools
// get added without touching the codebase.
export const BUILT_IN_TOOLS = {
  "age-calculator": AgeCalculator,
  "base64-encoder-decoder": Base64Tool,
  "case-converter": CaseConverter,
  "date-difference-calculator": DateDifference,
  "json-formatter": JsonFormatter,
  "password-generator": PasswordGenerator,
  "qr-code-generator": QrGenerator,
  "random-number-generator": RandomNumber,
  "word-counter": WordCounter,
};

export default function ToolRenderer({ tool, accent }) {
  const Built = BUILT_IN_TOOLS[tool.slug];
  if (Built) return <Built />;

  const hasCode = tool.embedHtml || tool.embedJs || tool.embedCss;
  if (!hasCode) {
    return (
      <p className="result-note">
        This tool is not ready yet. Add its code in the CMS under Tools, or
        pick another tool from the list below.
      </p>
    );
  }

  return (
    <ToolEmbed
      title={tool.name}
      frameId={tool.slug}
      doc={buildEmbedDoc({
        html: tool.embedHtml || "",
        css: tool.embedCss || "",
        js: tool.embedJs || "",
        accent,
        frameId: tool.slug,
      })}
    />
  );
}
