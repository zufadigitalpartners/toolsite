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
  --paper: #f7f8fc;
  --paper-2: #eef1f8;
  --ink: #0c1224;
  --muted: #5a6478;
  --line: #e5e9f2;
  --blue: #2952e3;
  --glow-a: #4f7cff;
  --accent: var(--cat-color, #2952e3);
  --radius: 12px;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: transparent; }
body {
  font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}
img, canvas, svg, video { max-width: 100%; height: auto; }
h1, h2, h3 { font-family: "Bricolage Grotesque", Inter, system-ui, sans-serif; line-height: 1.2; margin: 0 0 0.5em; }
p { margin: 0 0 12px; }
a { color: var(--accent); }

.row { display: grid; gap: 14px; margin-bottom: 14px; }
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
@media (max-width: 560px) { .row-2 { grid-template-columns: 1fr; } }

label { display: grid; gap: 6px; font-weight: 600; font-size: 0.92rem; }

input[type="text"], input[type="number"], input[type="date"], input[type="email"],
input[type="url"], input[type="password"], input[type="time"], input[type="search"],
textarea, select, .field {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 13px 14px;
  font: inherit;
  font-size: 1rem;
  line-height: 1.4;
  background: var(--paper);
  color: var(--ink);
}
select { height: 50px; cursor: pointer; }
textarea { min-height: 180px; resize: vertical; }
input:focus, textarea:focus, select:focus {
  outline: 3px solid color-mix(in srgb, var(--accent) 35%, transparent);
  outline-offset: 1px;
  border-color: var(--accent);
}
input[type="range"] { accent-color: var(--accent); padding: 0; }
input[type="checkbox"], input[type="radio"] { width: 18px; height: 18px; accent-color: var(--accent); }

.btn-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
button, .btn {
  font: inherit;
  font-weight: 600;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
  border-radius: 11px;
  padding: 10px 17px;
  cursor: pointer;
  transition: background .15s ease, border-color .15s ease, transform .15s ease;
  box-shadow: 0 1px 2px rgba(12,18,36,.06);
}
button:hover, .btn:hover { border-color: var(--accent); background: #f4f7ff; transform: translateY(-1px); }
button:active, .btn:active { transform: translateY(1px); }
button.primary, .btn-primary {
  background: linear-gradient(135deg, var(--glow-a), var(--accent));
  border-color: transparent;
  color: #fff;
  box-shadow: 0 8px 20px -8px rgba(41,82,227,.65);
}
button.primary:hover, .btn-primary:hover { background: linear-gradient(135deg, var(--accent), #1e3fb8); }

.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px; margin-top: 16px; }
.stat { background: var(--paper-2); border-radius: var(--radius); padding: 12px 10px; text-align: center; }
.stat .num, .stat strong {
  display: block;
  font-family: "Bricolage Grotesque", Inter, sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
  overflow-wrap: anywhere;
}
.stat .label, .stat small {
  display: block;
  font-size: .74rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: .04em;
}

.out {
  font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  background: var(--paper);
  border: 1px dashed var(--muted);
  border-radius: var(--radius);
  padding: 14px 16px;
  word-break: break-all;
  white-space: pre-wrap;
  margin-top: 14px;
}
.note { margin-top: 12px; font-size: .9rem; color: var(--muted); }
.error {
  margin-top: 12px;
  font-size: .9rem;
  color: #b42318;
  background: #fef1f0;
  border: 1px solid #f2c1bd;
  border-radius: 10px;
  padding: 10px 13px;
}
.tabs { display: inline-flex; background: var(--paper-2); border-radius: 11px; padding: 4px; gap: 4px; margin-bottom: 14px; max-width: 100%; overflow-x: auto; }
.tabs button { border: 0; background: transparent; color: var(--muted); box-shadow: none; padding: 7px 16px; white-space: nowrap; }
.tabs button.active { background: #fff; color: var(--ink); box-shadow: 0 1px 2px rgba(12,18,36,.08); }
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
  function send() {
    var h = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight
    );
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
  if (window.ResizeObserver) new ResizeObserver(send).observe(document.documentElement);
  window.addEventListener("load", send);
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
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<style>${EMBED_BASE_CSS}</style>
${accent ? `<style>:root{--cat-color:${accent};}</style>` : ""}
<style>${css}</style>
</head><body>
${html}
<script>${embedRuntimeJs(frameId, config)}<\/script>
<script>try{${js}}catch(e){
  var d=document.createElement("div");
  d.className="error";
  d.textContent="This tool hit a script error: "+e.message;
  document.body.appendChild(d);
  if(window.WT)WT.resize();
}<\/script>
</body></html>`;
}
