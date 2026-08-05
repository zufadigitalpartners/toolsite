"use client";

import { useState } from "react";
import PdfWorkspace from "./PdfWorkspace";

/* Rearrange the pages of one PDF. The workspace handles files in and the
   download out; this component owns the ordering UI.

   No drag-and-drop on purpose. Buttons work identically with a mouse, a
   finger and a keyboard, and reordering forty pages by dragging across a
   scrolling list is worse than pressing an arrow a few times.

   State is kept as {key, order} where key identifies the loaded file. When
   a different file arrives the stored order simply stops matching and the
   identity order is shown instead, which avoids setting state during
   another component's render (the children prop runs inside PdfWorkspace). */

const identity = (n) => Array.from({ length: n }, (_, i) => i);
const keyOf = (files) => (files[0] ? files[0].name + ":" + files[0].pages : "");

export default function ReorderPdf() {
  const [saved, setSaved] = useState({ key: "", order: [] });

  const orderFor = (files) => {
    const k = keyOf(files);
    return saved.key === k ? saved.order : identity(files[0]?.pages || 0);
  };

  const update = (files, fn) => {
    const k = keyOf(files);
    setSaved((prev) => {
      const base = prev.key === k ? prev.order : identity(files[0]?.pages || 0);
      return { key: k, order: fn(base) };
    });
  };

  const move = (files, from, to) =>
    update(files, (base) => {
      if (to < 0 || to >= base.length) return base;
      const next = base.slice();
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });

  const isChanged = (files) => orderFor(files).some((p, i) => p !== i);

  return (
    <PdfWorkspace
      actionLabel="Save reordered PDF"
      outputName="reordered.pdf"
      hint="Add a PDF, put the pages in the order you want, and save."
      canRun={(files) => isChanged(files)}
      onRun={async (files, { PDFDocument }) => {
        const src = await PDFDocument.load(files[0].buf, { ignoreEncryption: true });
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, orderFor(files));
        copied.forEach((p) => out.addPage(p));
        return out.save();
      }}
    >
      {(files) => {
        const ord = orderFor(files);
        if (!ord.length) return null;
        const changed = isChanged(files);
        return (
          <div>
            <p className="note">
              {changed
                ? "New order below. The button saves a copy; your original file is untouched."
                : "Pages are in their original order. Move any page and the save button lights up."}
            </p>
            <div className="pdfw-files">
              {ord.map((orig, pos) => (
                <div className="pdfw-file" key={orig}>
                  <span className="pdfw-name">Position {pos + 1}</span>
                  <span className="pdfw-meta">
                    original page {orig + 1}
                    {orig !== pos ? " · moved" : ""}
                  </span>
                  <span className="pdfw-btns">
                    <button type="button" aria-label={`Move position ${pos + 1} up`} disabled={pos === 0}
                      onClick={() => move(files, pos, pos - 1)}>↑</button>
                    <button type="button" aria-label={`Move position ${pos + 1} down`} disabled={pos === ord.length - 1}
                      onClick={() => move(files, pos, pos + 1)}>↓</button>
                    <button type="button" aria-label={`Send position ${pos + 1} to the top`} disabled={pos === 0}
                      onClick={() => move(files, pos, 0)}>⤒</button>
                  </span>
                </div>
              ))}
            </div>
            <div className="btn-row">
              <button type="button" className="btn" disabled={!changed}
                onClick={() => update(files, () => identity(files[0]?.pages || 0))}>
                Reset order
              </button>
              <button type="button" className="btn"
                onClick={() => update(files, (base) => base.slice().reverse())}>
                Reverse all pages
              </button>
            </div>
          </div>
        );
      }}
    </PdfWorkspace>
  );
}
