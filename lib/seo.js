import { site } from "@/lib/site";
import { getTool, getCategory } from "@/lib/tools";
import { getToolContent } from "@/lib/content";
import { getPage } from "@/lib/pages";

// Metadata for a static content page. Legal pages set noindex: true in
// their JSON so they stay out of Google while remaining fully readable.
export function pageMetadata(slug, path) {
  const page = getPage(slug);
  if (!page) return {};
  const title = page.metaTitle || page.title;
  const description = page.metaDescription;
  const url = path || `/${slug}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: page.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}

// Builds the full metadata object for a tool page.
// Every tool page just does: export const metadata = toolMetadata("slug");
export function toolMetadata(slug) {
  const tool = getTool(slug);
  const content = getToolContent(slug);
  const title = content?.metaTitle || `${tool.name} - Free Online Tool`;
  const description = content?.metaDescription || tool.short;
  const path = `/tools/${slug}/`;

  return {
    title,
    description,
    keywords: content?.keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export function categoryMetadata(id) {
  const cat = getCategory(id);
  if (!cat) return {};
  const title = `${cat.name} - Free Online ${cat.name}`;
  const description = `${cat.desc} All ${cat.name.toLowerCase()} are free, run in your browser and need no signup.`;
  const path = `/category/${id}/`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// Absolute URL helper for JSON-LD (schema.org requires absolute URLs).
export function absUrl(path) {
  return `${site.url.replace(/\/$/, "")}${path}`;
}
