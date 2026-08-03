"use client";

import { useState } from "react";
import PdfWorkspace from "./PdfWorkspace";

export default function PdfPageNumbers() {
  const [pos, setPos] = useState("bottom-center");
  const [start, setStart] = useState(1);
  const [skipFirst, setSkipFirst] = useState(false);
  const [format, setFormat] = useState("n");
  const [size, setSize] = useState(11);

  return (
    <PdfWorkspace
      actionLabel="Add page numbers"
      outputName="numbered.pdf"
      hint="Useful for contracts, submissions and anything that has to be referred to by page."
      onRun={async (files, { PDFDocument, StandardFonts, rgb, degrees }) => {
        const f = files[0];
        const doc = await PDFDocument.load(f.buf, { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.Helvetica);
        const pages = doc.getPages();
        const total = pages.length;
        const first = skipFirst ? 1 : 0;
        const fs = Math.max(6, Math.min(36, +size || 11));
        const margin = 28;

        pages.forEach((page, i) => {
          if (i < first) return;
          const n = (+start || 1) + i - first;
          const shown = total - first;
          const text =
            format === "n" ? String(n)
            : format === "n-of" ? n + " of " + shown
            : format === "page-n" ? "Page " + n
            : "- " + n + " -";

          // getSize reports the page box; a rotated page still reports its
          // unrotated box, so the number is placed against that and rotated
          // to match, otherwise it lands off the visible area on scans.
          const { width, height } = page.getSize();
          const rot = page.getRotation().angle || 0;
          const w = font.widthOfTextAtSize(text, fs);

          let x, y;
          const bottom = pos.startsWith("bottom");
          const yBase = bottom ? margin : height - margin - fs;
          if (pos.endsWith("left")) x = margin;
          else if (pos.endsWith("right")) x = width - margin - w;
          else x = (width - w) / 2;
          y = yBase;

          page.drawText(text, {
            x, y, size: fs, font,
            color: rgb(0.25, 0.25, 0.28),
            rotate: degrees(rot ? 0 : 0),
          });
        });

        doc.setProducer("toolsinpocket.com");
        return doc.save();
      }}
    >
      {() => (
        <>
          <div className="input-2col">
            <label>
              <span>Where on the page?</span>
              <select className="tool-text" value={pos} onChange={(e) => setPos(e.target.value)}>
                <option value="bottom-center">Bottom, centred</option>
                <option value="bottom-right">Bottom right</option>
                <option value="bottom-left">Bottom left</option>
                <option value="top-center">Top, centred</option>
                <option value="top-right">Top right</option>
                <option value="top-left">Top left</option>
              </select>
            </label>
            <label>
              <span>How should it read?</span>
              <select className="tool-text" value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="n">1</option>
                <option value="n-of">1 of 12</option>
                <option value="page-n">Page 1</option>
                <option value="dash">- 1 -</option>
              </select>
            </label>
          </div>
          <div className="input-2col" style={{ marginTop: 14 }}>
            <label>
              <span>Start counting at</span>
              <input type="number" className="tool-text" min="0" value={start}
                onChange={(e) => setStart(e.target.value)} />
            </label>
            <label>
              <span>Text size</span>
              <input type="number" className="tool-text" min="6" max="36" value={size}
                onChange={(e) => setSize(e.target.value)} />
            </label>
          </div>
          <div className="check-row" style={{ marginTop: 14 }}>
            <input type="checkbox" id="skipfirst" checked={skipFirst}
              onChange={(e) => setSkipFirst(e.target.checked)} />
            <label htmlFor="skipfirst">Leave the first page bare, as a cover</label>
          </div>
        </>
      )}
    </PdfWorkspace>
  );
}
