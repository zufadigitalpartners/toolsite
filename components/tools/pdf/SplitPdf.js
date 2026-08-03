"use client";

import { useState } from "react";
import PdfWorkspace from "./PdfWorkspace";

/* Parses "1-3, 7, 10-12" into zero-based page indices.
   Written to be forgiving: spaces anywhere, either dash character, and a
   reversed range like 9-5 is read the way it was obviously meant. */
export function parseRanges(input, total) {
  const out = [];
  const seen = new Set();
  const bad = [];
  String(input)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((part) => {
      const m = part.match(/^(\d+)\s*[-–]\s*(\d+)$/);
      if (m) {
        let a = +m[1], b = +m[2];
        if (a > b) [a, b] = [b, a];
        for (let n = a; n <= b; n++) {
          if (n < 1 || n > total) { bad.push(String(n)); continue; }
          if (!seen.has(n)) { seen.add(n); out.push(n - 1); }
        }
        return;
      }
      if (/^\d+$/.test(part)) {
        const n = +part;
        if (n < 1 || n > total) { bad.push(part); return; }
        if (!seen.has(n)) { seen.add(n); out.push(n - 1); }
        return;
      }
      bad.push(part);
    });
  return { pages: out, bad };
}

export default function SplitPdf() {
  const [mode, setMode] = useState("range");
  const [range, setRange] = useState("1-3");
  const [every, setEvery] = useState(1);

  return (
    <PdfWorkspace
      actionLabel="Split"
      outputName="split.pdf"
      hint="Take a few pages out of a PDF, or break it into equal pieces."
      canRun={() => true}
      onRun={async (files, { PDFDocument }) => {
        const f = files[0];
        const src = await PDFDocument.load(f.buf, { ignoreEncryption: true });
        const total = src.getPageCount();

        if (mode === "range") {
          const { pages, bad } = parseRanges(range, total);
          if (!pages.length) {
            throw new Error(
              bad.length
                ? "none of those pages exist. This PDF has " + total + " page" + (total === 1 ? "" : "s")
                : "enter which pages you want, for example 1-3, 7"
            );
          }
          const out = await PDFDocument.create();
          const copied = await out.copyPages(src, pages);
          copied.forEach((p) => out.addPage(p));
          out.setProducer("toolsinpocket.com");
          return out.save();
        }

        // Equal chunks. Several files means a zip, which is a different job,
        // so this keeps it honest and produces the first chunk only when the
        // user asked for chunks. Instead we build one PDF per chunk and
        // download them one after another.
        const size = Math.max(1, Math.min(total, +every || 1));
        const chunks = [];
        for (let i = 0; i < total; i += size) {
          const out = await PDFDocument.create();
          const idx = [];
          for (let j = i; j < Math.min(i + size, total); j++) idx.push(j);
          const copied = await out.copyPages(src, idx);
          copied.forEach((p) => out.addPage(p));
          out.setProducer("toolsinpocket.com");
          chunks.push({ bytes: await out.save(), from: i + 1, to: Math.min(i + size, total) });
        }
        // Hand them over one at a time. Browsers throttle rapid downloads, so
        // they are spaced out rather than fired in a burst.
        chunks.forEach((c, i) => {
          setTimeout(() => {
            const blob = new Blob([c.bytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "pages-" + c.from + "-to-" + c.to + ".pdf";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 6000);
          }, i * 700);
        });
        return null; // downloads handled above
      }}
    >
      {(files) => {
        const total = files[0]?.pages || 0;
        return (
          <>
            <div className="mode-tabs">
              <button type="button" className={mode === "range" ? "active" : ""} onClick={() => setMode("range")}>
                Pick pages
              </button>
              <button type="button" className={mode === "every" ? "active" : ""} onClick={() => setMode("every")}>
                Break into pieces
              </button>
            </div>
            {mode === "range" ? (
              <div className="input-row">
                <label>
                  <span>Which pages do you want?</span>
                  <input
                    type="text"
                    className="tool-text"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    placeholder="1-3, 7, 10-12"
                  />
                </label>
                <p className="note">
                  This PDF has {total} page{total === 1 ? "" : "s"}. Write single pages, ranges, or both.
                </p>
              </div>
            ) : (
              <div className="input-row">
                <label>
                  <span>Pages in each piece</span>
                  <input
                    type="number"
                    className="tool-text"
                    min="1"
                    max={Math.max(1, total)}
                    value={every}
                    onChange={(e) => setEvery(e.target.value)}
                  />
                </label>
                <p className="note">
                  {total > 0 &&
                    "You will get " +
                      Math.ceil(total / Math.max(1, Math.min(total, +every || 1))) +
                      " separate files, downloaded one after another."}
                </p>
              </div>
            )}
          </>
        );
      }}
    </PdfWorkspace>
  );
}
