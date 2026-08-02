"use client";

import { useEffect } from "react";

// GSAP entrance for the homepage hero.
//
// One rule governs what is in here: the <h1> is the LCP element, and LCP is
// only recorded once that element has actually painted. Anything that starts
// it at opacity 0 pushes the score out by the length of the animation, on the
// one page Google looks at hardest. So the headline text is never faded in.
// Its underline is drawn instead, which reads as the headline arriving while
// the words themselves are solid from the first frame.
//
// GSAP is imported dynamically so it is fetched after the page is interactive
// and only on the route that uses it, rather than sitting in the shared bundle
// that every tool page pays for.
export default function HeroMotion() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = document.querySelector(".hero");
    if (!hero) return;

    let ctx;
    let cancelled = false;

    import("gsap")
      .then(({ gsap }) => {
        if (cancelled) return;

        // Scoped so every target is looked up inside the hero and the whole
        // lot can be reverted in one call on unmount.
        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.out", duration: 0.7 },
          });

          tl.from(".hero-eyebrow", { opacity: 0, y: 8, duration: 0.5 })
            // The underline draws left to right under the accent phrase. The
            // words are already on screen at full opacity underneath it.
            .fromTo(
              ".hero h1 .accent",
              { "--u": "0%" },
              { "--u": "100%", duration: 0.9, ease: "power2.inOut" },
              "-=0.2"
            )
            .from(".hero .sub", { opacity: 0, y: 10 }, "-=0.55")
            .from(".search-wrap", { opacity: 0, y: 12 }, "-=0.5")
            .from(
              ".hero-stat",
              { opacity: 0, y: 14, stagger: 0.09, duration: 0.6 },
              "-=0.45"
            );
        }, hero);
      })
      .catch(() => {
        // A failed chunk must never leave the hero half animated. Everything
        // above animates *from* a hidden state, so if GSAP never arrives the
        // markup simply stays as the server rendered it: fully visible.
      });

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return null;
}
