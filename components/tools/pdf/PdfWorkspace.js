"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* Shared shell for every PDF tool.
   It owns the parts that are identical across all of them: taking files in,
   loading pdf-lib once, reporting progress, handling the failures a real PDF
   throws, and handing back a download. Each tool supplies only the button
   label and the function that actually transforms the document.

   pdf-lib is imported dynamically and cached on the module, so it is fetched
   the first time somebody opens a PDF tool and never again, and the other
   forty-eight tools on the site never pay for it. */

let pdfLibPromise = null;
export function loadPdfLib() {
  if (!pdfLibPromise) pdfLibPromise = import("pdf-lib");
  return pdfLibPromise;
}

const MAX_FILES = 40;
const MAX_BYTES = 120 * 1024 * 1024;

export function fmtBytes(n) {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(0) + " KB";
  return (n / (1024 * 1024)).toFixed(2) + " MB";
}

export function download(bytes, name) {
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 8000);
  return blob.size;
}

export default function PdfWorkspace({
  multiple = false,
  actionLabel = "Process",
  hint,
  children,
  onRun,
  canRun,
  outputName = "output.pdf",
}) {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  // Warm the library as soon as somebody lands on a PDF tool, so the wait
  // happens while they are choosing a file rather than after they press go.
  useEffect(() => { loadPdfLib().catch(() => {}); }, []);

  const add = useCallback(async (list) => {
    const incoming = Array.from(list || []);
    if (!incoming.length) return;
    setErr("");

    const good = [];
    const bad = [];
    for (const f of incoming) {
      const looksPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name || "");
      if (!looksPdf) { bad.push(f.name + " is not a PDF"); continue; }
      if (f.size === 0) { bad.push(f.name + " is empty"); continue; }
      if (f.size > MAX_BYTES) { bad.push(f.name + " is larger than " + fmtBytes(MAX_BYTES)); continue; }
      good.push(f);
    }

    const { PDFDocument } = await loadPdfLib();
    const loaded = [];
    for (const f of good) {
      try {
        const buf = await f.arrayBuffer();
        // ignoreEncryption lets a password-protected file open far enough to
        // report its page count instead of throwing an opaque error
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        loaded.push({ file: f, name: f.name, size: f.size, pages: doc.getPageCount(), buf });
      } catch (e) {
        bad.push(f.name + " could not be read. It may be damaged or password protected.");
      }
    }

    setFiles((prev) => {
      const next = multiple ? [...prev, ...loaded] : loaded.slice(0, 1);
      if (next.length > MAX_FILES) {
        bad.push("Only the first " + MAX_FILES + " files were kept.");
        return next.slice(0, MAX_FILES);
      }
      return next;
    });
    if (bad.length) setErr(bad.join(". "));
  }, [multiple]);

  const run = async () => {
    if (!files.length || busy) return;
    setBusy(true);
    setErr("");
    setNote("Working…");
    try {
      const bytes = await onRun(files, await loadPdfLib());
      if (!bytes) { setNote(""); setBusy(false); return; }
      const size = download(bytes, outputName);
      setNote("Done. " + fmtBytes(size) + " saved to your downloads. Nothing was uploaded.");
    } catch (e) {
      setErr("That did not work: " + (e && e.message ? e.message : "unknown problem") + ".");
      setNote("");
    }
    setBusy(false);
  };

  const totalPages = files.reduce((a, f) => a + f.pages, 0);

  return (
    <div className="pdfw">
      <div
        className={"pdfw-drop" + (over ? " over" : "")}
        onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
      >
        <p><b>{multiple ? "Drop your PDFs here" : "Drop your PDF here"}</b></p>
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          {multiple ? "or choose files" : "or choose a file"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple={multiple}
          hidden
          onChange={(e) => { add(e.target.files); e.target.value = ""; }}
        />
        <p className="note">Your file never leaves this device. Nothing is uploaded.</p>
      </div>

      {files.length > 0 && (
        <>
          <div className="pdfw-files">
            {files.map((f, i) => (
              <div className="pdfw-file" key={f.name + i}>
                <span className="pdfw-name">{f.name}</span>
                <span className="pdfw-meta">{f.pages} page{f.pages === 1 ? "" : "s"} · {fmtBytes(f.size)}</span>
                <span className="pdfw-btns">
                  {multiple && i > 0 && (
                    <button type="button" aria-label="Move up" onClick={() =>
                      setFiles((p) => { const n = p.slice(); n.splice(i - 1, 0, n.splice(i, 1)[0]); return n; })}>↑</button>
                  )}
                  {multiple && i < files.length - 1 && (
                    <button type="button" aria-label="Move down" onClick={() =>
                      setFiles((p) => { const n = p.slice(); n.splice(i + 1, 0, n.splice(i, 1)[0]); return n; })}>↓</button>
                  )}
                  <button type="button" aria-label="Remove" onClick={() =>
                    setFiles((p) => p.filter((_, j) => j !== i))}>×</button>
                </span>
              </div>
            ))}
          </div>

          <div className="stat-grid">
            <div className="stat"><span className="s-num">{files.length}</span><span className="s-label">{multiple ? "Files" : "File"}</span></div>
            <div className="stat"><span className="s-num">{totalPages}</span><span className="s-label">Pages</span></div>
            <div className="stat"><span className="s-num">{fmtBytes(files.reduce((a, f) => a + f.size, 0))}</span><span className="s-label">Total size</span></div>
          </div>

          {children && <div className="pdfw-opts">{children(files)}</div>}
        </>
      )}

      <div className="btn-row">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!files.length || busy || (canRun ? !canRun(files) : false)}
          onClick={run}
        >
          {busy ? "Working…" : actionLabel}
        </button>
        <button type="button" className="btn" disabled={!files.length || busy}
          onClick={() => { setFiles([]); setNote(""); setErr(""); }}>Clear</button>
      </div>

      {err && <div className="error-note">{err}</div>}
      {note && !err && <p className="note">{note}</p>}
      {!note && !err && hint && <p className="note">{hint}</p>}
    </div>
  );
}
