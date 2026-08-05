import Link from "next/link";
import Icon from "@/lib/icons";
import RichText, { stripLinks } from "@/components/RichText";
import { posts, getPost, relatedPosts, coverSvg } from "@/lib/posts";
import { getCategory, getTool, toolsByCategory } from "@/lib/tools";
import { site, ui } from "@/lib/site";
import { absUrl, OG_IMAGE } from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }) {
  const p = getPost(params.slug);
  if (!p) return {};
  const title = p.seo?.metaTitle || p.title;
  const description = p.seo?.metaDescription || p.excerpt;
  return {
    title,
    description,
    keywords: p.seo?.keywords,
    alternates: { canonical: `/blog/${p.slug}/` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: p.date,
      url: `/blog/${p.slug}/`,
      images: p.cover ? [{ url: absUrl(p.cover), width: 1200, height: 630 }] : [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Deterministic ids so the heading and its jump link can never drift apart.
function anchor(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export default function BlogPost({ params }) {
  const post = getPost(params.slug);
  if (!post) return null;

  const cat = getCategory(post.category);
  const related = relatedPosts(post.slug, 3);

  // Tools beside the article: the ones named on the post, otherwise the
  // ones from its category, so the rail is never empty.
  const picked = (post.relatedTools || [])
    .map((s) => getTool(String(s).split("/").pop().replace(/\.json$/, "")))
    .filter(Boolean);
  const sidebarTools = (picked.length ? picked : toolsByCategory(post.category)).slice(0, 5);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      mainEntityOfPage: absUrl(`/blog/${post.slug}/`),
      author: { "@type": "Organization", name: site.name, url: site.url },
      publisher: { "@type": "Organization", name: site.name, url: site.url },
      image: post.cover ? absUrl(post.cover) : OG_IMAGE.url,
      wordCount: post.words,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absUrl("/") },
        { "@type": "ListItem", position: 2, name: "Blog", item: absUrl("/blog/") },
        { "@type": "ListItem", position: 3, name: post.title, item: absUrl(`/blog/${post.slug}/`) },
      ],
    },
  ];
  if (post.faqs?.length) {
    ld.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: stripLinks(f.a) },
      })),
    });
  }

  const headings = (post.sections || []).filter((s) => s.heading).map((s) => s.heading);

  return (
    <div className="container blog-post" style={{ "--cc": cat?.color || "var(--accent)" }}>
      {ld.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <div className="breadcrumb">
        <Link href="/">{ui("toolPage.breadcrumbHome", "Home")}</Link> ›{" "}
        <Link href="/blog/">{ui("blog.crumb", "Blog")}</Link> › {post.title}
      </div>

      <header className="bp-header">
        <h1>{post.title}</h1>
        <p className="bp-lead">{post.excerpt}</p>
        <div className="bp-byline">
          {cat && (
            <span className="bc-cat">
              <Icon name={cat.icon} emoji={cat.emoji} size={14} />
              {cat.name}
            </span>
          )}
          {post.date && <span>{post.date}</span>}
          <span>{post.readMinutes} min read</span>
        </div>
      </header>

      <figure className="bp-cover">
        {post.cover ? (
          <img src={post.cover} alt={post.coverAlt || ""} width="1200" height="630" />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: coverSvg(post.title, cat?.color) }} />
        )}
        {post.coverAlt && <figcaption>{post.coverAlt}</figcaption>}
      </figure>

      <div className="blog-body">
        <article className="blog-article">
          {headings.length > 2 && (
            <nav className="bp-toc" aria-label="On this page">
              <h2>{ui("blog.onThisPage", "On this page")}</h2>
              <ol>
                {headings.map((h) => (
                  <li key={h}>
                    <a href={`#${anchor(h)}`}>{h}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {(post.sections || []).map((s, i) => (
            <section key={i}>
              {s.heading && <h2 id={anchor(s.heading)}>{s.heading}</h2>}
              {(s.paragraphs || []).map((p, j) => (
                <RichText key={j} text={p} />
              ))}
              {s.bullets?.length > 0 && (
                <ul>
                  {s.bullets.map((b, j) => (
                    <li key={j}>
                      <RichText text={b} as="span" />
                    </li>
                  ))}
                </ul>
              )}
              {s.callout && (
                <aside className="bp-callout">
                  <RichText text={s.callout} />
                </aside>
              )}
            </section>
          ))}

          {post.outbound?.url && (
            <aside className="bp-source">
              <h2>{ui("blog.sourceHeading", "Worth reading next")}</h2>
              <a href={post.outbound.url} target="_blank" rel="noopener noreferrer">
                {post.outbound.label || post.outbound.url}
                <Icon name="arrow-right" size={15} />
              </a>
              {post.outbound.note && <p>{post.outbound.note}</p>}
            </aside>
          )}

          {post.faqs?.length > 0 && (
            <>
              <h2 id="faq">{ui("blog.faqHeading", "Questions people ask")}</h2>
              {post.faqs.map((f, i) => (
                <div className="faq" key={i}>
                  <div className="q">{f.q}</div>
                  <RichText text={f.a} className="a" />
                </div>
              ))}
            </>
          )}
        </article>

        <aside className="blog-rail">
          {sidebarTools.length > 0 && (
            <div>
              <h3>{ui("blog.toolsHeading", "Tools for this")}</h3>
              <div className="pw-chips">
                {sidebarTools.map((t) => (
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
            <h2>{ui("blog.relatedHeading", "Read next")}</h2>
            <Link className="view-all" href="/blog/">
              {ui("blog.allPosts", "All articles")}
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="blog-list">
            {related.map((p) => {
              const c = getCategory(p.category);
              return (
                <article className="blog-card" key={p.slug} style={{ "--cc": c?.color || "var(--accent)" }}>
                  <Link href={`/blog/${p.slug}/`} className="bc-cover" aria-hidden="true" tabIndex={-1}>
                    {p.cover ? (
                      <img src={p.cover} alt="" loading="lazy" />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: coverSvg(p.title, c?.color) }} />
                    )}
                  </Link>
                  <div className="bc-body">
                    <div className="bc-meta">
                      <span>{p.readMinutes} min read</span>
                    </div>
                    <h3>
                      <Link href={`/blog/${p.slug}/`}>{p.title}</Link>
                    </h3>
                    <p>{p.excerpt}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
