import { site } from "@/lib/site";
import { tools, categories } from "@/lib/tools";

// Static-export compatible: Next.js renders this to /sitemap.xml at build time.
export const dynamic = "force-static";

export default function sitemap() {
  const base = site.url.replace(/\/$/, "");

  const staticPages = [
    { url: `${base}/`, priority: 1.0 },
    { url: `${base}/about/`, priority: 0.5 },
    { url: `${base}/contact/`, priority: 0.4 },
    { url: `${base}/privacy-policy/`, priority: 0.3 },
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${base}/category/${cat.id}/`,
    priority: 0.7,
  }));

  const toolPages = tools.map((tool) => ({
    url: `${base}/tools/${tool.slug}/`,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...toolPages].map((page) => ({
    ...page,
    changeFrequency: "monthly",
  }));
}
