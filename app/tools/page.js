import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import PageBody from "@/components/PageBody";
import { categories, tools, toolsByCategory } from "@/lib/tools";
import { getPage, fill } from "@/lib/pages";
import { pageMetadata, absUrl } from "@/lib/seo";
import { ui } from "@/lib/site";

const SLUG = "tools-index";

export const metadata = pageMetadata(SLUG, "/tools/");

export default function AllToolsPage() {
  const page = getPage(SLUG);

  // ItemList schema so search engines can read the full tool directory.
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: page?.title || "All tools",
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: tool.name,
      url: absUrl(`/tools/${tool.slug}/`),
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: "All tools", item: absUrl("/tools/") },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="cat-hero" style={{ "--cat-color": "#4f7cff" }}>
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">{ui("toolPage.breadcrumbHome", "Home")}</Link> › All tools
          </div>
          <h1>
            {page?.title ? fill(page.title) : "All tools"}
            <span className="cat-count-pill">{tools.length} tools</span>
          </h1>
          {page?.subtitle && <p>{fill(page.subtitle)}</p>}
        </div>
      </section>

      {categories.map((cat) => {
        const list = toolsByCategory(cat.id);
        if (!list.length) return null;
        return (
          <section className="section" id={cat.id} key={cat.id} style={{ "--cat-color": cat.color }}>
            <div className="container">
              <div className="section-head">
                <h2>
                  {cat.emoji} {cat.name}
                </h2>
                <Link className="view-all" href={`/category/${cat.id}/`} style={{ color: cat.color }}>
                  {ui("home.viewAll", "View all {count} →", { count: list.length })}
                </Link>
              </div>
              <div className="grid">
                {list.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {page && (
        <section className="section">
          <div className="container">
            <div className="tool-content" style={{ marginTop: 0 }}>
              <PageBody page={page} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
