// Stylesheet injected into every embedded tool so that a tool pasted into
// TinaCMS automatically looks like the rest of the site. Anyone writing a
// tool can use these class names and get the native look for free:
//
//   .row .row-2         layout helpers
//   label               field label
//   input, textarea, select, .field
//   .btn  .btn-primary  buttons
//   .stats .stat        result tiles
//   .out                monospace output box
//   .note  .error       helper and error text
//
// The tool's own <style> block always wins, because it is injected after
// this one, so a tool can override anything it needs to.
export const EMBED_BASE_CSS = `
:root {
  /* White, because the panel a tool sits inside is the raised surface.
     The recessed steps match the site's so an input looks the same here. */
  --surface: #ffffff;
  --surface-2: #f4f6fa;
  --surface-3: #e7ebf2;
  --ink: #12141c;
  --ink-2: #333a49;
  --muted: #5c6577;
  --line: #e6eaf1;
  --line-strong: #d2d9e4;
  --accent: var(--cat-color, #1d4ed8);
  --accent-press: #163cad;
  --on-ink: #f7f9fc;
  --on-ink-2: #9aa3b4;
  --on-ink-3: #6e7688;
  --ok: #2f5d3a; --ok-bg: #f1f5f1; --ok-line: #c9dbce;
  --danger: #a3372a; --danger-bg: #fbf2f0; --danger-line: #e5c9c3;

  --s1: 4px; --s2: 8px; --s3: 12px; --s4: 16px;
  --s5: 24px; --s6: 32px; --s7: 48px; --s8: 72px;
  --r-sm: 4px; --r-md: 8px; --r-full: 999px;
  --e-btn: 0 1px 1px rgba(25,24,23,.05);
  --e-well: inset 0 1px 2px rgba(25,24,23,.06);
  --t-12: 12px; --t-14: 14px; --t-16: 16px; --t-20: 20px;
  --t-25: 25px; --t-31: 31px;
  --ls-12: 0.09em; --ls-14: 0.005em; --ls-20: -0.011em;
  --ls-25: -0.016em; --ls-31: -0.022em;
  --control-h: 44px;
  --ease: cubic-bezier(.2,0,0,1);
  --d-fast: 90ms;

  --font-sans: 'Schibsted Grotesk', system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: 'Chivo Mono', ui-monospace, "SF Mono", Menlo, Consolas, monospace;

  /* Aliases, not leftovers. Tools already in the CMS reference these names
     in their own CSS: --paper-2 in four of them, --ink, --line, --muted and
     --accent in others. Remove one and that tool renders an invalid colour. */
  --paper: #f4f6fa;
  --paper-2: #e7ebf2;
  --blue: var(--accent);
  --glow-a: var(--accent);
  --radius: 8px;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: transparent; height: auto; }
/* flow-root stops child margins collapsing out of the wrapper, which
   would make the measured height shorter than what is on screen */
#__wtroot { display: flow-root; }
body {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.55;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
img, canvas, svg, video { max-width: 100%; height: auto; }
h1, h2, h3 {
  font-family: var(--font-sans);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: var(--ls-20);
  margin: 0 0 0.5em;
}
p { margin: 0 0 var(--s3); }
a { color: var(--accent); }

.row { display: grid; gap: var(--s4); margin-bottom: var(--s4); }
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s4); margin-bottom: var(--s4); }
@media (max-width: 560px) { .row-2 { grid-template-columns: 1fr; } }

label {
  display: grid;
  gap: var(--s2);
  font-size: var(--t-14);
  font-weight: 500;
  letter-spacing: var(--ls-14);
  color: var(--ink-2);
}

/* Recessed means fillable, raised means pressable. That contract is the
   whole depth system, held to two shadow tokens.
   16px is mandatory: anything smaller and iOS zooms the page on focus. */
input[type="text"], input[type="number"], input[type="date"], input[type="email"],
input[type="url"], input[type="password"], input[type="time"], input[type="search"],
textarea, select, .field {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-sm);
  box-shadow: var(--e-well);
  padding: 0 14px;
  height: var(--control-h);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.4;
  background: var(--surface-2);
  color: var(--ink);
  transition: background var(--d-fast) linear, border-color var(--d-fast) linear;
}
select { cursor: pointer; }
/* iOS renders date and time fields at their own intrinsic width, which
   breaks out of the layout unless the native appearance is turned off */
input[type="date"], input[type="time"], input[type="datetime-local"],
input[type="month"], input[type="week"] {
  -webkit-appearance: none;
  appearance: none;
  max-width: 100%;
  min-height: var(--control-h);
}
textarea {
  height: auto;
  min-height: 200px;
  padding: 12px 14px;
  line-height: 1.6;
  resize: vertical;
}
input:focus, textarea:focus, select:focus {
  background: var(--surface);
  border-color: var(--accent);
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}
input[type="range"] { accent-color: var(--accent); padding: 0; height: auto; box-shadow: none; border: 0; background: none; }
input[type="checkbox"], input[type="radio"] {
  width: 18px; height: 18px; min-width: 0; accent-color: var(--accent);
  height: 18px; padding: 0; box-shadow: none; border: 0; background: none;
}

/* The action row carries its own separator, so it works wherever it sits. */
.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s3);
  margin-top: var(--s5);
  padding-top: var(--s4);
  border-top: 1px solid var(--line);
}
button, .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--s2);
  font-family: var(--font-sans);
  font-size: var(--t-14);
  font-weight: 500;
  line-height: 1;
  letter-spacing: var(--ls-14);
  border: 1px solid var(--line-strong);
  background: var(--surface);
  color: var(--ink);
  border-radius: var(--r-sm);
  height: var(--control-h);
  padding: 0 18px;
  cursor: pointer;
  box-shadow: var(--e-btn);
  transition: background var(--d-fast) linear, border-color var(--d-fast) linear;
}
button:hover, .btn:hover { background: var(--surface-2); border-color: #bcc5d3; }
button:active, .btn:active { background: var(--surface-3); box-shadow: none; }
button:disabled, .btn:disabled { opacity: .5; cursor: not-allowed; }
button.primary, .btn-primary {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--on-ink);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
}
button.primary:hover, .btn-primary:hover { background: #262b38; border-color: #262b38; }
button.primary:active, .btn-primary:active { background: #0a0c12; box-shadow: none; }

/* A data strip, not a row of tiles. No number is ever allowed to change the
   width of the cell it sits in, so every figure is tabular with a slashed zero. */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(120px, 100%), 1fr));
  gap: 0;
  margin-top: var(--s5);
  border-top: 1px solid var(--line);
}
.stat {
  background: none;
  border-radius: 0;
  border-left: 1px solid var(--line);
  padding: var(--s4) var(--s4) var(--s1) 0;
  text-align: left;
  min-width: 0;
}
.stat:first-child { border-left: 0; }
.stat:not(:first-child) { padding-left: var(--s4); }
.stat .num, .stat strong {
  display: block;
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: var(--t-31);
  line-height: 1.1;
  letter-spacing: var(--ls-31);
  font-variant-numeric: tabular-nums slashed-zero;
  font-feature-settings: "tnum", "zero";
  min-width: 6ch;
  overflow-wrap: anywhere;
}
.stat .label, .stat small {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--t-12);
  line-height: 1.2;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: var(--ls-12);
  margin-top: var(--s1);
}

/* Every computed result is inverted. A dashed grey border is wireframe
   language and reads as an unfinished upload box, which is the exact wrong
   association on a tool whose whole claim is that nothing is uploaded. */
.out {
  font-family: var(--font-mono);
  font-size: var(--t-16);
  line-height: 1.6;
  background: var(--ink);
  color: var(--on-ink);
  border: 0;
  border-left: 2px solid #7da8ff;
  border-radius: var(--r-md);
  padding: var(--s4) var(--s4) var(--s4) var(--s5);
  font-variant-numeric: tabular-nums slashed-zero;
  font-feature-settings: "tnum", "zero";
  word-break: break-all;
  white-space: pre-wrap;
  margin-top: var(--s4);
}
.note { margin-top: var(--s3); font-size: var(--t-14); color: var(--muted); }
.error {
  margin-top: var(--s3);
  font-size: var(--t-14);
  color: var(--danger);
  background: var(--danger-bg);
  border: 1px solid var(--danger-line);
  border-radius: var(--r-sm);
  padding: var(--s3) var(--s4);
  overflow-wrap: anywhere;
}
.tabs {
  display: flex;
  gap: var(--s5);
  background: none;
  border-radius: 0;
  padding: 0;
  border-bottom: 1px solid var(--line);
  margin-bottom: var(--s5);
  max-width: 100%;
  overflow-x: auto;
}
.tabs button {
  border: 0;
  background: none;
  box-shadow: none;
  border-radius: 0;
  height: auto;
  padding: 10px 0;
  margin-bottom: -1px;
  white-space: nowrap;
  color: var(--muted);
  border-bottom: 2px solid transparent;
  transition: color var(--d-fast) linear, border-color var(--d-fast) linear;
}
.tabs button:hover { background: none; border-color: transparent; border-bottom-color: var(--line-strong); color: var(--ink-2); }
.tabs button.active { background: none; color: var(--ink); border-bottom-color: var(--ink); box-shadow: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
`;

