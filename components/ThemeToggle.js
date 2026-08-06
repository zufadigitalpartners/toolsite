"use client";

/* Light and dark, one button. The pre-paint script in layout.js has
   already set data-theme from storage or the OS before this hydrates,
   so the toggle only ever flips and records; it never decides at load.
   State lives on <html>, not in React, so there is nothing to sync. */

export default function ThemeToggle() {
  const flip = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    if (next === "dark") root.dataset.theme = "dark";
    else delete root.dataset.theme;
    try { localStorage.setItem("tip-theme", next); } catch { /* private mode */ }
  };

  return (
    <button type="button" className="theme-toggle" onClick={flip} aria-label="Switch between light and dark mode">
      <svg className="tt-moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3a6.4 6.4 0 0 0 9 9 9 9 0 1 1-9-9z" />
      </svg>
      <svg className="tt-sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4" /><path d="M12 19.1v2.4" /><path d="M2.5 12h2.4" /><path d="M19.1 12h2.4" />
        <path d="m5 5 1.7 1.7" /><path d="m17.3 17.3 1.7 1.7" /><path d="m19 5-1.7 1.7" /><path d="m6.7 17.3-1.7 1.7" />
      </svg>
    </button>
  );
}
