// ======================================================
//  TOOLS REGISTRY - content lives in content/ (TinaCMS-managed)
//
//  Naya tool add karna ho to sirf Tina admin (/admin) me Tools > Add File
//  karo. Page, homepage, search, category page aur footer sab khud update
//  ho jate hain. Tool ka code usi entry me paste hota hai.
//
//  Naya category b Tina se ban jata hai: Categories > Add File.
// ======================================================

// require.context bundles every JSON in the folder, so a file added via
// Tina automatically appears everywhere these arrays are used.
const catCtx = require.context("../content/categories", false, /\.json$/);
const toolCtx = require.context("../content/tools", false, /\.json$/);

const idFromKey = (key) => key.replace("./", "").replace(/\.json$/, "");

// Tina reference fields store a path like "content/categories/text.json",
// while older entries stored a bare id like "text". Accept both.
export function categoryId(value) {
  if (!value) return "";
  return String(value).split("/").pop().replace(/\.json$/, "");
}

const byOrder = (a, b) =>
  (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name);

export const categories = catCtx
  .keys()
  .map((key) => ({ id: idFromKey(key), ...catCtx(key) }))
  .sort(byOrder);

export const tools = toolCtx
  .keys()
  .map((key) => {
    const data = toolCtx(key);
    return { ...data, slug: idFromKey(key), category: categoryId(data.category) };
  })
  .sort(byOrder);

export function getTool(slug) {
  return tools.find((t) => t.slug === slug);
}

export function getCategory(id) {
  return categories.find((c) => c.id === categoryId(id));
}

export function toolsByCategory(id) {
  return tools.filter((t) => t.category === categoryId(id));
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
