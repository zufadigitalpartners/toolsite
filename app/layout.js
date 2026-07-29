import "./globals.css";
import Link from "next/link";
import { site, ui } from "@/lib/site";
import { categories, toolsByCategory } from "@/lib/tools";
import { footerPages, fill } from "@/lib/pages";
import { OG_IMAGE } from "@/lib/seo";
import CategoryMenu from "@/components/CategoryMenu";
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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#0c1224" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
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
            <Link href="/" className="logo">
              <span className="logo-mark">{ui("nav.logoEmoji", "🧰")}</span>
              {site.name}
            </Link>
            <nav className="header-nav" aria-label="Main">
              <CategoryMenu
                label={ui("nav.categories", "Categories")}
                items={categories.map((cat) => ({
                  id: cat.id,
                  name: cat.name,
                  color: cat.color,
                  count: toolsByCategory(cat.id).length,
                }))}
              />
              <Link href="/tools/">{ui("nav.allTools", "All tools")}</Link>
              <Link href="/about/">{ui("nav.about", "About")}</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
        <Reveal />

        <footer className="site-footer">
          <div className="container">
            <div className="footer-grid">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <h3>{cat.name}</h3>
                  <ul>
                    {/* Capped so the footer does not keep growing as tools
                        are added. The rest live on the category page. */}
                    {toolsByCategory(cat.id).slice(0, site.footerToolLimit).map((t) => (
                      <li key={t.slug}>
                        <Link href={`/tools/${t.slug}/`}>{t.name}</Link>
                      </li>
                    ))}
                    <li>
                      <Link href={`/category/${cat.id}/`}>{ui("nav.footerViewAll", "View all →")}</Link>
                    </li>
                  </ul>
                </div>
              ))}
              <div>
                <h3>{ui("nav.footerSiteHeading", "Site")}</h3>
                <ul>
                  <li><Link href="/tools/">{ui("nav.allTools", "All tools")}</Link></li>
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
