import Link from "next/link";
import { ui } from "@/lib/site";
import { getTool, getCategory } from "@/lib/tools";
import { relatedTools } from "@/lib/related";
import { getToolContent } from "@/lib/content";
import { absUrl } from "@/lib/seo";
import Icon from "@/lib/icons";
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

// Anchors for the rail's jump list. Kept deterministic so the id in the
// heading and the id in the link can never drift apart.
function anchor(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function ToolShell({ slug, children }) {
  const tool = getTool(slug);
  const cat = getCategory(tool.category);
  // Eight for the grid at the foot of the page, because eight divides evenly
  // into the ruled grid's four and two columns. The strongest three go in the
  // rail, where someone who has just finished using the tool is looking.
  const related = relatedTools(slug, 8);
  const nextUp = related.slice(0, 3);
  const content = getToolContent(slug);

  const faqs = content?.faqs || tool.faqs || [];
  const howto = content?.howto || tool.howto || [];

  const howToHeading = ui("toolPage.howToHeading", "How to use");
  const whyHeading = ui("toolPage.whyHeading", "Why use our {name}?", { name: tool.name.toLowerCase() });
  const whoHeading = ui("toolPage.whoHeading", "Who is this tool for?");
  const faqHeading = ui("toolPage.faqHeading", "Frequently asked questions");

  const sections = [
    { id: anchor(howToHeading), label: howToHeading },
    content?.benefits?.length ? { id: anchor(whyHeading), label: whyHeading } : null,
    content?.useCases?.length ? { id: anchor(whoHeading), label: whoHeading } : null,
    faqs.length ? { id: anchor(faqHeading), label: faqHeading } : null,
  ].filter(Boolean);

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
        <Link href="/">{ui("toolPage.breadcrumbHome", "Home")}</Link> ›{" "}
        <Link href={`/category/${cat.id}/`} className="bc-cat">{cat.name}</Link> › {tool.name}
      </div>

      <h1 className="tool-title">
        <Icon name={tool.icon} emoji={tool.emoji} size={24} className="tt-icon" />
        {tool.name}
      </h1>
      <p className="tool-sub">{tool.short} {ui("toolPage.subSuffix", "100% free, no signup. Everything runs in your browser.")}</p>

      <div className="tool-panel">
        <div className="tool-panel__head">
          <span className="live-dot" aria-hidden="true" />
          <span>{tool.name}</span>
          <span className="tp-right">{ui("toolPage.runsLocally", "Runs locally")}</span>
        </div>
        {children}
      </div>

      <div className="tool-body">
        <div className="tool-content">
          {content?.intro?.map((para, i) => (
            <RichText key={i} text={para} />
          ))}

          <h2 id={anchor(howToHeading)}>{howToHeading}</h2>
          <ol>
            {howto.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          {content?.benefits?.length > 0 && (
            <>
              <h2 id={anchor(whyHeading)}>{whyHeading}</h2>
              {content.benefits.map((para, i) => (
                <RichText key={i} text={para} />
              ))}
            </>
          )}

          {content?.useCases?.length > 0 && (
            <>
              <h2 id={anchor(whoHeading)}>{whoHeading}</h2>
              {content.useCases.map((para, i) => (
                <RichText key={i} text={para} />
              ))}
            </>
          )}

          {faqs.length > 0 && (
            <>
              <h2 id={anchor(faqHeading)}>{faqHeading}</h2>
              {faqs.map((f, i) => (
                <div className="faq" key={i}>
                  <div className="q">{f.q}</div>
                  <RichText text={f.a} className="a" />
                </div>
              ))}
            </>
          )}
        </div>

        {/* The rail. Previously this was 370px of empty page running the whole
            length of every article. */}
        <aside className="tool-rail">
          {sections.length > 1 && (
            <div>
              <h3>{ui("toolPage.onThisPage", "On this page")}</h3>
              <nav className="rail-toc">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`}>{s.label}</a>
                ))}
              </nav>
            </div>
          )}

          {nextUp.length > 0 && (
            <div>
              <h3>{ui("toolPage.pairsWith", "Works well with")}</h3>
              <div className="pw-chips">
                {nextUp.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}/`}
                    className="pw-chip"
                    style={{ "--cc": getCategory(t.category)?.color }}
                  >
                    <Icon name={t.icon} emoji={t.emoji} size={16} className="t-icon" />
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3>{ui("toolPage.privacyHeading", "Privacy")}</h3>
            <div className="rail-privacy">
              <div><span>{ui("toolPage.privacyUploads", "Uploads")}</span><b>0</b></div>
              <div><span>{ui("toolPage.privacyServer", "Server calls")}</span><b>0</b></div>
              <div><span>{ui("toolPage.privacyAccount", "Account")}</span><b>{ui("toolPage.privacyNotRequired", "Not required")}</b></div>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>{ui("toolPage.relatedHeading", "Related tools")}</h2>
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
