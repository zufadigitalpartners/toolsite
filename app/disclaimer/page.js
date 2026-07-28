import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("disclaimer", "/disclaimer/");

export default function Disclaimer() {
  return <LegalPage slug="disclaimer" />;
}
