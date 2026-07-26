// ======================================================
//  SEO CONTENT — sourced from content/ (TinaCMS-managed)
//
//  Every tool's long-form content lives in content/tools/<slug>.json:
//    seo.metaTitle / seo.metaDescription / seo.keywords
//    intro / howto / benefits / useCases / faqs
//  Category SEO content lives in content/categories/<id>.json under `seo`.
//
//  Inline internal links use markdown syntax: [anchor text](/tools/slug/)
//  They are rendered as <Link> by components/RichText.js.
// ======================================================

const catCtx = require.context("../content/categories", false, /\.json$/);
const toolCtx = require.context("../content/tools", false, /\.json$/);

const idFromKey = (key) => key.replace("./", "").replace(/\.json$/, "");

export const toolContent = Object.fromEntries(
  toolCtx.keys().map((key) => {
    const t = toolCtx(key);
    return [
      idFromKey(key),
      {
        metaTitle: t.seo?.metaTitle,
        metaDescription: t.seo?.metaDescription,
        keywords: t.seo?.keywords,
        intro: t.intro,
        howto: t.howto,
        benefits: t.benefits,
        useCases: t.useCases,
        faqs: t.faqs,
      },
    ];
  })
);

export const categoryContent = Object.fromEntries(
  catCtx
    .keys()
    .map((key) => [idFromKey(key), catCtx(key).seo])
    .filter(([, seo]) => seo)
);

export function getToolContent(slug) {
  return toolContent[slug] || null;
}

export function getCategoryContent(id) {
  return categoryContent[id] || null;
}
