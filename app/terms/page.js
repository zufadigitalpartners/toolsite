import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("terms", "/terms/");

export default function Terms() {
  return <LegalPage slug="terms" />;
}
