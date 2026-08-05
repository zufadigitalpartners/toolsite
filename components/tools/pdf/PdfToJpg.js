"use client";

import { useEffect, useRef, useState } from "react";
import { makeZip } from "@/lib/zip";
import { fmtBytes } from "@/components/tools/pdf/PdfWorkspace";

/* PDF pages to images, rendered by pdf.js entirely in the browser.

   pdf.js is the one dependency here that is genuinely large, so it follows
   the same rule as pdf-lib: dynamic import, cached on the module, its own
   chunk. The worker file is resolved through new URL() so webpack copies it
   into the static build; without a worker pdf.js renders on the main thread
   and a 40-page file freezes the tab. */

let pdfjsPromise = null;
function loadPdfjs() {
  if (!pdfjsPromise) {
    // The 3.x legacy build on purpose: it is plain UMD that every bundler
    // digests, where the 4+/6+ .mjs builds lean on import.meta in ways
    // Next's webpack refuses to parse. Rendering pages is a solved problem;
    // stability beats version number here.
    pdfjsPromise = import("pdfjs-dist/legacy/build/pdf").then((mod) => {
      const pdfjs = mod.default || mod;
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/legacy/build/pdf.worker.min.js",
        import.meta.url
      ).toString();
      return pdfjs;
    });
  }
  return pdfjsPromise;
}

// Longest-side targets. DPI means nothing on screen; pixels are honest.
const SIZES = [
  { label: "Standard · 1500 px", px: 1500 },
  { label: "High · 2400 px", px: 2400 },
  { label: "Maximum · 4000 px", px: 4000 },
];

export default function PdfToJpg() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // {n, url, blob, w, h}
  const [format, setFormat] = useState("jpeg");
  const [sizeIx, setSizeIx] = useState(1);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);
  const runId = useRef(0);

  useEffect(() => { loadPdfjs().catch(() => {}); }, []);

  // Blob URLs leak unless revoked, but revoking must happen only on unmount
  // or explicit reset. A cleanup keyed on [pages] fires on every appended
  // page and kills the URLs of pages already on screen, because the old and
  // new arrays share the same objects. Learned the hard way.
  const pagesRef = useRef(pages);
  pagesRef.current = pages;
  useEffect(() => () => { pagesRef.current.forEach((p) => URL.revokeObjectURL(p.url)); }, []);

  const reset = () => {
    setPages((prev) => { prev.forEach((p) => URL.revokeObjectURL(p.url)); return []; });
    setErr("");
    setProgress("");
  };

  async function convert(f, fmt, targetPx) {
    const id = ++runId.current;
    reset();
    setBusy(true);
    try {
      const pdfjs = await loadPdfjs();
      const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
      const out = [];
      for (let n = 1; n <= doc.numPages; n++) {
        if (runId.current !== id) return; // a newer run took over
        setProgress(`Rendering page ${n} of ${doc.numPages}…`);
        const page = await doc.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const scale = targetPx / Math.max(base.width, base.height);
        const vp = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(vp.width);
        canvas.height = Math.round(vp.height);
        const ctx = canvas.getContext("2d", { alpha: false });
        // JPEG has no transparency, so an unpainted region would come out
        // black. White first matches what the page looks like in a viewer.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // intent "print" for two reasons: it renders at full quality with
        // display-only shortcuts off, and it schedules work with microtasks
        // instead of requestAnimationFrame, so a conversion keeps running
        // when the user switches to another tab instead of stalling.
        await page.render({ canvasContext: ctx, viewport: vp, intent: "print" }).promise;
        const blob = await new Promise((res) =>
          canvas.toBlob(res, `image/${fmt}`, fmt === "jpeg" ? 0.92 : undefined)
        );
        canvas.width = 0; // release the bitmap right away, not at GC's leisure
        page.cleanup();
        if (!blob) throw new Error("the browser could not encode page " + n);
        out.push({ n, blob, url: URL.createObjectURL(blob), w: Math.round(vp.width), h: Math.round(vp.height) });
        if (runId.current === id) setPages(out.slice());
      }
      doc.destroy();
      setProgress(`Done. ${out.length} page${out.length === 1 ? "" : "s"} converted. Nothing was uploaded.`);
    } catch (e) {
      if (runId.current === id) {
        setErr("That did not work: " + (e?.message || "unknown problem") + ".");
        setProgress("");
      }
    }
    if (runId.current === id) setBusy(false);
  }

  const take = (list) => {
    const f = Array.from(list || []).find(
      (x) => x.type === "application/pdf" || /\.pdf$/i.test(x.name || "")
    );
    if (!f) { setErr("That is not a PDF."); return; }
    setFile(f);
    convert(f, format, SIZES[sizeIx].px);
  };

  const ext = format === "jpeg" ? "jpg" : "png";
  const stem = (file?.name || "pages").replace(/\.pdf$/i, "");

  const saveOne = (p) => {
    const a = document.createElement("a");
    a.href = p.url;
    a.download = `${stem}-page-${p.n}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const saveZip = async () => {
    const entries = [];
    for (const p of pages) {
      entries.push({ name: `${stem}-page-${p.n}.${ext}`, data: new Uint8Array(await p.blob.arrayBuffer()) });
    }
    const zip = makeZip(entries);
    const url = URL.createObjectURL(new Blob([zip], { type: "application/zip" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stem}-${ext}.zip`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
  };

  const totalBytes = pages.reduce((a, p) => a + p.blob.size, 0);

  return (
    <div className="pdfw">
      <div
        className={"pdfw-drop" + (over ? " over" : "")}
        onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
      >
        <p><b>Drop your PDF here</b></p>
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          or choose a file
        </button>
        <input
          ref={inputRef} type="file" accept="application/pdf,.pdf" hidden
          onChange={(e) => { take(e.target.files); e.target.value = ""; }}
        />
        <p className="note">Your file never leaves this device. Nothing is uploaded.</p>
      </div>

      <div className="pdfw-opts">
        <div className="field-row">
          <label>
            Format
            <select value={format} disabled={busy}
              onChange={(e) => { setFormat(e.target.value); if (file) convert(file, e.target.value, SIZES[sizeIx].px); }}>
              <option value="jpeg">JPG, smaller files</option>
              <option value="png">PNG, exact and lossless</option>
            </select>
          </label>
          <label>
            Image size
            <select value={sizeIx} disabled={busy}
              onChange={(e) => { const ix = Number(e.target.value); setSizeIx(ix); if (file) convert(file, format, SIZES[ix].px); }}>
              {SIZES.map((s, i) => (<option key={s.px} value={i}>{s.label}</option>))}
            </select>
          </label>
        </div>
      </div>

      {pages.length > 0 && (
        <>
          <div className="p2j-grid">
            {pages.map((p) => (
              <figure className="p2j-page" key={p.n}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Page ${p.n}`} loading="lazy" width={p.w} height={p.h} />
                <figcaption>
                  <span>Page {p.n} · {fmtBytes(p.blob.size)}</span>
                  <button type="button" className="btn" onClick={() => saveOne(p)}>Save</button>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" disabled={busy} onClick={saveZip}>
              Download all as ZIP · {fmtBytes(totalBytes)}
            </button>
            <button type="button" className="btn" disabled={busy} onClick={() => { setFile(null); reset(); }}>
              Clear
            </button>
          </div>
        </>
      )}

      {err && <div className="error-note">{err}</div>}
      {progress && !err && <p className="note">{progress}</p>}
    </div>
  );
}
