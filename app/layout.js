import "./globals.css";
import Link from "next/link";
import { site, ui } from "@/lib/site";
import { categories, tools, toolsByCategory } from "@/lib/tools";
import { footerPages, fill } from "@/lib/pages";
import { OG_IMAGE } from "@/lib/seo";
import BrowsePanel from "@/components/BrowsePanel";
import ThemeToggle from "@/components/ThemeToggle";
import MobileNav from "@/components/MobileNav";
import Reveal from "@/components/Reveal";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.homeTitle}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} | ${site.homeTitle}`,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} | ${site.homeTitle}`,
    description: site.description,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Organization + WebSite schema, emitted once site-wide so Google can
// tie every page back to one brand and offer a sitelinks search box.
/* Footer families, five columns instead of one per category. Each carries
   its four strongest tools, hand-picked by search demand, not the first
   four the registry happens to list: the footer is a shop window, and a
   round-robin was filling it from the stockroom. */
const FOOTER_FAMILIES = [
  { id: "files", label: "Files and images", cats: ["pdf", "image"],
    top: ["merge-pdf", "pdf-to-jpg", "image-compressor", "heic-to-jpg"] },
  { id: "money", label: "Money and property", cats: ["finance", "property", "crypto"],
    top: ["debt-payoff-planner", "mortgage-payment-calculator", "rent-vs-buy-calculator", "crypto-profit-calculator"] },
  { id: "life", label: "Health and everyday", cats: ["health", "calculators"],
    top: ["calorie-calculator", "bmi-calculator", "pregnancy-due-date-calculator", "percentage-calculator"] },
  { id: "work", label: "Business and content", cats: ["ecommerce", "social", "spreadsheet"],
    top: ["invoice-generator", "quote-generator", "hashtag-generator", "excel-to-csv"] },
  { id: "build", label: "Text and developer", cats: ["text", "developer", "generators"],
    top: ["word-counter", "qr-code-generator", "password-generator", "json-formatter"] },
];

/* A category added in the CMS that nobody thought to place here would
   otherwise vanish from the footer without a word. Unplaced ones join the
   last family instead, so the failure is visible rather than silent. */
function footerFamilies() {
  const placed = new Set(FOOTER_FAMILIES.flatMap((f) => f.cats));
  const orphans = categories.map((c) => c.id).filter((id) => !placed.has(id));
  if (!orphans.length) return FOOTER_FAMILIES;
  return FOOTER_FAMILIES.map((f, i) =>
    i === FOOTER_FAMILIES.length - 1 ? { ...f, cats: [...f.cats, ...orphans] } : f
  );
}

const siteLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      email: site.contactEmail,
      description: site.description,
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      name: site.name,
      url: site.url,
      description: site.description,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }) {
  // Two-tone wordmark: everything but the last word in ink, the last word
  // muted. Derived from the CMS site name so renaming still works.
  const nameWords = String(site.name || "").trim().split(/\s+/);
  const logoParts =
    nameWords.length > 1
      ? [nameWords.slice(0, -1).join(" ") + " ", nameWords[nameWords.length - 1]]
      : [site.name, ""];

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate" type="application/rss+xml" title={`${site.name} Blog`} href="/feed.xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#f8fafc" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Inter across the interface, per the design reference the owner
            locked in. Chivo Mono stays for code and tool output, where a
            mono face is function rather than styling. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..800&family=Chivo+Mono:wght@400..500&display=swap"
          rel="stylesheet"
        />
        {/* Opts this browser into the scroll-driven reveals, before first
            paint so there is no flash of already-visible cards. Anything
            that does not run scripts, a crawler included, never gets the
            class and therefore sees the page with nothing faded out. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(CSS.supports('animation-timeline','view()')&&!matchMedia('(prefers-reduced-motion:reduce)').matches)document.documentElement.className+=' rvl-css'}catch(e){}",
          }}
        />
        {/* Theme, decided before first paint so dark mode never flashes.
            Light is the default for everyone; dark only ever comes from the
            user's own toggle, never from the operating system. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('tip-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }}
        />

        {/* Head section managed in Tina: Site Settings > Header code */}
        {site.verificationTags.map((tag, i) =>
          tag?.name && tag?.content ? (
            <meta key={i} name={tag.name} content={tag.content} />
          ) : null
        )}
        {site.headScripts.map((entry, i) =>
          entry?.src ? (
            <script
              key={i}
              src={entry.src}
              async={entry.async !== false}
              crossOrigin={entry.crossorigin || undefined}
            />
          ) : null
        )}
        {site.inlineHeadCode ? (
          <script dangerouslySetInnerHTML={{ __html: site.inlineHeadCode }} />
        ) : null}

        {/* Google Analytics. Just the measurement ID goes in Site Settings,
            the tag itself is assembled here. */}
        {site.analyticsId ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${site.analyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.analyticsId}');`,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        <header className="site-header">
          <div className="container">
            {/* The wordmark is the logo. A gradient tile with an emoji in it
                was the most dated element in the header. */}
            <Link href="/" className="logo">
              {logoParts[0]}
              {logoParts[1] ? <span className="logo-soft">{logoParts[1]}</span> : null}
            </Link>
            <nav className="header-nav" aria-label="Main">
              {/* Built on the server and passed down as four fields per
                  tool. The panel is a client component, so importing the
                  registry inside it would send every tool's code and
                  article to the browser. */}
              <BrowsePanel
                label={ui("nav.categories", "Browse tools")}
                groups={categories.map((cat) => ({
                  id: cat.id,
                  name: cat.name,
                  color: cat.color,
                  icon: cat.icon,
                  emoji: cat.emoji,
                  tools: toolsByCategory(cat.id).map((t) => ({
                    slug: t.slug,
                    name: t.name,
                    short: t.short,
                    icon: t.icon,
                    emoji: t.emoji,
                  })),
                }))}
              />
              <Link href="/tools/">{ui("nav.allTools", "All tools")}</Link>
              <Link href="/blog/">{ui("nav.blog", "Blog")}</Link>
              <Link href="/about/">{ui("nav.about", "About")}</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main>{children}</main>
        <MobileNav />
        <Reveal />

        <footer className="site-footer">
          <div className="container">
            <div className="footer-grid">
              {/* Grouped into families rather than one column per category.
                  Thirteen columns was a mega-footer that scrolled longer than
                  some pages; five reads at a glance and every link survives,
                  each family ending in links to its category pages. */}
              {footerFamilies().map((fam) => {
                const famCats = fam.cats.map((id) => categories.find((c) => c.id === id)).filter(Boolean);
                // Exactly four, the hand-picked best. A missing slug simply
                // drops out, so a renamed tool shortens the list instead of
                // crashing the build.
                const famTools = (fam.top || [])
                  .map((slug) => tools.find((t) => t.slug === slug))
                  .filter(Boolean);
                return (
                  <div key={fam.id}>
                    <h3>{fam.label}</h3>
                    <ul>
                      {famTools.map((t) => (
                        <li key={t.slug}>
                          <Link href={`/tools/${t.slug}/`}>{t.name}</Link>
                        </li>
                      ))}
                      {famCats.map((c, i) => (
                        <li key={c.id} className={i === 0 ? "f-first" : undefined}>
                          <Link href={`/category/${c.id}/`} className="f-cat">
                            {ui("nav.footerAllIn", "All {name} →", { name: c.name })}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
              <div>
                <h3>{ui("nav.footerSiteHeading", "Site")}</h3>
                <ul>
                  <li><Link href="/tools/">{ui("nav.allTools", "All tools")}</Link></li>
                  <li><Link href="/blog/">{ui("nav.blog", "Blog")}</Link></li>
                  {footerPages("site").map((page) => (
                    <li key={page.slug}>
                      <Link href={`/${page.slug}/`}>
                        {fill(page.metaTitle || page.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>{ui("nav.footerLegalHeading", "Legal")}</h3>
                <ul>
                  {footerPages("legal").map((page) => (
                    <li key={page.slug}>
                      <Link href={`/${page.slug}/`}>
                        {fill(page.metaTitle || page.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} {site.name}. {site.footer.line1}</span>
              <span>{site.footer.line2}</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
