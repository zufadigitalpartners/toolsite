import { site } from "@/lib/site";
import { tools, categories } from "@/lib/tools";
import { getPage } from "@/lib/pages";

// Static-export compatible: Next.js renders this to /sitemap.xml at build time.
export const dynamic = "force-static";

// Content pages that belong in the sitemap. Legal pages are left out on
// purpose: they carry noindex, so listing them would ask Google to crawl
// something we have told it not to index.
const CONTENT_PAGES = [
  { slug: "about", path: "/about/", priority: 0.6 },
  { slug: "contact", path: "/contact/", priority: 0.5 },
];

export default function sitemap() {
  const base = site.url.replace(/\/$/, "");

  const entries = [
    { url: `${base}/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/tools/`, priority: 0.9, changeFrequency: "weekly" },
  ];

  for (const page of CONTENT_PAGES) {
    if (getPage(page.slug)?.noindex) continue;
    entries.push({
      url: `${base}${page.path}`,
      priority: page.priority,
      changeFrequency: "monthly",
    });
  }

  for (const cat of categories) {
    entries.push({
      url: `${base}/category/${cat.id}/`,
      priority: 0.7,
      changeFrequency: "weekly",
    });
  }

  for (const tool of tools) {
    entries.push({
      url: `${base}/tools/${tool.slug}/`,
      priority: 0.8,
      changeFrequency: "monthly",
    });
  }

  return entries;
}
