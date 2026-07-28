import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("about", "/about/");

export default function About() {
  return <LegalPage slug="about" />;
}
