import { posts } from "@/lib/posts";
import { site } from "@/lib/site";
import { absUrl } from "@/lib/seo";

// The blog as RSS. Feeds are still one of the fastest discovery channels
// there is: Google's crawler reads them cheaply and often, and the WebSub
// hub declared below is Google's own, so a publish ping after each deploy
// tells it the moment something new exists. Static export renders this to
// /feed.xml at build time.
export const dynamic = "force-static";

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = posts
    .map((p) => {
      const url = absUrl(`/blog/${p.slug}/`);
      const date = p.date ? new Date(p.date + "T08:00:00Z").toUTCString() : "";
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${date ? `<pubDate>${date}</pubDate>` : ""}
      <description>${esc(p.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} Blog</title>
    <link>${absUrl("/blog/")}</link>
    <description>${esc(site.description)}</description>
    <language>en</language>
    <atom:link href="${absUrl("/feed.xml")}" rel="self" type="application/rss+xml" />
    <atom:link href="https://pubsubhubbub.appspot.com/" rel="hub" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
