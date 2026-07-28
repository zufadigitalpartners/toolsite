import { site } from "@/lib/site";
import { tools, categories } from "@/lib/tools";
import { indexablePages } from "@/lib/pages";

// Static-export compatible: Next.js renders this to /sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap() {
  const base = site.url.replace(/\/$/, "");

  const entries = [
    { url: `${base}/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/tools/`, priority: 0.9, changeFrequency: "weekly" },
  ];

  // Every CMS page that is not marked noindex. Legal pages carry noindex
  // so they stay out of here automatically.
  for (const page of indexablePages()) {
    entries.push({
      url: `${base}/${page.slug}/`,
      priority: 0.6,
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
