"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Two jobs, both progressive enhancement: reveal cards as they scroll in,
// and mark the article section the reader is currently in so the rail's
// jump list tracks them.
//
// The reveal half only runs on browsers WITHOUT scroll-driven animations.
// Where `animation-timeline: view()` exists the same effect is done in
// globals.css, on the compositor, with this file doing nothing at all:
// no observer, no per-element style writes, no main-thread work.
const SELECTORS = ".tool-card, .cat-cell, .why-item, .faq";

function supportsScrollDriven() {
  return typeof CSS !== "undefined" && CSS.supports && CSS.supports("animation-timeline", "view()");
}

export default function Reveal() {
  const pathname = usePathname();

  // ---- reveal (fallback only) ----
  useEffect(() => {
    if (supportsScrollDriven()) return;
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

  // ---- rail jump list follows the reader ----
  // There is no CSS way to style a link based on which *other* element is on
  // screen, so this one genuinely needs an observer. It is small, it only
  // runs on tool pages, and it makes the rail feel like a real table of
  // contents rather than a list of links.
  useEffect(() => {
    const links = document.querySelectorAll(".rail-toc a");
    if (!links.length) return;

    const byId = new Map();
    const headings = [];
    links.forEach((a) => {
      const id = decodeURIComponent(a.getAttribute("href") || "").slice(1);
      const h = id && document.getElementById(id);
      if (h) {
        byId.set(h, a);
        headings.push(h);
      }
    });
    if (!headings.length) return;

    let current = null;
    const setCurrent = (a) => {
      if (a === current) return;
      if (current) current.removeAttribute("aria-current");
      current = a;
      if (current) current.setAttribute("aria-current", "true");
    };

    // A scroll listener rather than an IntersectionObserver. An observer only
    // fires when something crosses its boundary, so scrolling past two
    // headings in one gesture, or jumping back to the top, leaves the
    // highlight on whatever it last saw. Recomputing the answer is both
    // simpler and always right, and with a handful of headings it is a few
    // rect reads coalesced into one frame.
    let queued = false;
    const update = () => {
      queued = false;
      const line = 140;
      let active = null;
      for (const h of headings) {
        if (h.getBoundingClientRect().top <= line) active = h;
      }
      setCurrent(active ? byId.get(active) : null);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (current) current.removeAttribute("aria-current");
    };
  }, [pathname]);

  return null;
}
