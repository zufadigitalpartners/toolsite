import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ToolCard from "@/components/ToolCard";
import HeroMotion from "@/components/HeroMotion";
import HeroScene from "@/components/HeroScene";
import Icon from "@/lib/icons";
import { site, ui } from "@/lib/site";
import { tools, categories, toolsByCategory, popularTools } from "@/lib/tools";

// Icons for the trust strip, in the order the CMS lists the items.
const WHY_ICONS = ["badge-check", "shield", "user-x", "smartphone"];

export default function Home() {
  return (
    <>
      {/* ============ HERO ============
          Left aligned, five elements, nothing else. No orbs, no cubes, no
          floating emoji, and no entrance animation: above-the-fold content
          being present at first paint is worth more than it moving. */}
      <section className="hero">
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
            {popularTools().slice(0, 8).map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORY SECTIONS ============ */}
      {categories.map((cat) => (
        <section className="section" id={`cat-${cat.id}`} key={cat.id}>
          <div className="container">
            <div className="section-head" style={{ "--cat-color": cat.color }}>
              <h2>
                <Icon name={cat.icon} emoji={cat.emoji} size={20} className="h-icon" />
                {cat.name}
              </h2>
              <Link className="view-all" href={`/category/${cat.id}/`}>
                {ui("home.viewAll", "View all {count}", { count: toolsByCategory(cat.id).length })}
                <Icon name="arrow-right" size={16} />
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
