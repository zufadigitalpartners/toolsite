// ======================================================
//  STATIC PAGES — content lives in content/pages/ (TinaCMS-managed)
//  Body paragraphs support {siteName} / {contactEmail} / {siteUrl}
//  tokens plus **bold** and [link](/path/) markdown via RichText.
// ======================================================
import { site } from "./site";

const pageCtx = require.context("../content/pages", false, /\.json$/);

export function getPage(slug) {
  const key = `./${slug}.json`;
  return pageCtx.keys().includes(key) ? pageCtx(key) : null;
}

export function fill(text) {
  return text
    .split("{siteName}").join(site.name)
    .split("{contactEmail}").join(site.contactEmail)
    .split("{siteUrl}").join(site.url);
}
