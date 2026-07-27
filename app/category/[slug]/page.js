import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import RichText from "@/components/RichText";
import { categories, getCategory, toolsByCategory } from "@/lib/tools";
import { getCategoryContent } from "@/lib/content";
import { categoryMetadata } from "@/lib/seo";
import { ui } from "@/lib/site";

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.id }));
}

export function generateMetadata({ params }) {
  return categoryMetadata(params.slug);
}

export default function CategoryPage({ params }) {
  const cat = getCategory(params.slug);
  const list = toolsByCategory(cat.id);
  const content = getCategoryContent(cat.id);

  return (
    <>
      <section className="cat-hero" style={{ "--cat-color": cat.color }}>
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">{ui("toolPage.breadcrumbHome", "Home")}</Link> › {cat.name}
          </div>
          <h1>
            {cat.emoji} {cat.name}
            <span className="cat-count-pill">{ui("categoryPage.toolsPill", "{count} tools", { count: list.length })}</span>
          </h1>
          <p>{cat.desc}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid">
            {list.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      </section>

      {content && (
        <section className="section">
          <div className="container">
            <div className="tool-content" style={{ marginTop: 0 }}>
              <h2>{content.heading}</h2>
              {content.paragraphs.map((para, i) => (
                <RichText key={i} text={para} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{ui("categoryPage.moreHeading", "More categories")}</h2>
          </div>
          <div className="cat-grid">
            {categories.filter((c) => c.id !== cat.id).map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}/`}
                className="cat-card"
                style={{ "--cat-color": c.color }}
              >
                <span className="c-emoji">{c.emoji}</span>
                <div className="c-name">{c.name}</div>
                <div className="c-desc">{c.desc}</div>
                <div className="c-count">{ui("home.toolsCount", "{count} tools →", { count: toolsByCategory(c.id).length })}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
