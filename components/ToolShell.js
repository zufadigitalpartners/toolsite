import Link from "next/link";
import { getTool, getCategory, relatedTools } from "@/lib/tools";
import ToolCard from "@/components/ToolCard";

export default function ToolShell({ slug, children }) {
  const tool = getTool(slug);
  const cat = getCategory(tool.category);
  const related = relatedTools(slug);

  return (
    <div className="container tool-page" style={{ "--cat-color": cat.color }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link> ›{" "}
        <Link href={`/category/${cat.id}/`} className="bc-cat">{cat.name}</Link> › {tool.name}
      </div>

      <h1 className="tool-title">
        <span className="tt-emoji">{tool.emoji}</span> {tool.name}
      </h1>
      <p className="tool-sub">{tool.short} 100% free, no signup — everything runs in your browser.</p>

      <div className="tool-panel">{children}</div>

      <div className="tool-content">
        <h2>How to use</h2>
        <ol>
          {tool.howto.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        <h2>Frequently asked questions</h2>
        {tool.faqs.map((f, i) => (
          <div className="faq" key={i}>
            <div className="q">{f.q}</div>
            <p className="a">{f.a}</p>
          </div>
        ))}
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Related tools</h2>
          </div>
          <div className="grid">
            {related.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
