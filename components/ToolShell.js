import Link from "next/link";
import { getTool, getCategory, relatedTools } from "@/lib/tools";
import { getToolContent } from "@/lib/content";
import { absUrl } from "@/lib/seo";
import ToolCard from "@/components/ToolCard";
import RichText, { stripLinks } from "@/components/RichText";

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function ToolShell({ slug, children }) {
  const tool = getTool(slug);
  const cat = getCategory(tool.category);
  const related = relatedTools(slug);
  const content = getToolContent(slug);

  const faqs = content?.faqs || tool.faqs || [];
  const howto = content?.howto || tool.howto || [];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: cat.name, item: absUrl(`/category/${cat.id}/`) },
      { "@type": "ListItem", position: 3, name: tool.name, item: absUrl(`/tools/${tool.slug}/`) },
    ],
  };

  const faqLd = faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: stripLinks(f.a) },
        })),
      }
    : null;

  return (
    <div className="container tool-page" style={{ "--cat-color": cat.color }}>
      <JsonLd data={breadcrumbLd} />
      {faqLd && <JsonLd data={faqLd} />}

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
        {content?.intro?.map((para, i) => (
          <RichText key={i} text={para} />
        ))}

        <h2>How to use</h2>
        <ol>
          {howto.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>

        {content?.benefits?.length > 0 && (
          <>
            <h2>Why use our {tool.name.toLowerCase()}?</h2>
            {content.benefits.map((para, i) => (
              <RichText key={i} text={para} />
            ))}
          </>
        )}

        {content?.useCases?.length > 0 && (
          <>
            <h2>Who is this tool for?</h2>
            {content.useCases.map((para, i) => (
              <RichText key={i} text={para} />
            ))}
          </>
        )}

        <h2>Frequently asked questions</h2>
        {faqs.map((f, i) => (
          <div className="faq" key={i}>
            <div className="q">{f.q}</div>
            <RichText text={f.a} className="a" />
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
