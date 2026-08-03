"use client";

import { useState } from "react";
import PdfWorkspace from "./PdfWorkspace";
import { parseRanges } from "./SplitPdf";

export default function DeletePdfPages() {
  const [range, setRange] = useState("1");

  return (
    <PdfWorkspace
      actionLabel="Remove those pages"
      outputName="pages-removed.pdf"
      hint="Take out the blank scans, the cover sheet, or anything you do not want to send."
      onRun={async (files, { PDFDocument }) => {
        const f = files[0];
        const src = await PDFDocument.load(f.buf, { ignoreEncryption: true });
        const total = src.getPageCount();
        const { pages: drop } = parseRanges(range, total);
        if (!drop.length) throw new Error("say which pages to remove, for example 1, 4-6");
        if (drop.length >= total) throw new Error("that would remove every page, so there would be nothing left to save");

        const keep = [];
        for (let i = 0; i < total; i++) if (drop.indexOf(i) === -1) keep.push(i);

        // Built by copying the pages we keep rather than deleting in place,
        // which leaves the discarded pages' data behind in the file.
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, keep);
        copied.forEach((p) => out.addPage(p));
        out.setProducer("toolsinpocket.com");
        return out.save();
      }}
    >
      {(files) => {
        const total = files[0]?.pages || 0;
        const { pages, bad } = parseRanges(range, total);
        return (
          <div className="input-row">
            <label>
              <span>Which pages should go?</span>
              <input type="text" className="tool-text" value={range}
                onChange={(e) => setRange(e.target.value)} placeholder="1, 4-6, 12" />
            </label>
            <p className="note">
              This PDF has {total} page{total === 1 ? "" : "s"}.{" "}
              {pages.length > 0 && "Removing " + pages.length + ", keeping " + (total - pages.length) + "."}
              {bad.length > 0 && " Ignoring " + bad.join(", ") + ", which is outside this document."}
            </p>
            <p className="note">
              The pages you keep are copied into a new file, so the removed ones
              are genuinely gone rather than just hidden.
            </p>
          </div>
        );
      }}
    </PdfWorkspace>
  );
}
