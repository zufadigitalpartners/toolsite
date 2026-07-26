import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import { site } from "@/lib/site";
import { tools, categories, toolsByCategory, popularTools } from "@/lib/tools";

export default function Home() {
  return (
    <>
      {/* ============ HERO — 3D animated scene ============ */}
      <section className="hero">
        {/* background layers */}
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />
        <div className="hero-floor" aria-hidden="true" />
        <div className="scene scene-1" aria-hidden="true">
          <div className="cube">
            <span className="f1" /><span className="f2" /><span className="f3" />
            <span className="f4" /><span className="f5" /><span className="f6" />
          </div>
        </div>
        <div className="scene scene-2" aria-hidden="true">
          <div className="cube">
            <span className="f1" /><span className="f2" /><span className="f3" />
            <span className="f4" /><span className="f5" /><span className="f6" />
          </div>
        </div>
        <span className="float-icon fi-1" aria-hidden="true">🔐</span>
        <span className="float-icon fi-2" aria-hidden="true">🧩</span>
        <span className="float-icon fi-3" aria-hidden="true">🔢</span>
        <span className="float-icon fi-4" aria-hidden="true">🎲</span>

        <div className="container hero-inner">
          <h1>
            {site.hero.heading}<br />
            <span className="accent">{site.hero.headingAccent}</span>
          </h1>
          <p className="sub">{site.hero.subheading}</p>
          <SearchBar />
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

      {/* ============ CATEGORY DECK (overlaps hero) ============ */}
      <section className="cat-deck">
        <div className="container">
          <div className="cat-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}/`}
                className="cat-card"
                style={{ "--cat-color": cat.color }}
              >
                <span className="c-arrow" aria-hidden="true">→</span>
                <span className="c-emoji">{cat.emoji}</span>
                <div className="c-name">{cat.name}</div>
                <div className="c-desc">{cat.desc}</div>
                <div className="c-count">{toolsByCategory(cat.id).length} tools →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POPULAR ============ */}
      <section className="section" id="tools">
        <div className="container">
          <div className="section-eyebrow">Most used</div>
          <div className="section-head">
            <h2>Popular tools</h2>
            <span className="count">{tools.length} tools and growing</span>
          </div>
          <div className="grid">
            {popularTools().map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORY SECTIONS ============ */}
      {categories.map((cat) => (
        <section className="section" id={`cat-${cat.id}`} key={cat.id}>
          <div className="container">
            <div className="section-head">
              <h2>
                {cat.emoji} {cat.name}
              </h2>
              <Link className="view-all" href={`/category/${cat.id}/`} style={{ color: cat.color }}>
                View all {toolsByCategory(cat.id).length} →
              </Link>
            </div>
            <div className="grid">
              {toolsByCategory(cat.id).slice(0, 4).map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ============ TRUST ============ */}
      <section className="section">
        <div className="container">
          <div className="why">
            <h2>Why {site.name}?</h2>
            <div className="why-grid">
              {site.whyUs.map((item, i) => (
                <div className="why-item" key={i}>
                  <div className="w-title"><span className="w-dot" />{item.title}</div>
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
