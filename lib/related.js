// ======================================================
//  RELATED TOOLS
//
//  Picks tools that genuinely belong together rather than whatever
//  happens to share a category.
//
//  The strongest signal is already in the content. Every tool's write-up
//  links to the tools it actually pairs with in real use ("after editing,
//  fix the capitalization with the case converter"). Those links were
//  written in context, so they mean far more than a category match. If
//  two tools link to each other, that is about as clear as it gets.
//
//  A tool can also name its own related tools in the CMS, which always
//  wins over anything worked out here.
// ======================================================
import { tools, getTool, categoryId } from "./tools";
import { getToolContent } from "./content";

const SCORE = {
  mutualLink: 100, // both write-ups point at each other
  outgoing: 60, // this tool points at that one
  incoming: 45, // that tool points at this one
  sameCategory: 30,
  sharedKeyword: 12, // capped below, so keywords cannot outweigh a real link
  keywordCap: 36,
  popular: 6, // tiebreak only
};

// Pull /tools/<slug>/ links out of everything written about a tool.
function outgoingLinks(slug) {
  const c = getToolContent(slug);
  if (!c) return new Set();
  const text = [
    ...(c.intro || []),
    ...(c.howto || []),
    ...(c.benefits || []),
    ...(c.useCases || []),
    ...(c.faqs || []).map((f) => f.a || ""),
  ].join(" ");
  const found = new Set();
  for (const m of text.matchAll(/\]\(\/tools\/([a-z0-9-]+)\/?\)/gi)) {
    if (m[1] !== slug) found.add(m[1]);
  }
  return found;
}

// Built once per build, then reused for every page.
let graph = null;
function linkGraph() {
  if (graph) return graph;
  graph = { out: new Map(), in: new Map() };
  for (const tool of tools) {
    const outs = outgoingLinks(tool.slug);
    graph.out.set(tool.slug, outs);
    for (const target of outs) {
      if (!graph.in.has(target)) graph.in.set(target, new Set());
      graph.in.get(target).add(tool.slug);
    }
  }
  return graph;
}

const keywordsOf = (slug) =>
  new Set((getToolContent(slug)?.keywords || []).map((k) => k.toLowerCase().trim()));

export function relatedTools(slug, count = 4) {
  const tool = getTool(slug);
  if (!tool) return [];

  // A hand-picked list in the CMS wins outright, in the order given.
  const manual = (tool.related || [])
    .map((ref) => String(ref).split("/").pop().replace(/\.json$/, ""))
    .filter((s) => s && s !== slug)
    .map(getTool)
    .filter(Boolean);
  if (manual.length >= count) return manual.slice(0, count);

  const g = linkGraph();
  const out = g.out.get(slug) || new Set();
  const inc = g.in.get(slug) || new Set();
  const myKeywords = keywordsOf(slug);
  const taken = new Set([slug, ...manual.map((t) => t.slug)]);

  const scored = tools
    .filter((t) => !taken.has(t.slug))
    .map((t) => {
      let score = 0;
      const linksToMe = inc.has(t.slug);
      const iLinkToIt = out.has(t.slug);

      if (iLinkToIt && linksToMe) score += SCORE.mutualLink;
      else if (iLinkToIt) score += SCORE.outgoing;
      else if (linksToMe) score += SCORE.incoming;

      if (categoryId(t.category) === categoryId(tool.category)) score += SCORE.sameCategory;

      if (myKeywords.size) {
        let shared = 0;
        for (const k of keywordsOf(t.slug)) if (myKeywords.has(k)) shared++;
        score += Math.min(shared * SCORE.sharedKeyword, SCORE.keywordCap);
      }

      if (t.popular) score += SCORE.popular;
      return { tool: t, score };
    })
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name));

  return [...manual, ...scored.map((s) => s.tool)].slice(0, count);
}
