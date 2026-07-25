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
            Every tool you need,<br />
            <span className="accent">free and in your browser</span>
          </h1>
          <p className="sub">
            No signup. No uploads. No limits. Everything runs locally on your
            device — private by design and instant by default.
          </p>
          <SearchBar />
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hs-num">{tools.length}+</div>
              <div className="hs-label">Free tools</div>
            </div>
            <div className="hero-stat">
              <div className="hs-num">0</div>
              <div className="hs-label">Uploads</div>
            </div>
            <div className="hero-stat">
              <div className="hs-num">100%</div>
              <div className="hs-label">Free forever</div>
            </div>
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
              <div className="why-item">
                <div className="w-title"><span className="w-dot" />100% free, forever</div>
                <p>Every tool is completely free. No trials, no premium walls, no hidden limits.</p>
              </div>
              <div className="why-item">
                <div className="w-title"><span className="w-dot" />Private by design</div>
                <p>Your text and files are processed inside your browser. Nothing is uploaded to any server.</p>
              </div>
              <div className="why-item">
                <div className="w-title"><span className="w-dot" />No signup needed</div>
                <p>Open a tool and start working. No account, no email, no interruptions.</p>
              </div>
              <div className="why-item">
                <div className="w-title"><span className="w-dot" />Works everywhere</div>
                <p>Fast on mobile and desktop, and new tools are added every week.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
