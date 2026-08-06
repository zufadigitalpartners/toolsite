import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import HeroMotion from "@/components/HeroMotion";
import Icon from "@/lib/icons";
import { site, ui } from "@/lib/site";
import { tools, categories, toolsByCategory, popularTools, getCategory } from "@/lib/tools";
import { posts, coverSvg } from "@/lib/posts";

// Icons for the trust strip, in the order the CMS lists the items.
const WHY_ICONS = ["badge-check", "shield", "user-x", "smartphone"];

/* The floating chips around the hero: six real categories, hand-placed.
   Decoration that happens to be clickable, so they are hidden from the
   accessibility tree and the tab order rather than being six extra stops. */
const HERO_CHIPS = [
  { cat: "pdf", style: { top: "12%", left: "6%" } },
  { cat: "image", style: { top: "58%", left: "3%" } },
  { cat: "finance", style: { top: "30%", left: "13%" } },
  { cat: "crypto", style: { top: "14%", right: "6%" } },
  { cat: "health", style: { top: "34%", right: "13%" } },
  { cat: "ecommerce", style: { top: "62%", right: "4%" } },
];

/* Quick links under the search box: the searches people actually arrive
   with, each one a real tool. */
const POPULAR_SEARCHES = [
  { slug: "pdf-to-jpg", label: "PDF to JPG" },
  { slug: "image-compressor", label: "Compress image" },
  { slug: "invoice-generator", label: "Invoice" },
  { slug: "qr-code-generator", label: "QR code" },
  { slug: "word-counter", label: "Word counter" },
  { slug: "calorie-calculator", label: "Calories" },
];

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
        {/* Floating category chips, wide screens only. */}
        <div className="hero-chips" aria-hidden="true">
          {HERO_CHIPS.map(({ cat, style }) => {
            const c = getCategory(cat);
            if (!c) return null;
            return (
              <Link key={cat} href={`/category/${cat}/`} className="hero-chip"
                style={{ ...style, "--cc": c.color }} tabIndex={-1}>
                <Icon name={c.icon} emoji={c.emoji} size={22} />
              </Link>
            );
          })}
        </div>
        <HeroMotion />
        <div className="hero-inner">
          <div className="hero-pill hero-eyebrow">
            <span className="live-dot" aria-hidden="true" />
            <span>{ui("home.heroEyebrow", "100% free · No sign-up · Nothing uploaded")}</span>
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

          <div className="hero-searches">
            <span>{ui("home.popularSearches", "Popular:")}</span>
            {POPULAR_SEARCHES.map((s) => (
              <Link key={s.slug} href={`/tools/${s.slug}/`}>{s.label}</Link>
            ))}
          </div>

          {/* Four true facts. The reference puts invented user counts here;
              ours are checkable claims, which sell better to the people
              who check. */}
          <div className="hero-stats">
            <div className="hero-stat">
              <Icon name="badge-check" size={18} className="hs-icon" />
              <div>
                <span className="hs-num">{ui("home.fact1", "{count} tools", { count: tools.length })}</span>
                <span className="hs-label">{ui("home.fact1Label", "free forever")}</span>
              </div>
            </div>
            <div className="hero-stat">
              <Icon name="user-x" size={18} className="hs-icon" />
              <div>
                <span className="hs-num">{ui("home.fact2", "No sign-up")}</span>
                <span className="hs-label">{ui("home.fact2Label", "just open and use")}</span>
              </div>
            </div>
            <div className="hero-stat">
              <Icon name="shield" size={18} className="hs-icon" />
              <div>
                <span className="hs-num">{ui("home.fact3", "0 uploads")}</span>
                <span className="hs-label">{ui("home.fact3Label", "files stay on your device")}</span>
              </div>
            </div>
            <div className="hero-stat">
              <Icon name="smartphone" size={18} className="hs-icon" />
              <div>
                <span className="hs-num">{ui("home.fact4", "Any device")}</span>
                <span className="hs-label">{ui("home.fact4Label", "phone, tablet, laptop")}</span>
              </div>
            </div>
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

      {/* ============ STATS BAND ============
          Every number here is checkable against the site itself. */}
      <section className="section" aria-label="Site facts">
        <div className="container">
          <div className="stats-band">
            <div className="sb-item">
              <Icon name="sparkles" size={22} className="sb-icon" />
              <div>
                <span className="sb-num">{tools.length}</span>
                <span className="sb-label">{ui("home.bandTools", "free tools")}</span>
              </div>
            </div>
            <div className="sb-item">
              <Icon name="layers" size={22} className="sb-icon" />
              <div>
                <span className="sb-num">{categories.length}</span>
                <span className="sb-label">{ui("home.bandCats", "categories")}</span>
              </div>
            </div>
            <div className="sb-item">
              <Icon name="shield" size={22} className="sb-icon" />
              <div>
                <span className="sb-num">0</span>
                <span className="sb-label">{ui("home.bandUploads", "files uploaded, ever")}</span>
              </div>
            </div>
            <div className="sb-item">
              <Icon name="user-x" size={22} className="sb-icon" />
              <div>
                <span className="sb-num">0</span>
                <span className="sb-label">{ui("home.bandAccounts", "accounts required")}</span>
              </div>
            </div>
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
