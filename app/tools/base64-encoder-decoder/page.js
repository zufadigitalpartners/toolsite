import ToolShell from "@/components/ToolShell";
import Base64Tool from "@/components/tools/Base64Tool";

export const metadata = {
  title: "Base64 Encoder / Decoder — Encode & Decode Online",
  description:
    "Free Base64 encoder and decoder with full Unicode support. Convert text to Base64 and back instantly in your browser — nothing is sent to any server.",
};

export default function Page() {
  return (
    <ToolShell slug="base64-encoder-decoder">
      <Base64Tool />
    </ToolShell>
  );
}
