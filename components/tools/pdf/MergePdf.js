"use client";

import PdfWorkspace from "./PdfWorkspace";

export default function MergePdf() {
  return (
    <PdfWorkspace
      multiple
      actionLabel="Merge into one PDF"
      outputName="merged.pdf"
      hint="Add two or more PDFs. The arrows change the order, and the order in the list is the order in the finished file."
      canRun={(files) => files.length >= 2}
      onRun={async (files, { PDFDocument }) => {
        const out = await PDFDocument.create();
        for (const f of files) {
          const src = await PDFDocument.load(f.buf, { ignoreEncryption: true });
          // copyPages carries the page content, its resources and its size,
          // so pages of different dimensions survive rather than being
          // squashed onto one common page size.
          const pages = await out.copyPages(src, src.getPageIndices());
          pages.forEach((p) => out.addPage(p));
        }
        out.setProducer("toolsinpocket.com");
        out.setCreator("toolsinpocket.com");
        return out.save();
      }}
    />
  );
}
