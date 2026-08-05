import Link from "next/link";
import Icon from "@/lib/icons";
import { posts, coverSvg } from "@/lib/posts";
import { getCategory } from "@/lib/tools";
import { site, ui } from "@/lib/site";
import { absUrl } from "@/lib/seo";

export const metadata = {
  title: ui("blog.metaTitle", "Blog"),
  description: ui(
    "blog.metaDescription",
    "Guides on getting things done with files, spreadsheets, images and social posts, from the people building the tools."
  ),
  alternates: { canonical: "/blog/" },
};

export default function BlogIndex() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} blog`,
    url: absUrl("/blog/"),
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.date,
      url: absUrl(`/blog/${p.slug}/`),
    })),
  };

  return (
    <div className="container page-prose blog-index">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      <h1>{ui("blog.heading", "Guides and write-ups")}</h1>
      <p className="lead">
        {ui(
          "blog.intro",
          "Longer pieces on the jobs the tools do: getting a file under a size limit, stopping Excel from damaging your data, working out what to charge. Written by the person building them."
        )}
      </p>

      <div className="blog-list">
        {posts.map((p) => {
          const cat = getCategory(p.category);
          return (
            <article className="blog-card" key={p.slug} style={{ "--cc": cat?.color || "var(--accent)" }}>
              <Link href={`/blog/${p.slug}/`} className="bc-cover" aria-hidden="true" tabIndex={-1}>
                {p.cover ? (
                  <img src={p.cover} alt="" loading="lazy" />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: coverSvg(p.title, cat?.color) }} />
                )}
              </Link>
              <div className="bc-body">
                <div className="bc-meta">
                  {cat && (
                    <span className="bc-cat">
                      <Icon name={cat.icon} emoji={cat.emoji} size={14} />
                      {cat.name}
                    </span>
                  )}
                  <span>{p.readMinutes} min read</span>
                </div>
                <h2>
                  <Link href={`/blog/${p.slug}/`}>{p.title}</Link>
                </h2>
                <p>{p.excerpt}</p>
              </div>
            </article>
          );
        })}
      </div>

      {posts.length === 0 && (
        <p className="note">Nothing published yet. Add the first article in Tina under Blog posts.</p>
      )}
    </div>
  );
}
