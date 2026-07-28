import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("privacy-policy", "/privacy-policy/");

export default function Privacy() {
  return <LegalPage slug="privacy-policy" />;
}
