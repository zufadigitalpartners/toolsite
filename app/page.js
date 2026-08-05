import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import HeroMotion from "@/components/HeroMotion";
import HeroScene from "@/components/HeroScene";
import Icon from "@/lib/icons";
import { site, ui } from "@/lib/site";
import { tools, categories, toolsByCategory, popularTools, getCategory } from "@/lib/tools";
import { posts, coverSvg } from "@/lib/posts";

// Icons for the trust strip, in the order the CMS lists the items.
const WHY_ICONS = ["badge-check", "shield", "user-x", "smartphone"];

/* Three curated rows replaced thirteen identical category grids.
   Thirteen was what a category-per-section homepage grows into once the
   site passes a hundred tools: a wall nobody scrolls, where the strongest
   tools sit level with the weakest. These rows are chosen by the job the
   visitor arrived with, cross the category lines on purpose, and each one
   makes an argument. Browsing still lives in the deck above, the browse
   panel and the category pages. */
const SHOWCASE = [
  {
    id: "files",
    eyebrow: "Files",
    heading: "Your files never leave your device",
    copy:
      "Converting a passport scan or a client contract usually means uploading it to a company you found on page one of Google. These do the work in your browser instead. Load one, disconnect from the internet, and it still runs.",
    slugs: ["pdf-to-jpg", "heic-to-jpg", "image-compressor", "merge-pdf"],
    href: "/category/pdf/",
    linkLabel: "All file tools",
  },
  {
    id: "business",
    eyebrow: "Business documents",
    heading: "Paperwork that looks like a real company sent it",
    copy:
      "Invoice, quote, receipt, purchase order, credit note and packing slip, all from one engine so they match. Add your logo once and it appears on every one. No account, no watermark, no counter ticking toward a paywall.",
    slugs: ["invoice-generator", "quote-generator", "receipt-maker", "purchase-order-generator"],
    href: "/category/ecommerce/",
    linkLabel: "All business tools",
  },
  {
    id: "money",
    eyebrow: "Money",
    heading: "Money questions, answered with the working shown",
    copy:
      "Most finance calculators are lead-generation forms that want your email before the answer. These show the arithmetic, name their assumptions, and keep every number you type on your own machine.",
    slugs: ["rent-vs-buy-calculator", "mortgage-payment-calculator", "debt-payoff-planner", "fire-calculator"],
    href: "/category/finance/",
    linkLabel: "All money tools",
  },
];

export default function Home() {
  // Everything the search box needs and nothing it does not. Flattened here
  // so the client never receives a tool's code, article or SEO block.
  const searchIndex = tools.map((t) => {
    const c = getCategory(t.category);
    return {
      slug: t.slug,
      name: t.name,
      short: t.short,
      icon: t.icon,
      emoji: t.emoji,
      catName: c?.name,
      catColor: c?.color,
    };
  });

  // Three newest, so the row stays one line on desktop as the blog grows.
  const latestPosts = posts.slice(0, 3);

  return (
    <>
      {/* ============ HERO ============
          Left aligned, five elements, nothing else. No orbs, no cubes, no
          floating emoji, and no entrance animation: above-the-fold content
          being present at first paint is worth more than it moving. */}
      <section className="hero">
        {/* Drifting light. Its own clipping wrapper, because the search
            results panel opens downwards out of the hero and clipping the
            hero itself would cut it off. */}
        <div className="hero-fx" aria-hidden="true">
          <span className="b1" />
          <span className="b2" />
        </div>
        <HeroScene />
        <HeroMotion />
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="live-dot" aria-hidden="true" />
            <span>{ui("home.heroEyebrow", "Runs locally · Nothing uploaded")}</span>
          </div>

          <h1>
            {site.hero.heading}<br />
            <span className="accent">{site.hero.headingAccent}</span>
          </h1>
          <p className="sub">{site.hero.subheading}</p>

          {/* Six fields per tool, built here on the server. Letting the
              search box import the registry itself sent every tool's code
              and article to the browser. */}
          <SearchBar items={searchIndex} />

          <div className="hero-stats">
            {site.hero.stats.map((stat, i) => (
              <div className="hero-stat" key={i}>
                <div className="hs-num">{stat.value.replace("{toolCount}", tools.length)}</div>
                <div className="hs-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORY DECK ============ */}
      <section className="cat-deck">
        <div className="container">
          <div className="cat-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}/`}
                className="cat-cell"
                style={{ "--cat-color": cat.color }}
              >
                <Icon name={cat.icon} emoji={cat.emoji} size={22} className="c-icon" />
                <div className="c-name">{cat.name}</div>
                <div className="c-desc">{cat.desc}</div>
                <div className="c-count">
                  {ui("home.toolsCount", "{count} tools", { count: toolsByCategory(cat.id).length })}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POPULAR ============ */}
      <section className="section" id="tools">
        <div className="container">
          <div className="section-eyebrow">{ui("home.popularEyebrow", "Most used")}</div>
          <div className="section-head">
            <h2>{ui("home.popularHeading", "Popular tools")}</h2>
            <span className="count">
              {ui("home.toolsGrowing", "{count} tools and growing", { count: tools.length })}
            </span>
          </div>
          <div className="grid">
            {popularTools().slice(0, 12).map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ SHOWCASE ROWS ============ */}
      {SHOWCASE.map((row) => {
        const rowTools = row.slugs.map((s) => tools.find((t) => t.slug === s)).filter(Boolean);
        if (!rowTools.length) return null;
        return (
          <section className="section showcase" id={row.id} key={row.id}>
            <div className="container">
              <div className="sc-intro">
                <div className="section-eyebrow">{row.eyebrow}</div>
                <h2>{row.heading}</h2>
                <p>{row.copy}</p>
                <Link className="view-all" href={row.href}>
                  {row.linkLabel}
                  <Icon name="arrow-right" size={16} />
                </Link>
              </div>
              <div className="grid">
                {rowTools.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* ============ BLOG ============ */}
      {latestPosts.length > 0 && (
        <section className="section" id="blog">
          <div className="container">
            <div className="section-eyebrow">{ui("home.blogEyebrow", "From the blog")}</div>
            <div className="section-head">
              <h2>{ui("home.blogHeading", "Guides worth the read")}</h2>
              <Link className="view-all" href="/blog/">
                {ui("home.blogViewAll", "All articles")}
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
            <div className="blog-list">
              {latestPosts.map((p) => {
                const cat = getCategory(p.category);
                return (
                  <article className="blog-card" key={p.slug} style={{ "--cc": cat?.color || "var(--accent)" }}>
                    {/* aria-hidden: the heading link below already names the
                        post, so the cover would be a duplicate stop. */}
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
                      <h3>
                        <Link href={`/blog/${p.slug}/`}>{p.title}</Link>
                      </h3>
                      <p>{p.excerpt}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ TRUST ============ */}
      <section className="section">
        <div className="container">
          <div className="why">
            <h2>Why {site.name}?</h2>
            <div className="why-grid">
              {site.whyUs.map((item, i) => (
                <div className="why-item" key={i}>
                  <div className="w-title">
                    <Icon name={WHY_ICONS[i % WHY_ICONS.length]} size={20} className="w-icon" />
                    {item.title}
                  </div>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
