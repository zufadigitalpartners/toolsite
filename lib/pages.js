// ======================================================
//  STATIC PAGES - content lives in content/pages/ (TinaCMS-managed)
//
//  Adding a page in Tina publishes it at /<filename>/ automatically.
//
//  Page shape:
//    title, metaTitle, metaDescription
//    noindex          -> keep the page out of Google and the sitemap
//    showUpdated      -> print a "Last updated" line under the H1
//    showContactForm  -> render the contact form on this page
//    footerGroup      -> "site" | "legal" | "none", which footer column
//    footerOrder      -> position inside that column
//    intro[]          -> opening paragraphs, no heading
//    sections[]       -> { heading, paragraphs[] }
//    body[]           -> legacy flat paragraph list, still supported
//
//  All text supports {siteName} / {contactEmail} / {siteUrl} tokens
//  plus **bold** and [link](/path/) markdown via components/RichText.
// ======================================================
import { site } from "./site";

const pageCtx = require.context("../content/pages", false, /\.json$/);

// Content files that feed a hand written route instead of /<slug>/.
const RESERVED_SLUGS = ["tools-index"];

export function getPage(slug) {
  const key = `./${slug}.json`;
  return pageCtx.keys().includes(key) ? pageCtx(key) : null;
}

export function allPages() {
  return pageCtx.keys().map((key) => ({
    slug: key.replace("./", "").replace(/\.json$/, ""),
    ...pageCtx(key),
  }));
}

// Pages that get their own /<slug>/ route.
export function routablePages() {
  return allPages().filter((page) => !RESERVED_SLUGS.includes(page.slug));
}

// Pages Google should index (legal boilerplate is deliberately excluded).
export function indexablePages() {
  return routablePages().filter((page) => !page.noindex);
}

// Footer links for one column, ordered.
export function footerPages(group) {
  return routablePages()
    .filter((page) => (page.footerGroup || "site") === group)
    .sort((a, b) => (a.footerOrder ?? 99) - (b.footerOrder ?? 99));
}

export function fill(text) {
  return text
    .split("{siteName}").join(site.name)
    .split("{contactEmail}").join(site.contactEmail)
    .split("{siteUrl}").join(site.url);
}
