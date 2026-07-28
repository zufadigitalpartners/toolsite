import { site } from "@/lib/site";
import { getTool, getCategory } from "@/lib/tools";
import { getToolContent, getCategoryContent } from "@/lib/content";
import { getPage } from "@/lib/pages";

// Shared social preview card, used on every page.
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: `${site.name}, free online tools that run in your browser`,
};

// One place that builds the social tags, so every page gets the same
// treatment and the preview card can never go missing.
function social({ title, description, url, ogTitle }) {
  return {
    openGraph: {
      title: ogTitle || `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      type: "website",
      locale: "en_US",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

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
    ...social({ title, description, url }),
  };
}

// Builds the full metadata object for a tool page.
// Every tool page just does: export const metadata = toolMetadata("slug");
export function toolMetadata(slug) {
  const tool = getTool(slug);
  const content = getToolContent(slug);
  const title = content?.metaTitle || `${tool.name}: Free Online Tool`;
  const description = content?.metaDescription || tool.short;
  const url = `/tools/${slug}/`;

  return {
    title,
    description,
    keywords: content?.keywords,
    alternates: { canonical: url },
    ...social({ title, description, url }),
  };
}

export function categoryMetadata(id) {
  const cat = getCategory(id);
  if (!cat) return {};
  const seo = getCategoryContent(id);
  const title = seo?.metaTitle || `${cat.name}: Free and Instant, No Signup`;
  const description =
    seo?.metaDescription ||
    `${cat.desc} Every tool is free, runs in your browser and needs no account.`;
  const url = `/category/${id}/`;

  return {
    title,
    description,
    keywords: seo?.keywords,
    alternates: { canonical: url },
    ...social({ title, description, url }),
  };
}

// Absolute URL helper for JSON-LD (schema.org requires absolute URLs).
export function absUrl(path) {
  return `${site.url.replace(/\/$/, "")}${path}`;
}
