"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/lib/icons";

/* The whole catalogue in one panel: every tool, grouped by category, with a
   search box at the top.

   Its data arrives as a prop. Importing the tools registry here would pull
   every tool's code and article into the browser bundle, which is exactly
   the bug that had the homepage shipping 673 KB it never used.

   History: opening the panel pushes a history entry carrying a flag,
   merged over Next's own router state rather than replacing it. That one
   entry buys the two behaviours phones expect. Back with the panel open
   closes the panel instead of leaving the page. And back from a tool you
   opened THROUGH the panel lands on the flagged entry, so the panel
   reopens where you left it, instead of dumping you on a bare homepage. */
export default function BrowsePanel({ label = "Browse", groups = [] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  // Which category groups are expanded. Phones start with all of them
  // folded so 13 categories scan in one screen; desktops start open.
  const [expanded, setExpanded] = useState(() => new Set());
  const [hydrated, setHydrated] = useState(false);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const triggerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    setHydrated(true);
    if (window.matchMedia("(min-width: 761px)").matches) {
      setExpanded(new Set(groups.map((g) => g.id)));
    }
    // Arriving here via Back from a tool that was opened through the
    // panel: the flagged entry is ours, reopen.
    if (window.history.state?.tipBrowse) setOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openPanel = () => {
    setOpen(true);
    // Merge, never replace: Next keeps its own keys in history.state and
    // clobbering them breaks back/forward restoration.
    if (!window.history.state?.tipBrowse) {
      window.history.pushState({ ...window.history.state, tipBrowse: true }, "");
    }
  };

  // User dismissal consumes our history entry so Back afterwards leaves
  // the page as normal. The popstate handler does the actual closing.
  const dismiss = () => {
    if (window.history.state?.tipBrowse) window.history.back();
    else setOpen(false);
  };

  useEffect(() => {
    const onPop = () => {
      if (window.history.state?.tipBrowse) setOpen(true);
      else setOpen(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Close on navigation, but keep our flagged entry underneath the new
  // route: that entry is what makes Back bring the panel back. The guard
  // is the point: when Back has just restored the flagged entry, this
  // effect fires for the pathname change too, and without the check it
  // would close the panel the popstate handler just reopened.
  useEffect(() => {
    if (!window.history.state?.tipBrowse) setOpen(false);
  }, [pathname]);

  // The mobile bottom bar's Search button lives in another component; it
  // asks this panel to open through a window event rather than threading
  // state up through the server layout.
  useEffect(() => {
    const openUp = () => openPanel();
    window.addEventListener("tip-open-browse", openUp);
    return () => window.removeEventListener("tip-open-browse", openUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { dismiss(); triggerRef.current?.focus(); }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const toggleGroup = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

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
        onClick={openPanel}
      >
        {label}
        <Icon name="chevron-down" size={14} className="dd-chev" />
      </button>

      {open && hydrated && (
        <>
          <div className="bp-veil" onClick={dismiss} aria-hidden="true" />
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
              <button type="button" className="bp-close" onClick={dismiss} aria-label="Close">
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
                filtered.map((g) => {
                  // A live search overrides the folding: matches must show.
                  const isOpen = query ? true : expanded.has(g.id);
                  return (
                    <section className="bp-group" key={g.id} style={{ "--cc": g.color }}>
                      <h3>
                        <button
                          type="button"
                          className="bp-cat"
                          aria-expanded={isOpen}
                          onClick={() => toggleGroup(g.id)}
                        >
                          <Icon name={g.icon} emoji={g.emoji} size={16} />
                          {g.name}
                          <span className="bp-count">{g.tools.length}</span>
                          <Icon name="chevron-down" size={15} className="bp-chev" />
                        </button>
                      </h3>
                      {isOpen && (
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
                      )}
                    </section>
                  );
                })
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
