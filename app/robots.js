import { site } from "@/lib/site";

// Static-export compatible: Next.js renders this to /robots.txt at build time.
export const dynamic = "force-static";

export default function robots() {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The CMS login screen has no value in search results and looks
        // like a dead end to anyone who lands on it.
        disallow: ["/admin/", "/admin"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
