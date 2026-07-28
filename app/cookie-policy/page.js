import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("cookie-policy", "/cookie-policy/");

export default function CookiePolicy() {
  return <LegalPage slug="cookie-policy" />;
}
