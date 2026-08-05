"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/lib/icons";

/* The whole catalogue in one panel: every tool, grouped by category, with a
   search box at the top.

   It replaces a dropdown that listed only the nine categories, which meant
   reaching any single tool took two steps and a scan of a category page.
   With fifty-four tools that had stopped being reasonable.

   Its data arrives as a prop. Importing the tools registry here would pull
   every tool's code and article into the browser bundle, which is exactly
   the bug that had the homepage shipping 673 KB it never used. */
export default function BrowsePanel({ label = "Browse", groups = [] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const triggerRef = useRef(null);
  const pathname = usePathname();

  // Close on navigation, otherwise the panel stays over the page you just
  // asked for.
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    // Stop the page behind from scrolling while the panel is over it.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Focus the search box, since typing is why most people open this.
    const t = setTimeout(() => searchRef.current?.focus(), 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return groups;
    return groups
      .map((g) => ({
        ...g,
        tools: g.tools.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            (t.short || "").toLowerCase().includes(query) ||
            g.name.toLowerCase().includes(query)
        ),
      }))
      .filter((g) => g.tools.length > 0);
  }, [groups, query]);

  const hits = filtered.reduce((a, g) => a + g.tools.length, 0);
  const total = groups.reduce((a, g) => a + g.tools.length, 0);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="cat-dd-btn"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {label}
        <Icon name="chevron-down" size={14} className="dd-chev" />
      </button>

      {open && (
        <>
          <div className="bp-veil" onClick={() => setOpen(false)} aria-hidden="true" />
          <aside
            className="bp"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Browse all tools"
          >
            <div className="bp-head">
              <div>
                <h2>All tools</h2>
                <p>{total} tools across {groups.length} categories</p>
              </div>
              <button type="button" className="bp-close" onClick={() => setOpen(false)} aria-label="Close">
                ×
              </button>
            </div>

            <div className="bp-search">
              <Icon name="search" size={18} />
              <input
                ref={searchRef}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search all tools…"
                aria-label="Search all tools"
              />
              {q && (
                <button type="button" onClick={() => setQ("")} aria-label="Clear search">×</button>
              )}
            </div>

            <div className="bp-body">
              {filtered.length === 0 ? (
                <p className="bp-empty">
                  Nothing matches “{q}”. Try a shorter word, or the job you are
                  trying to do rather than the tool's name.
                </p>
              ) : (
                filtered.map((g) => (
                  <section className="bp-group" key={g.id} style={{ "--cc": g.color }}>
                    <h3>
                      <Icon name={g.icon} emoji={g.emoji} size={15} />
                      {g.name}
                      <span>{g.tools.length}</span>
                    </h3>
                    <ul>
                      {g.tools.map((t) => (
                        <li key={t.slug}>
                          <Link href={`/tools/${t.slug}/`}>
                            <Icon name={t.icon} emoji={t.emoji} size={17} />
                            <span className="bp-name">{t.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))
              )}
            </div>

            {query && (
              <div className="bp-foot">
                {hits} {hits === 1 ? "tool" : "tools"} matching “{q}”
              </div>
            )}
          </aside>
        </>
      )}
    </>
  );
}
