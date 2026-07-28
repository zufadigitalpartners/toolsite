// ======================================================
//  STATIC PAGES - content lives in content/pages/ (TinaCMS-managed)
//
//  Page shape:
//    title, metaTitle, metaDescription
//    noindex      -> keep the page out of Google and the sitemap
//    showUpdated  -> print a "Last updated" line under the H1
//    intro[]      -> opening paragraphs, no heading
//    sections[]   -> { heading, paragraphs[] }
//    body[]       -> legacy flat paragraph list, still supported
//
//  All text supports {siteName} / {contactEmail} / {siteUrl} tokens
//  plus **bold** and [link](/path/) markdown via components/RichText.
// ======================================================
import { site } from "./site";

const pageCtx = require.context("../content/pages", false, /\.json$/);

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

// Pages Google should index (legal boilerplate is deliberately excluded).
export function indexablePages() {
  return allPages().filter((p) => !p.noindex);
}

export function fill(text) {
  return text
    .split("{siteName}").join(site.name)
    .split("{contactEmail}").join(site.contactEmail)
    .split("{siteUrl}").join(site.url);
}
