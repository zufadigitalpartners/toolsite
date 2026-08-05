// One PDF engine for every business document: invoice, quote, receipt,
// purchase order, credit note, packing slip. The tools differ in labels,
// columns and totals; the layout, wrapping, logo handling and encoding
// live here once.
//
// The pdf-lib module is passed in rather than imported, so this file has
// no client/server opinion and runs unchanged under node for testing.

const A4 = [595.28, 841.89];
const M = 50;

// Built-in Helvetica speaks WinAnsi; swap what it cannot carry rather
// than crash on one Urdu or CJK character.
export function winAnsiSafe(s) {
  return String(s ?? "").replace(/[^\x20-\x7E\xA0-\xFF€‘’“”–—…]/g, "?");
}

export async function buildBusinessDoc(pdfLib, spec) {
  const { PDFDocument, StandardFonts, rgb } = pdfLib;
  const doc = await PDFDocument.create();
  let page = doc.addPage(A4);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(0.07, 0.08, 0.11);
  const mut = rgb(0.42, 0.45, 0.52);
  const line = rgb(0.88, 0.9, 0.93);
  const W = A4[0] - M * 2;
  let y = A4[1] - M;
  let replaced = false;

  const enc = (s) => {
    const safe = winAnsiSafe(s);
    if (safe !== String(s ?? "")) replaced = true;
    return safe;
  };
  const text = (s, x, size, f = font, color = ink) =>
    page.drawText(enc(s), { x, y, size, font: f, color });
  const right = (s, size, f = font, color = ink, rx = M + W) => {
    const safe = enc(s);
    page.drawText(safe, { x: rx - f.widthOfTextAtSize(safe, size), y, size, font: f, color });
  };
  const rule = () =>
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.7, color: line });
  const wrap = (s, size, width, f = font) => {
    const words = enc(s).split(/\s+/).filter(Boolean);
    const out = [];
    let cur = "";
    for (const w of words) {
      const cand = cur ? cur + " " + w : w;
      if (f.widthOfTextAtSize(cand, size) > width && cur) { out.push(cur); cur = w; }
      else cur = cand;
    }
    if (cur) out.push(cur);
    return out.length ? out : [""];
  };

  // ---- header: logo left or title left, meta right
  let titleX = M;
  if (spec.logo?.bytes?.length) {
    try {
      const img = spec.logo.mime === "image/png"
        ? await doc.embedPng(spec.logo.bytes)
        : await doc.embedJpg(spec.logo.bytes);
      const h = 40;
      const w = (img.width / img.height) * h;
      page.drawImage(img, { x: M, y: y - h + 8, width: Math.min(w, 160), height: h });
      titleX = M + Math.min(w, 160) + 14;
    } catch { /* a broken image never blocks the document */ }
  }
  text(spec.docTitle, titleX, 24, bold);
  if (spec.number) right(spec.number, 13, bold);
  y -= 17;
  for (const m of spec.meta || []) {
    right(`${m.label}: ${m.value}`, 10, font, mut);
    y -= 14;
  }
  y -= 22;

  // ---- from / to blocks
  const blockTop = y;
  const half = W / 2;
  const block = (b, x) => {
    let yy = blockTop;
    page.drawText(enc(b.label), { x, y: yy, size: 9, font: bold, color: mut });
    yy -= 15;
    page.drawText(enc(b.name || ""), { x, y: yy, size: 12, font: bold, color: ink });
    for (const ln of (b.lines || []).slice(0, 6)) {
      yy -= 14;
      page.drawText(enc(ln), { x, y: yy, size: 10, font, color: mut });
    }
    return yy;
  };
  const leftEnd = spec.from ? block(spec.from, M) : blockTop;
  const rightEnd = spec.to ? block(spec.to, M + half) : blockTop;
  y = Math.min(leftEnd, rightEnd) - 28;

  // ---- table
  const cols = spec.columns; // [{key,label,width,align:'right'?}] widths sum <= W
  const xs = [];
  let acc = M;
  for (const c of cols) { xs.push(acc); acc += c.width; }
  cols.forEach((c, i) => {
    const label = enc(c.label);
    const size = 9;
    const x = c.align === "right"
      ? xs[i] + c.width - bold.widthOfTextAtSize(label, size)
      : xs[i];
    page.drawText(label, { x, y, size, font: bold, color: mut });
  });
  y -= 8;
  rule();
  y -= 16;

  for (const item of spec.items) {
    const descLines = wrap(item[cols[0].key] || "-", 10.5, cols[0].width - 12);
    for (let li = 0; li < descLines.length; li++) {
      page.drawText(descLines[li], { x: xs[0], y, size: 10.5, font, color: ink });
      if (li === 0) {
        cols.slice(1).forEach((c, i) => {
          const v = enc(item[c.key] ?? "");
          const x = c.align === "right"
            ? xs[i + 1] + c.width - font.widthOfTextAtSize(v, 10.5)
            : xs[i + 1];
          page.drawText(v, { x, y, size: 10.5, font, color: ink });
        });
      }
      y -= 16;
    }
    y -= 4;
    if (y < 180) break; // one page, by design
  }

  y -= 6;
  rule();
  y -= 20;

  for (const t of spec.totals || []) {
    right(`${t.label}   ${t.value}`, t.bold ? 14 : 10.5, t.bold ? bold : font, t.bold ? ink : mut);
    y -= t.bold ? 22 : 16;
  }

  if (spec.notes) {
    y -= 18;
    text(spec.notesLabel || "Notes", M, 9, bold, mut);
    y -= 14;
    for (const ln of wrap(spec.notes, 10, W).slice(0, 5)) {
      text(ln, M, 10, font, mut);
      y -= 13;
    }
  }

  if (spec.footer) {
    y = Math.max(y - 10, 40);
    text(spec.footer, M, 9, font, mut);
  }

  const bytes = await doc.save();
  return { bytes, replaced };
}
