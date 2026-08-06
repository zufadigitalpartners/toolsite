import { site } from "@/lib/site";
import { tools, categories } from "@/lib/tools";
import { indexablePages } from "@/lib/pages";
import { posts } from "@/lib/posts";
// route -> ISO date of the last commit that touched its content, generated
// by scripts/lastmod.mjs during build:local and committed. Honest dates or
// none: Google ignores lastmod site-wide once it catches the field lying.
import lastmod from "@/lib/lastmod.json";

// Static-export compatible: Next.js renders this to /sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap() {
  const base = site.url.replace(/\/$/, "");
  const mod = (route) => lastmod[route] || undefined;

  const entries = [
    { url: `${base}/`, lastModified: mod("/"), priority: 1.0, changeFrequency: "weekly" },
    { url: `${base}/tools/`, lastModified: mod("/tools/"), priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/blog/`, lastModified: mod("/blog/"), priority: 0.8, changeFrequency: "weekly" },
  ];

  for (const post of posts) {
    entries.push({
      url: `${base}/blog/${post.slug}/`,
      lastModified: mod(`/blog/${post.slug}/`) || post.date || undefined,
      priority: 0.7,
      changeFrequency: "monthly",
    });
  }

  // Every CMS page that is not marked noindex. Legal pages carry noindex
  // so they stay out of here automatically.
  for (const page of indexablePages()) {
    entries.push({
      url: `${base}/${page.slug}/`,
      lastModified: mod(`/${page.slug}/`),
      priority: 0.6,
      changeFrequency: "monthly",
    });
  }

  for (const cat of categories) {
    entries.push({
      url: `${base}/category/${cat.id}/`,
      lastModified: mod(`/category/${cat.id}/`),
      priority: 0.7,
      changeFrequency: "weekly",
    });
  }

  for (const tool of tools) {
    entries.push({
      url: `${base}/tools/${tool.slug}/`,
      lastModified: mod(`/tools/${tool.slug}/`),
      priority: 0.8,
      changeFrequency: "monthly",
    });
  }

  return entries;
}
