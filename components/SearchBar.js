"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Icon from "@/lib/icons";
import { tools, getCategory } from "@/lib/tools";
import { ui } from "@/lib/site";

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
            results.map((t) => {
              const cat = getCategory(t.category);
              return (
                <Link key={t.slug} href={`/tools/${t.slug}/`} style={{ "--cat-color": cat?.color }}>
                  <Icon name={t.icon} emoji={t.emoji} size={16} className="r-icon" />
                  <span className="r-name">{t.name}</span>
                  <span className="r-cat">{cat?.name}</span>
                </Link>
              );
            })
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
