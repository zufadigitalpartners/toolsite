import ToolShell from "@/components/ToolShell";
import QrGenerator from "@/components/tools/QrGenerator";

export const metadata = {
  title: "QR Code Generator — Free QR Codes That Never Expire",
  description:
    "Free QR code generator. Turn any link or text into a QR code and download it as PNG. Generated in your browser, no signup, codes never expire.",
};

export default function Page() {
  return (
    <ToolShell slug="qr-code-generator">
      <QrGenerator />
    </ToolShell>
  );
}
