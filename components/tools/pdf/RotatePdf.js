"use client";

import { useState } from "react";
import PdfWorkspace from "./PdfWorkspace";
import { parseRanges } from "./SplitPdf";

export default function RotatePdf() {
  const [turn, setTurn] = useState(90);
  const [which, setWhich] = useState("all");
  const [range, setRange] = useState("1");

  return (
    <PdfWorkspace
      actionLabel="Rotate and save"
      outputName="rotated.pdf"
      hint="Fixes pages that were scanned sideways or upside down."
      onRun={async (files, { PDFDocument, degrees }) => {
        const f = files[0];
        const doc = await PDFDocument.load(f.buf, { ignoreEncryption: true });
        const total = doc.getPageCount();

        let targets;
        if (which === "all") {
          targets = doc.getPageIndices();
        } else {
          const { pages } = parseRanges(range, total);
          if (!pages.length) throw new Error("none of those pages exist. This PDF has " + total + " page" + (total === 1 ? "" : "s"));
          targets = pages;
        }

        targets.forEach((i) => {
          const page = doc.getPage(i);
          // Add to whatever rotation the page already carries, otherwise a
          // scan that was already at 90 would be reset rather than turned.
          const current = page.getRotation().angle || 0;
          page.setRotation(degrees((current + Number(turn)) % 360));
        });

        doc.setProducer("toolsinpocket.com");
        return doc.save();
      }}
    >
      {(files) => {
        const total = files[0]?.pages || 0;
        return (
          <>
            <div className="input-2col">
              <label>
                <span>Turn by</span>
                <select className="tool-text" value={turn} onChange={(e) => setTurn(e.target.value)}>
                  <option value="90">90 degrees clockwise</option>
                  <option value="180">180 degrees, upside down</option>
                  <option value="270">90 degrees anticlockwise</option>
                </select>
              </label>
              <label>
                <span>Apply to</span>
                <select className="tool-text" value={which} onChange={(e) => setWhich(e.target.value)}>
                  <option value="all">Every page</option>
                  <option value="some">Only some pages</option>
                </select>
              </label>
            </div>
            {which === "some" && (
              <div className="input-row" style={{ marginTop: 14 }}>
                <label>
                  <span>Which pages?</span>
                  <input type="text" className="tool-text" value={range}
                    onChange={(e) => setRange(e.target.value)} placeholder="1-3, 7" />
                </label>
                <p className="note">This PDF has {total} page{total === 1 ? "" : "s"}.</p>
              </div>
            )}
            <p className="note" style={{ marginTop: 12 }}>
              Rotation is added to what the page already has, so a scan that is
              already sideways ends up straight rather than being reset.
            </p>
          </>
        );
      }}
    </PdfWorkspace>
  );
}
