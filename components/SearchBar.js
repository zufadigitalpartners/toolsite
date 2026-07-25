"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { tools, getCategory } from "@/lib/tools";

export default function SearchBar() {
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
    ? tools
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.short.toLowerCase().includes(q) ||
            getCategory(t.category)?.name.toLowerCase().includes(q)
        )
        .slice(0, 8)
    : [];

  return (
    <div className="search-wrap">
      <div className="search-bar">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder="Search a tool… e.g. qr code"
          aria-label="Search tools"
        />
        <span className="search-kbd" aria-hidden="true">/</span>
      </div>

      {q && (
        <div className="search-results">
          {results.length > 0 ? (
            results.map((t) => {
              const cat = getCategory(t.category);
              return (
                <Link key={t.slug} href={`/tools/${t.slug}/`} style={{ "--cat-color": cat?.color }}>
                  <span>{t.emoji}</span>
                  <span className="r-name">{t.name}</span>
                  <span className="r-cat">{cat?.name}</span>
                </Link>
              );
            })
          ) : (
            <div className="search-empty">
              No tool found for “{query}” — more tools are added every week.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
