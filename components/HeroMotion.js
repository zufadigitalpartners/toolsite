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
          // Cancel the CSS fallback reveal before animating. An active CSS
          // animation outranks inline styles, so without this the fallback
          // would fight the timeline and win.
          gsap.set(".hero-eyebrow, .hero .sub, .search-wrap, .hero-stat", {
            animation: "none",
            opacity: 0,
          });

          const tl = gsap.timeline({
            defaults: { ease: "power3.out", duration: 0.7 },
          });

          // Nothing here touches the headline. It carries a gradient that
          // breathes on its own in CSS, and it is the LCP element, so it
          // paints once and is never animated.
          tl.to(".hero-eyebrow", { opacity: 1, y: 0, duration: 0.5 })
            .fromTo(".hero .sub", { y: 10 }, { opacity: 1, y: 0 }, "-=0.15")
            .fromTo(".search-wrap", { y: 12 }, { opacity: 1, y: 0 }, "-=0.5")
            .fromTo(
              ".hero-stat",
              { y: 14 },
              { opacity: 1, y: 0, stagger: 0.09, duration: 0.6 },
              "-=0.45"
            );
        }, hero);
      })
      .catch(() => {
        // Nothing to do. The hidden state and the reveal both live in CSS,
        // so a chunk that never arrives simply means the fallback keyframe
        // shows everything at 1.6s and no one sees a broken hero.
      });

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return null;
}
