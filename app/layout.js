import "./globals.css";
import Link from "next/link";
import { site } from "@/lib/site";
import { categories, toolsByCategory } from "@/lib/tools";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Free Online Tools`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.name} — Free Online Tools`,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: `${site.name} — Free Online Tools`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="logo">
              <span className="logo-mark">🧰</span>
              {site.name}
            </Link>
            <nav className="header-nav" aria-label="Main">
              <details className="cat-dd">
                <summary>Categories</summary>
                <div className="dd-menu">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.id}/`}
                      style={{ "--cat-color": cat.color }}
                    >
                      <span className="dd-dot" />
                      {cat.name}
                      <span className="dd-count">{toolsByCategory(cat.id).length}</span>
                    </Link>
                  ))}
                </div>
              </details>
              <Link href="/#tools">All tools</Link>
              <Link href="/about/">About</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div className="container">
            <div className="footer-grid">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <h3>{cat.name}</h3>
                  <ul>
                    {toolsByCategory(cat.id).map((t) => (
                      <li key={t.slug}>
                        <Link href={`/tools/${t.slug}/`}>{t.name}</Link>
                      </li>
                    ))}
                    <li>
                      <Link href={`/category/${cat.id}/`}>View all →</Link>
                    </li>
                  </ul>
                </div>
              ))}
              <div>
                <h3>Site</h3>
                <ul>
                  <li><Link href="/about/">About</Link></li>
                  <li><Link href="/contact/">Contact</Link></li>
                  <li><Link href="/privacy-policy/">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} {site.name}. All tools are free to use.</span>
              <span>Your files never leave your browser.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
