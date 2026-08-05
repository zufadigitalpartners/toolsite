"use client";

import { useEffect, useState } from "react";
import { loadPdfLib } from "@/components/tools/pdf/PdfWorkspace";

/* A form that becomes a clean A4 invoice PDF, drawn with pdf-lib on this
   device. No template gallery, no watermark, no account wall before the
   download button, which is the entire reason this exists.

   The "from" block persists in localStorage because the seller's own
   details are the part that never changes between invoices. The client
   rows do not persist: yesterday's client on today's screen is how the
   wrong name ends up on an invoice. */

const LS_KEY = "tip-invoice-from";

const emptyItem = () => ({ desc: "", qty: "1", rate: "" });

const CURRENCIES = ["$", "€", "£", "Rs", "AED", "CHF", "kr", "PLN", "R"];

// The built-in Helvetica speaks WinAnsi and throws on anything outside it.
// Rather than crash on one Urdu or CJK character, swap what it cannot
// carry and tell the user, which beats a PDF that never arrives.
function winAnsiSafe(s) {
  return String(s).replace(/[^\x20-\x7E\xA0-\xFF€‘’“”–—…]/g, "?");
}

function money(n, cur) {
  const v = (Math.round(n * 100) / 100).toFixed(2);
  return cur.length > 1 ? `${cur} ${v}` : `${cur}${v}`;
}

