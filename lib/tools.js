// ======================================================
//  TOOLS REGISTRY — content lives in content/ (TinaCMS-managed)
//  Naya tool add karna ho to:
//  1) Tina admin (/admin) me — ya content/tools/<slug>.json me — entry banao
//  2) components/tools/<Naam>.js banao
//  3) app/tools/<slug>/page.js banao
//  Homepage, search, category pages, footer — sab khud update ho jayega
// ======================================================

// require.context bundles every JSON in the folder, so a file added via
// Tina automatically appears everywhere these arrays are used.
const catCtx = require.context("../content/categories", false, /\.json$/);
const toolCtx = require.context("../content/tools", false, /\.json$/);

const idFromKey = (key) => key.replace("./", "").replace(/\.json$/, "");
const byOrder = (a, b) =>
  (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name);

export const categories = catCtx
  .keys()
  .map((key) => ({ id: idFromKey(key), ...catCtx(key) }))
  .sort(byOrder);

export const tools = toolCtx
  .keys()
  .map((key) => ({ slug: idFromKey(key), ...toolCtx(key) }))
  .sort(byOrder);

export function getTool(slug) {
  return tools.find((t) => t.slug === slug);
}

export function getCategory(id) {
  return categories.find((c) => c.id === id);
}

export function toolsByCategory(id) {
  return tools.filter((t) => t.category === id);
}

export function popularTools() {
  return tools.filter((t) => t.popular);
}

export function relatedTools(slug, count = 4) {
  const tool = getTool(slug);
  if (!tool) return [];
  const same = tools.filter((t) => t.slug !== slug && t.category === tool.category);
  const others = tools.filter((t) => t.slug !== slug && t.category !== tool.category);
  return [...same, ...others].slice(0, count);
}
