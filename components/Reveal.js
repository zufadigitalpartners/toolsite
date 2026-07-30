"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Adds a subtle rise-in animation to cards and sections as they scroll
// into view. Pure progressive enhancement: without JS (or with reduced
// motion) everything renders normally, so SEO and no-JS users see the
// full page.
const SELECTORS = ".tool-card, .cat-cell, .why-item, .faq";

export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = document.querySelectorAll(SELECTORS);
    if (!els.length) return;
    document.documentElement.classList.add("rvl");
    els.forEach((el, i) => {
      if (el.classList.contains("rvl-in")) return;
      el.setAttribute("data-rvl", "");
      el.style.setProperty("--rvl-d", `${(i % 5) * 70}ms`);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("rvl-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