// Runtime injected into the frame: reports height to the parent so the
// iframe can grow with its content, and provides WT.copy() because the
// async clipboard API is unavailable inside a sandboxed frame.
//
// The message carries the frame id rather than relying on the parent
// comparing window objects: a sandboxed frame is cross-origin, and the
// event.source identity check is not dependable there.
export const embedRuntimeJs = (frameId, config = {}) => `
(function () {
  var ID = ${JSON.stringify(frameId)};
  var CONFIG = ${JSON.stringify(config)};
  var root = document.getElementById("__wtroot");
  // Measure the content wrapper, never documentElement. The document is
  // always at least as tall as the frame itself, so measuring it would
  // report back whatever height the parent just applied, and the frame
  // would ratchet taller on every keystroke and never shrink again.
  function send() {
    if (!root) return;
    var h = Math.max(root.scrollHeight, Math.ceil(root.getBoundingClientRect().height));
    // A tool may append its own output straight to body rather than into
    // the wrapper, so take the lowest edge of anything sitting in normal
    // flow. Fixed and absolute elements are skipped: their position is
    // measured against the frame, which would reintroduce the ratchet.
    var kids = document.body.children;
    for (var i = 0; i < kids.length; i++) {
      var el = kids[i];
      if (el === root || el.tagName === "SCRIPT") continue;
      var pos = getComputedStyle(el).position;
      if (pos === "fixed" || pos === "absolute") continue;
      var bottom = Math.ceil(el.getBoundingClientRect().bottom);
      if (bottom > h) h = bottom;
    }
    parent.postMessage({ __wtHeight: h, __wtId: ID }, "*");
  }
  window.WT = {
    // Values entered in the CMS under Tool code. Anything here is part of
    // the published page, so it must never hold a private key.
    config: CONFIG,
    copy: function (text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    },
    resize: send
  };
  if (window.ResizeObserver && root) new ResizeObserver(send).observe(root);

  // Deliberately NOT observing body for resize. Body is always at least as
  // tall as the frame, so watching it would make every height the parent
  // applies feed straight back in and the frame would ratchet taller on
  // every keystroke. Structure is watched instead, which cannot do that.
  if (window.MutationObserver) {
    var pending = null;
    new MutationObserver(function () {
      if (pending) return;
      pending = requestAnimationFrame(function () { pending = null; send(); });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  window.addEventListener("load", send);

  // The frame measures itself before the webfonts arrive, and the fallback
  // face has different metrics, so the first height can be short enough to
  // clip the last line. Re-measure once the real fonts are in.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { send(); setTimeout(send, 50); });
  }
  document.addEventListener("input", send);
  document.addEventListener("change", send);
  document.addEventListener("click", function () { setTimeout(send, 60); });
  // The frame usually finishes loading before React has hydrated the page,
  // so the parent asks for the height once its listener is ready.
  window.addEventListener("message", function (e) {
    if (e.data && e.data.__wtPing) send();
  });
  setTimeout(send, 0);
  setTimeout(send, 300);
})();
`;

// Builds the complete srcdoc document for one embedded tool.
export function buildEmbedDoc({ html = "", css = "", js = "", accent, frameId = "tool", config = {} }) {
  return `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..700&family=Chivo+Mono:wght@400..500&display=swap" rel="stylesheet">
<style>${EMBED_BASE_CSS}</style>
${accent ? `<style>:root{--cat-color:${accent};}</style>` : ""}
<style>${css}</style>
</head><body>
<div id="__wtroot">
${html}
</div>
<script>${embedRuntimeJs(frameId, config)}<\/script>
<script>try{${js}}catch(e){
  var d=document.createElement("div");
  d.className="error";
  d.textContent="This tool hit a script error: "+e.message;
  (document.getElementById("__wtroot")||document.body).appendChild(d);
  if(window.WT)WT.resize();
}<\/script>
</body></html>`;
}
