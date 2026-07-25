import { site } from "@/lib/site";

// Static-export compatible: Next.js renders this to /robots.txt at build time.
export const dynamic = "force-static";

export default function robots() {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
