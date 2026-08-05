import dynamic from "next/dynamic";
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

// The PDF tools are components rather than CMS code because they need
// pdf-lib, which cannot be pasted into a text field.
//
// Loaded through next/dynamic, not imported directly. A plain import put
// their code into the shared client graph, which pushed the homepage's
// first load from 196 kB to 325 kB for six tools it never renders. These
// are file editors that cannot do anything server side anyway, so there is
// nothing lost by having them arrive with the page they belong to.
const pdfTool = (loader) => dynamic(loader, {
  ssr: false,
  loading: () => <p className="note">Loading the PDF tools…</p>,
});

const MergePdf = pdfTool(() => import("@/components/tools/pdf/MergePdf"));
const SplitPdf = pdfTool(() => import("@/components/tools/pdf/SplitPdf"));
const RotatePdf = pdfTool(() => import("@/components/tools/pdf/RotatePdf"));
const DeletePdfPages = pdfTool(() => import("@/components/tools/pdf/DeletePdfPages"));
const PdfPageNumbers = pdfTool(() => import("@/components/tools/pdf/PdfPageNumbers"));
const WatermarkPdf = pdfTool(() => import("@/components/tools/pdf/WatermarkPdf"));
const PdfToJpg = pdfTool(() => import("@/components/tools/pdf/PdfToJpg"));
const ReorderPdf = pdfTool(() => import("@/components/tools/pdf/ReorderPdf"));

// Same rule for every other tool that carries a heavy dependency or canvas
// logic: it arrives with its own page and never taxes the shared bundle.
const lazyTool = (loader) => dynamic(loader, {
  ssr: false,
  loading: () => <p className="note">Loading the tool…</p>,
});

const HeicToJpg = lazyTool(() => import("@/components/tools/HeicToJpg"));
const ImageToText = lazyTool(() => import("@/components/tools/ImageToText"));
const ExifRemover = lazyTool(() => import("@/components/tools/ExifRemover"));
const ExcelToCsv = lazyTool(() => import("@/components/tools/ExcelToCsv"));
const InvoiceGenerator = lazyTool(() => import("@/components/tools/InvoiceGenerator"));
const BarcodeGenerator = lazyTool(() => import("@/components/tools/BarcodeGenerator"));
const SignatureMaker = lazyTool(() => import("@/components/tools/SignatureMaker"));
const SpinTheWheel = lazyTool(() => import("@/components/tools/SpinTheWheel"));

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

  "merge-pdf": MergePdf,
  "split-pdf": SplitPdf,
  "rotate-pdf": RotatePdf,
  "delete-pages-from-pdf": DeletePdfPages,
  "add-page-numbers-to-pdf": PdfPageNumbers,
  "watermark-pdf": WatermarkPdf,
  "pdf-to-jpg": PdfToJpg,
  "reorder-pdf-pages": ReorderPdf,

  "heic-to-jpg": HeicToJpg,
  "image-to-text": ImageToText,
  "exif-remover": ExifRemover,
  "excel-to-csv": ExcelToCsv,
  "invoice-generator": InvoiceGenerator,
  "barcode-generator": BarcodeGenerator,
  "signature-maker": SignatureMaker,
  "spin-the-wheel": SpinTheWheel,
};

// Reads the grouped shape and the older flat one.
function readCode(tool) {
  const c = tool.code || {};
  return {
    html: c.html ?? tool.embedHtml ?? "",
    css: c.css ?? tool.embedCss ?? "",
    js: c.js ?? tool.embedJs ?? "",
    needsNetwork: c.needsNetwork ?? false,
    apiKey: c.apiKey ?? "",
    apiBaseUrl: c.apiBaseUrl ?? "",
  };
}

export default function ToolRenderer({ tool, accent }) {
  const Built = BUILT_IN_TOOLS[tool.slug];
  if (Built) return <Built />;

  const code = readCode(tool);
  if (!code.html && !code.js && !code.css) {
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
      allowSameOrigin={code.needsNetwork}
      doc={buildEmbedDoc({
        html: code.html,
        css: code.css,
        js: code.js,
        accent,
        frameId: tool.slug,
        config: { apiKey: code.apiKey, apiBaseUrl: code.apiBaseUrl },
      })}
    />
  );
}