export default function InvoiceGenerator() {
  const [from, setFrom] = useState({ name: "", details: "" });
  const [to, setTo] = useState({ name: "", details: "" });
  const [num, setNum] = useState("INV-001");
  const [date, setDate] = useState("");
  const [due, setDue] = useState("");
  const [cur, setCur] = useState("$");
  const [items, setItems] = useState([emptyItem()]);
  const [taxPct, setTaxPct] = useState("0");
  const [taxLabel, setTaxLabel] = useState("Tax");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (saved?.name || saved?.details) setFrom(saved);
    } catch { /* a corrupt entry just means a blank form */ }
    setDate(new Date().toISOString().slice(0, 10));
    loadPdfLib().catch(() => {});
  }, []);

  const saveFrom = (next) => {
    setFrom(next);
    try { localStorage.setItem(LS_KEY, JSON.stringify(next)); } catch { /* private mode */ }
  };

  const setItem = (i, key, val) =>
    setItems((prev) => prev.map((it, j) => (j === i ? { ...it, [key]: val } : it)));

  const lines = items
    .map((it) => ({ ...it, total: (Number(it.qty) || 0) * (Number(it.rate) || 0) }))
    .filter((it) => it.desc.trim() || it.total > 0);
  const subtotal = lines.reduce((a, l) => a + l.total, 0);
  const tax = subtotal * ((Number(taxPct) || 0) / 100);
  const total = subtotal + tax;

  async function makePdf() {
    setErr("");
    if (!from.name.trim()) { setErr("Fill in your own name or business name first."); return; }
    if (!lines.length) { setErr("Add at least one line item with a description and a rate."); return; }
    setBusy(true);
    try {
      const { PDFDocument, StandardFonts, rgb } = await loadPdfLib();
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]); // A4 portrait, points
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const bold = await doc.embedFont(StandardFonts.HelveticaBold);
      const ink = rgb(0.07, 0.08, 0.11);
      const mut = rgb(0.42, 0.45, 0.52);
      const line = rgb(0.88, 0.9, 0.93);
      const M = 50; // margin
      const W = 595.28 - M * 2;
      let y = 841.89 - M;

      let replaced = false;
      const enc = (s) => {
        const safe = winAnsiSafe(s);
        if (safe !== String(s)) replaced = true;
        return safe;
      };
      const text = (s, x, size, f = font, color = ink) =>
        page.drawText(enc(s), { x, y, size, font: f, color });
      const right = (s, size, f = font, color = ink) => {
        const safe = enc(s);
        page.drawText(safe, { x: M + W - f.widthOfTextAtSize(safe, size), y, size, font: f, color });
      };
      const rule = () =>
        page.drawLine({ start: { x: M, y: y }, end: { x: M + W, y: y }, thickness: 0.7, color: line });
      // pdf-lib has no text wrapping; chop on spaces at a width budget.
      const wrap = (s, size, width, f = font) => {
        const words = String(s).split(/\s+/).filter(Boolean);
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

      text("INVOICE", M, 26, bold);
      right(num, 13, bold);
      y -= 18;
      right(`Date: ${date}`, 10, font, mut);
      if (due) { y -= 14; right(`Due: ${due}`, 10, font, mut); }
      y -= 34;

      const blockTop = y;
      text("From", M, 9, bold, mut);
      y -= 15;
      text(from.name, M, 12, bold);
      for (const ln of from.details.split("\n").filter(Boolean).slice(0, 6)) {
        y -= 14;
        text(ln, M, 10, font, mut);
      }
      const leftEnd = y;
      y = blockTop;
      const toX = M + W / 2;
      page.drawText("Bill to", { x: toX, y, size: 9, font: bold, color: mut });
      y -= 15;
      page.drawText(enc(to.name || ""), { x: toX, y, size: 12, font: bold, color: ink });
      for (const ln of to.details.split("\n").filter(Boolean).slice(0, 6)) {
        y -= 14;
        page.drawText(enc(ln), { x: toX, y, size: 10, font, color: mut });
      }
      y = Math.min(leftEnd, y) - 30;

      // table header
      const cols = { desc: M, qty: M + W - 170, rate: M + W - 110, total: M + W };
      text("Description", cols.desc, 9, bold, mut);
      page.drawText("Qty", { x: cols.qty, y, size: 9, font: bold, color: mut });
      page.drawText("Rate", { x: cols.rate, y, size: 9, font: bold, color: mut });
      right("Amount", 9, bold, mut);
      y -= 8;
      rule();
      y -= 16;

      for (const l of lines) {
        const descLines = wrap(l.desc || "-", 10.5, cols.qty - M - 14);
        for (let i = 0; i < descLines.length; i++) {
          text(descLines[i], cols.desc, 10.5);
          if (i === 0) {
            page.drawText(enc(String(l.qty || "")), { x: cols.qty, y, size: 10.5, font, color: ink });
            page.drawText(enc(money(Number(l.rate) || 0, cur)), { x: cols.rate, y, size: 10.5, font, color: ink });
            right(money(l.total, cur), 10.5);
          }
          y -= 16;
        }
        y -= 4;
        if (y < 170) break; // one page is the promise; more items than fit is a different product
      }

      y -= 6;
      rule();
      y -= 20;
      right(`Subtotal   ${money(subtotal, cur)}`, 10.5, font, mut);
      if (tax > 0) {
        y -= 16;
        right(`${taxLabel} ${Number(taxPct)}%   ${money(tax, cur)}`, 10.5, font, mut);
      }
      y -= 22;
      right(`Total   ${money(total, cur)}`, 14, bold);

      if (notes.trim()) {
        y -= 40;
        text("Notes", M, 9, bold, mut);
        y -= 14;
        for (const ln of wrap(notes, 10, W).slice(0, 5)) {
          text(ln, M, 10, font, mut);
          y -= 13;
        }
      }

      const bytes = await doc.save();
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${num.replace(/[^\w-]+/g, "_") || "invoice"}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
      setNote(
        replaced
          ? "Saved. Some characters are outside what the built-in PDF font can print and came out as ?. Latin letters, digits and common symbols are safe."
          : "Saved. Built on this device; the numbers were never sent anywhere."
      );
    } catch (e) {
      setErr("The PDF could not be built: " + (e?.message || "unknown problem") + ".");
    }
    setBusy(false);
  }

  return (
    <div className="pdfw">
      <div className="field-row">
        <label style={{ flex: "1 1 240px" }}>
          Your name or business
          <input type="text" value={from.name} onChange={(e) => saveFrom({ ...from, name: e.target.value })}
            placeholder="Zufa Digital" autoComplete="organization" />
        </label>
        <label style={{ flex: "1 1 240px" }}>
          Your details, one line each
          <textarea value={from.details} onChange={(e) => saveFrom({ ...from, details: e.target.value })}
            rows={3} placeholder={"street, city\nemail\ntax number"} />
        </label>
      </div>
      <p className="note">Your details are kept in this browser only, so the next invoice starts filled in.</p>

      <div className="field-row">
        <label style={{ flex: "1 1 240px" }}>
          Client name
          <input type="text" value={to.name} onChange={(e) => setTo({ ...to, name: e.target.value })} autoComplete="off" />
        </label>
        <label style={{ flex: "1 1 240px" }}>
          Client details
          <textarea value={to.details} onChange={(e) => setTo({ ...to, details: e.target.value })} rows={3} />
        </label>
      </div>

      <div className="field-row">
        <label>Invoice number<input type="text" value={num} onChange={(e) => setNum(e.target.value)} /></label>
        <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        <label>Due date<input type="date" value={due} onChange={(e) => setDue(e.target.value)} /></label>
        <label>
          Currency
          <select value={cur} onChange={(e) => setCur(e.target.value)}>
            {CURRENCIES.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </label>
      </div>

      <div className="pdfw-opts">
        {items.map((it, i) => (
          <div className="field-row" key={i}>
            <label style={{ flex: "2 1 220px" }}>
              {i === 0 ? "Description" : ""}
              <input type="text" value={it.desc} placeholder="Homepage redesign"
                onChange={(e) => setItem(i, "desc", e.target.value)} />
            </label>
            <label style={{ width: 80 }}>
              {i === 0 ? "Qty" : ""}
              <input type="number" min="0" step="any" value={it.qty}
                onChange={(e) => setItem(i, "qty", e.target.value)} />
            </label>
            <label style={{ width: 120 }}>
              {i === 0 ? "Rate" : ""}
              <input type="number" min="0" step="any" value={it.rate} placeholder="0.00"
                onChange={(e) => setItem(i, "rate", e.target.value)} />
            </label>
            <button type="button" className="btn" aria-label={`Remove line ${i + 1}`}
              disabled={items.length === 1}
              onClick={() => setItems((p) => p.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        <div className="btn-row">
          <button type="button" className="btn" onClick={() => setItems((p) => [...p, emptyItem()])}>
            Add line
          </button>
        </div>
      </div>

      <div className="field-row">
        <label>
          Tax name
          <input type="text" value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} placeholder="VAT" />
        </label>
        <label>
          Tax rate %
          <input type="number" min="0" max="100" step="any" value={taxPct}
            onChange={(e) => setTaxPct(e.target.value)} />
        </label>
        <label style={{ flex: "1 1 240px" }}>
          Notes on the invoice
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment within 14 days to IBAN ..." />
        </label>
      </div>

      <div className="stat-grid">
        <div className="stat"><span className="s-num">{money(subtotal, cur)}</span><span className="s-label">Subtotal</span></div>
        <div className="stat"><span className="s-num">{money(tax, cur)}</span><span className="s-label">{taxLabel || "Tax"}</span></div>
        <div className="stat"><span className="s-num">{money(total, cur)}</span><span className="s-label">Total</span></div>
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={makePdf}>
          {busy ? "Building…" : "Download invoice PDF"}
        </button>
      </div>

      {err && <div className="error-note">{err}</div>}
      {note && !err && <p className="note">{note}</p>}
    </div>
  );
}
