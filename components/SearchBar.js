"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Icon from "@/lib/icons";
import { ui } from "@/lib/site";

/* Takes its list as a prop rather than importing the tools registry.
   That import looked harmless and was the most expensive line on the site:
   lib/tools.js bundles every tool's JSON through require.context, which
   means every tool's html, css, js and its whole article. Because this is a
   client component, all of it crossed into the browser bundle. 673 KB of
   it, growing with every tool added, to power a search that needs six
   fields per tool and about 11 KB in total.

   The page builds that light list on the server and passes it down. */
export default function SearchBar({ items = [] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? items
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            (t.short || "").toLowerCase().includes(q) ||
            (t.catName || "").toLowerCase().includes(q)
        )
        .slice(0, 8)
    : [];

  return (
    <div className="search-wrap">
      <div className="search-bar">
        <Icon name="search" size={20} className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder={ui("search.placeholder", "Search a tool… e.g. qr code")}
          aria-label="Search tools"
        />
        <span className="search-kbd" aria-hidden="true">/</span>
      </div>

      {q && (
        <div className="search-results">
          {results.length > 0 ? (
            results.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}/`} style={{ "--cat-color": t.catColor }}>
                <Icon name={t.icon} emoji={t.emoji} size={16} className="r-icon" />
                <span className="r-name">{t.name}</span>
                <span className="r-cat">{t.catName}</span>
              </Link>
            ))
          ) : (
            <div className="search-empty">
              {ui("search.noResults", "No tool found for “{query}”. More tools are added every week.", { query })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
