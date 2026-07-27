"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// Header categories dropdown. Replaces the old <details> element, which
// could not close itself on outside clicks or after navigation on mobile.
export default function CategoryMenu({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="cat-dd" ref={ref}>
      <button
        type="button"
        className="cat-dd-btn"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>
      {open && (
        <div className="dd-menu">
          {items.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}/`}
              style={{ "--cat-color": cat.color }}
              onClick={() => setOpen(false)}
            >
              <span className="dd-dot" />
              {cat.name}
              <span className="dd-count">{cat.count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
