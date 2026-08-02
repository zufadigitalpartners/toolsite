"use client";

import { useEffect, useRef } from "react";

// The animated field behind the hero headline.
//
// A canvas rather than DOM nodes, because this draws a few hundred moving
// points and connecting lines and the browser should not be asked to lay out
// and composite that many elements sixty times a second on a phone.
//
// Points carry a z depth, so nearer ones are larger, brighter and drift
// faster. That parallax is what makes a flat canvas read as three
// dimensional without any 3D library at all.
//
// Three rules it will not break:
//   1. It never touches the headline. The h1 is the LCP element.
//   2. It stops completely when the hero scrolls off screen, so the rest of
//      the page costs nothing to scroll.
//   3. prefers-reduced-motion draws one still frame and stops.
export default function HeroScene() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let w = 0, h = 0, dpr = 1;
    let points = [];
    let raf = 0;
    let running = false;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    function build() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area, capped hard so a large desktop does not
      // quietly ask for two thousand points.
      const target = Math.round((w * h) / (coarse ? 19000 : 12000));
      const count = Math.max(18, Math.min(coarse ? 46 : 96, target));

      points = new Array(count).fill(0).map(() => {
        const z = 0.35 + Math.random() * 0.65; // depth: 0.35 far, 1 near
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          vx: (Math.random() - 0.5) * 0.16 * z,
          vy: (Math.random() - 0.5) * 0.16 * z,
          r: (0.7 + Math.random() * 1.5) * z,
        };
      });
    }

    // Distance at which two points are joined. Squared, so the inner loop
    // never calls Math.sqrt.
    const LINK = coarse ? 108 : 132;
    const LINK2 = LINK * LINK;

    function frame() {
      if (!running) return;

      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      const px = (pointer.x - 0.5) * 26;
      const py = (pointer.y - 0.5) * 18;

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        // wrap with a margin so points never pop at the edge
        if (p.x < -40) p.x = w + 40; else if (p.x > w + 40) p.x = -40;
        if (p.y < -40) p.y = h + 40; else if (p.y > h + 40) p.y = -40;
      }

      // Lines first, so the dots sit on top of them.
      ctx.lineWidth = 1;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const ax = a.x + px * a.z, ay = a.y + py * a.z;
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const bx = b.x + px * b.z, by = b.y + py * b.z;
          const dx = ax - bx, dy = ay - by;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK2) continue;
          const t = 1 - d2 / LINK2;
          ctx.strokeStyle = "rgba(125,168,255," + (t * 0.28 * ((a.z + b.z) / 2)).toFixed(3) + ")";
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }
      }

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        ctx.fillStyle = "rgba(160,196,255," + (0.16 + p.z * 0.42).toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(p.x + px * p.z, p.y + py * p.z, p.r, 0, 6.2832);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    build();
    if (reduced) {
      // one still frame, then nothing moves again
      running = true; frame(); running = false;
      if (raf) cancelAnimationFrame(raf);
      return () => {};
    }

    // Runs only when the hero is on screen AND the tab is in front. Both
    // conditions are tracked separately, otherwise coming back to a
    // backgrounded tab would restart the loop even with the hero scrolled
    // far out of view.
    let onScreen = false;
    const sync = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };

    const io = new IntersectionObserver(
      (entries) => { onScreen = entries[0].isIntersecting; sync(); },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = sync;
    document.addEventListener("visibilitychange", onVis);

    let resizeT = 0;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => { build(); }, 150);
    };
    window.addEventListener("resize", onResize);

    // Parallax follows the cursor on desktop only. A touch device has no
    // hover, and reading finger position during a scroll is a good way to
    // make scrolling feel heavy.
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / Math.max(1, rect.width);
      pointer.ty = (e.clientY - rect.top) / Math.max(1, rect.height);
    };
    if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      if (!coarse) window.removeEventListener("pointermove", onMove);
      clearTimeout(resizeT);
    };
  }, []);

  return <canvas ref={ref} className="hero-scene" aria-hidden="true" />;
}
