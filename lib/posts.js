// Blog posts, loaded the same way tools and categories are: require.context
// over the folder, so an article added in Tina appears everywhere without
// touching code.
//
// This module is server only. It carries every article's full body, and a
// client component that imported it would ship the entire blog to the
// browser, which is the mistake that had the homepage sending every tool's
// code and article to every visitor.

const ctx = require.context("../content/posts", false, /\.json$/);
const idFromKey = (key) => key.replace("./", "").replace(/\.json$/, "");

export function categoryId(value) {
  if (!value) return "";
  return String(value).split("/").pop().replace(/\.json$/, "");
}

function wordCount(post) {
  const parts = [];
  (post.sections || []).forEach((s) => {
    if (s.heading) parts.push(s.heading);
    (s.paragraphs || []).forEach((p) => parts.push(p));
    (s.bullets || []).forEach((b) => parts.push(b));
    if (s.callout) parts.push(s.callout);
  });
  (post.faqs || []).forEach((f) => parts.push(f.q, f.a));
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

export const posts = ctx
  .keys()
  .map((key) => {
    const data = ctx(key);
    const words = wordCount(data);
    return {
      ...data,
      slug: idFromKey(key),
      category: categoryId(data.category),
      words,
      // 220 words a minute is the usual reading speed for this kind of
      // writing. Rounded up, because nobody finishes in 4.2 minutes.
      readMinutes: data.readMinutes || Math.max(1, Math.ceil(words / 220)),
    };
  })
  // newest first, and anything without a date sorts last rather than
  // crashing the comparison
  .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}

/* Related articles: same category first, then whatever is newest, never
   the article you are reading. */
export function relatedPosts(slug, count = 3) {
  const current = getPost(slug);
  if (!current) return posts.slice(0, count);
  const sameCat = posts.filter((p) => p.slug !== slug && p.category === current.category);
  const rest = posts.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCat, ...rest].slice(0, count);
}

/* A cover drawn from the title, so an article is never published without
   one and never depends on somebody finding a stock photo. Deterministic:
   the same title always produces the same shapes, so it does not change
   between builds. Returned as an SVG string to inline, which costs no
   request and stays sharp at any size. */
export function coverSvg(title, color = "#1D5FC4") {
  let seed = 0;
  for (let i = 0; i < String(title).length; i++) seed = (seed * 31 + title.charCodeAt(i)) % 100000;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const shapes = [];
  for (let i = 0; i < 7; i++) {
    const x = Math.round(rnd() * 1200);
    const y = Math.round(rnd() * 630);
    const r = Math.round(90 + rnd() * 220);
    const o = (0.05 + rnd() * 0.13).toFixed(3);
    shapes.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${o}"/>`);
  }
  for (let i = 0; i < 4; i++) {
    const x1 = Math.round(rnd() * 1200);
    const y1 = Math.round(rnd() * 630);
    shapes.push(
      `<line x1="${x1}" y1="${y1}" x2="${Math.round(x1 + (rnd() - 0.5) * 700)}" y2="${Math.round(
        y1 + (rnd() - 0.5) * 400
      )}" stroke="${color}" stroke-width="1.5" opacity="0.22"/>`
    );
  }
  return `<svg viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><rect width="1200" height="630" fill="#12141c"/>${shapes.join(
    ""
  )}</svg>`;
}
