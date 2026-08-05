"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { loadPdfLib } from "@/components/tools/pdf/PdfWorkspace";
import { buildBusinessDoc } from "@/lib/docpdf";

/* One form for the whole business-document family: invoice, quote,
   receipt, purchase order, credit note, packing slip. Each tool passes a
   config; the form and the PDF engine stay identical, which is why the
   documents come out looking like one company produced them.

   Sender details and logo persist in this browser (and only there), keyed
   once for the whole family: fill them in on the invoice, they are ready
   on the quote. */

const LS_FROM = "tip-doc-from";
const LS_FROM_LEGACY = "tip-invoice-from";
const LS_LOGO = "tip-doc-logo";
const MAX_LOGO_BYTES = 300 * 1024;

const CURRENCIES = ["$", "€", "£", "Rs", "AED", "CHF", "kr", "PLN", "R"];
const emptyItem = () => ({ desc: "", qty: "1", rate: "", discount: "0" });

function money(n, cur) {
  const v = (Math.round(n * 100) / 100).toFixed(2);
  return cur.length > 1 ? `${cur} ${v}` : `${cur}${v}`;
}

export default function DocForm({ config }) {
  const [from, setFrom] = useState({ name: "", details: "" });
  const [to, setTo] = useState({ name: "", details: "" });
  const [num, setNum] = useState(config.numberPrefix + "-001");
  const [meta, setMeta] = useState(() =>
    Object.fromEntries(config.metaFields.map((m) => [m.key, ""]))
  );
  const [cur, setCur] = useState("$");
  const [items, setItems] = useState([emptyItem()]);
  const [taxPct, setTaxPct] = useState("0");
  const [taxLabel, setTaxLabel] = useState("Tax");
  const [shipping, setShipping] = useState("0");
  const [notes, setNotes] = useState("");
  const [logo, setLogo] = useState(null); // {dataUrl, mime}
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const logoInput = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_FROM) || localStorage.getItem(LS_FROM_LEGACY) || "null");
      if (saved?.name || saved?.details) setFrom(saved);
      const l = JSON.parse(localStorage.getItem(LS_LOGO) || "null");
      if (l?.dataUrl) setLogo(l);
    } catch { /* fresh form */ }
    setMeta((prev) => {
      const next = { ...prev };
      for (const m of config.metaFields) {
        if (m.type === "date" && m.defaultToday) next[m.key] = new Date().toISOString().slice(0, 10);
      }
      return next;
    });
    loadPdfLib().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFrom = (next) => {
    setFrom(next);
    try { localStorage.setItem(LS_FROM, JSON.stringify(next)); } catch { /* private mode */ }
  };

  const onLogo = (file) => {
    if (!file) return;
    if (!/image\/(png|jpeg)/.test(file.type)) { setErr("The logo must be a PNG or JPG."); return; }
    if (file.size > MAX_LOGO_BYTES) { setErr("Keep the logo under 300 KB; compress it with our image compressor first."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const l = { dataUrl: reader.result, mime: file.type };
      setLogo(l);
      setErr("");
      try { localStorage.setItem(LS_LOGO, JSON.stringify(l)); } catch { /* too big for storage is fine */ }
    };
    reader.readAsDataURL(file);
  };

  const setItem = (i, k, v) => setItems((p) => p.map((it, j) => (j === i ? { ...it, [k]: v } : it)));

  const lines = useMemo(() => items
    .map((it) => {
      const qty = Number(it.qty) || 0;
      const rate = Number(it.rate) || 0;
      const disc = config.discount ? Math.min(100, Math.max(0, Number(it.discount) || 0)) : 0;
      const total = qty * rate * (1 - disc / 100);
      return { ...it, qtyN: qty, rateN: rate, disc, total };
    })
    .filter((it) => it.desc.trim() || it.total > 0 || it.qtyN > 0), [items, config.discount]);

  const subtotal = lines.reduce((a, l) => a + l.total, 0);
  const tax = config.tax ? subtotal * ((Number(taxPct) || 0) / 100) : 0;
  const ship = config.shipping ? Number(shipping) || 0 : 0;
  const total = subtotal + tax + ship;

  async function makePdf() {
    setErr("");
    if (!from.name.trim()) { setErr("Fill in your own name or business name first."); return; }
    if (!lines.length) { setErr("Add at least one line item."); return; }
    setBusy(true);
    try {
      const pdfLib = await loadPdfLib();
      let logoSpec = null;
      if (logo?.dataUrl) {
        const b64 = logo.dataUrl.split(",")[1];
        logoSpec = { bytes: Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)), mime: logo.mime };
      }
      const columns = config.prices
        ? [
            { key: "desc", label: "Description", width: config.discount ? 215 : 245 },
            { key: "qty", label: "Qty", width: 50, align: "right" },
            { key: "rate", label: "Rate", width: 80, align: "right" },
            ...(config.discount ? [{ key: "disc", label: "Disc", width: 50, align: "right" }] : []),
            { key: "amount", label: "Amount", width: 90, align: "right" },
          ]
        : [
            { key: "desc", label: "Item", width: 375 },
            { key: "qty", label: "Qty", width: 120, align: "right" },
          ];
      const totals = config.prices
        ? [
            { label: "Subtotal", value: money(subtotal, cur) },
            ...(tax > 0 ? [{ label: `${taxLabel} ${Number(taxPct)}%`, value: money(tax, cur) }] : []),
            ...(ship > 0 ? [{ label: "Shipping", value: money(ship, cur) }] : []),
            { label: config.totalLabel || "Total", value: money(total, cur), bold: true },
          ]
        : [{ label: "Total items", value: String(lines.reduce((a, l) => a + l.qtyN, 0)), bold: true }];

      const { bytes, replaced } = await buildBusinessDoc(pdfLib, {
        docTitle: config.title,
        number: num,
        logo: logoSpec,
        meta: config.metaFields
          .map((m) => ({ label: m.label, value: meta[m.key] }))
          .filter((m) => m.value),
        from: { label: config.fromLabel || "From", name: from.name, lines: from.details.split("\n").filter(Boolean) },
        to: { label: config.toLabel, name: to.name, lines: to.details.split("\n").filter(Boolean) },
        columns,
        items: lines.map((l) => ({
          desc: l.desc || "-",
          qty: String(l.qtyN || ""),
          rate: money(l.rateN, cur),
          disc: l.disc ? l.disc + "%" : "",
          amount: money(l.total, cur),
        })),
        totals,
        notes: notes.trim(),
        notesLabel: config.notesLabel || "Notes",
        footer: config.footer,
      });
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${num.replace(/[^\w-]+/g, "_") || config.title.toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
      setNote(replaced
        ? "Saved. Some characters are outside the built-in PDF font and came out as ?; Latin letters and digits are safe."
        : "Saved. Built on this device; nothing was uploaded.");
    } catch (e) {
      setErr("The PDF could not be built: " + (e?.message || "unknown problem") + ".");
    }
    setBusy(false);
  }

  return (
    <div className="pdfw">
      <div className="field-row">
        <label style={{ flex: "1 1 220px" }}>
          Your name or business
          <input type="text" value={from.name} onChange={(e) => saveFrom({ ...from, name: e.target.value })}
            autoComplete="organization" />
        </label>
        <label style={{ flex: "1 1 220px" }}>
          Your details, one line each
          <textarea value={from.details} onChange={(e) => saveFrom({ ...from, details: e.target.value })}
            rows={3} placeholder={"street, city\nemail\ntax number"} />
        </label>
        <label>
          Logo, PNG or JPG
          <span className="btn-row" style={{ margin: 0 }}>
            <button type="button" className="btn" onClick={() => logoInput.current?.click()}>
              {logo ? "Change logo" : "Add logo"}
            </button>
            {logo && (
              <button type="button" className="btn"
                onClick={() => { setLogo(null); try { localStorage.removeItem(LS_LOGO); } catch {} }}>
                Remove
              </button>
            )}
          </span>
          <input ref={logoInput} type="file" accept="image/png,image/jpeg" hidden
            onChange={(e) => { onLogo(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
        {logo && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={logo.dataUrl} alt="Your logo" style={{ height: 40, alignSelf: "end" }} />
        )}
      </div>
      <p className="note">Your details and logo are kept in this browser only, shared across all our document tools.</p>

      <div className="field-row">
        <label style={{ flex: "1 1 220px" }}>
          {config.toLabel}
          <input type="text" value={to.name} onChange={(e) => setTo({ ...to, name: e.target.value })} autoComplete="off" />
        </label>
        <label style={{ flex: "1 1 220px" }}>
          Their details
          <textarea value={to.details} onChange={(e) => setTo({ ...to, details: e.target.value })} rows={3} />
        </label>
      </div>

      <div className="field-row">
        <label>{config.numberLabel}<input type="text" value={num} onChange={(e) => setNum(e.target.value)} /></label>
        {config.metaFields.map((m) => (
          <label key={m.key}>
            {m.label}
            <input type={m.type || "text"} value={meta[m.key]}
              onChange={(e) => setMeta((p) => ({ ...p, [m.key]: e.target.value }))} />
          </label>
        ))}
        {config.prices && (
          <label>
            Currency
            <select value={cur} onChange={(e) => setCur(e.target.value)}>
              {CURRENCIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </label>
        )}
      </div>

      <div className="pdfw-opts">
        {items.map((it, i) => (
          <div className="field-row" key={i}>
            <label style={{ flex: "2 1 200px" }}>
              {i === 0 ? "Description" : ""}
              <input type="text" value={it.desc} placeholder={config.itemPlaceholder}
                onChange={(e) => setItem(i, "desc", e.target.value)} />
            </label>
            <label style={{ width: 76 }}>
              {i === 0 ? "Qty" : ""}
              <input type="number" min="0" step="any" value={it.qty}
                onChange={(e) => setItem(i, "qty", e.target.value)} />
            </label>
            {config.prices && (
              <label style={{ width: 110 }}>
                {i === 0 ? "Rate" : ""}
                <input type="number" min="0" step="any" value={it.rate} placeholder="0.00"
                  onChange={(e) => setItem(i, "rate", e.target.value)} />
              </label>
            )}
            {config.discount && (
              <label style={{ width: 84 }}>
                {i === 0 ? "Disc %" : ""}
                <input type="number" min="0" max="100" step="any" value={it.discount}
                  onChange={(e) => setItem(i, "discount", e.target.value)} />
              </label>
            )}
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

      {(config.tax || config.shipping) && (
        <div className="field-row">
          {config.tax && (
            <>
              <label>Tax name<input type="text" value={taxLabel} onChange={(e) => setTaxLabel(e.target.value)} placeholder="VAT" /></label>
              <label>Tax rate %<input type="number" min="0" max="100" step="any" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} /></label>
            </>
          )}
          {config.shipping && (
            <label>Shipping<input type="number" min="0" step="any" value={shipping} onChange={(e) => setShipping(e.target.value)} /></label>
          )}
        </div>
      )}

      <div className="field-row">
        <label style={{ flex: "1 1 320px" }}>
          {config.notesLabel || "Notes"}
          <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={config.notesPlaceholder} />
        </label>
      </div>

      {config.prices && (
        <div className="stat-grid">
          <div className="stat"><span className="s-num">{money(subtotal, cur)}</span><span className="s-label">Subtotal</span></div>
          <div className="stat"><span className="s-num">{money(tax + ship, cur)}</span><span className="s-label">{config.tax ? (taxLabel || "Tax") : ""}{config.tax && config.shipping ? " + " : ""}{config.shipping ? "shipping" : ""}</span></div>
          <div className="stat"><span className="s-num">{money(total, cur)}</span><span className="s-label">{config.totalLabel || "Total"}</span></div>
        </div>
      )}

      <div className="btn-row">
        <button type="button" className="btn btn-primary" disabled={busy} onClick={makePdf}>
          {busy ? "Building…" : `Download ${config.title.toLowerCase()} PDF`}
        </button>
      </div>

      {err && <div className="error-note">{err}</div>}
      {note && !err && <p className="note">{note}</p>}
    </div>
  );
}
