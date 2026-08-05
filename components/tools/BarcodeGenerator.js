"use client";

import { useMemo, useState } from "react";
import { code128, ean13 } from "@/lib/barcode";

/* Renders the encoders in lib/barcode.js as SVG, with PNG export.

   SVG is the primary format on purpose: barcodes go into labels and print
   layouts, where a vector scales to any size without the fuzzy edges that
   make scanners struggle. The PNG button rasterises the same SVG at 3x for
   tools that cannot place vectors. */

const MODULE = 2; // px per module in the preview
const HEIGHT = 90;
const QUIET = 10; // quiet zone, in modules, each side

function buildSvg(widths, label, showLabel) {
  const totalModules = widths.reduce((a, b) => a + b, 0) + QUIET * 2;
  const w = totalModules * MODULE;
  const h = HEIGHT + (showLabel ? 24 : 8);
  let x = QUIET * MODULE;
  let bars = "";
  widths.forEach((wd, i) => {
    if (i % 2 === 0) bars += `<rect x="${x}" y="4" width="${wd * MODULE}" height="${HEIGHT - 8}"/>`;
    x += wd * MODULE;
  });
  const text = showLabel
    ? `<text x="${w / 2}" y="${HEIGHT + 12}" text-anchor="middle" font-family="monospace" font-size="13">${label
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#ffffff"/><g fill="#000000">${bars}</g>${text}</svg>`;
}

export default function BarcodeGenerator() {
  const [type, setType] = useState("code128");
  const [value, setValue] = useState("");
  const [showLabel, setShowLabel] = useState(true);
  const [note, setNote] = useState("");

  const result = useMemo(() => {
    const v = value.trim();
    if (!v) return null;
    try {
      const r = type === "ean13" ? ean13(v) : code128(v);
      return { svg: buildSvg(r.widths, r.label, showLabel), label: r.label };
    } catch (e) {
      return { error: e.message };
    }
  }, [type, value, showLabel]);

  const saveSvg = () => {
    const url = URL.createObjectURL(new Blob([result.svg], { type: "image/svg+xml" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode-${result.label.replace(/[^\w-]+/g, "_")}.svg`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
  };

  const savePng = () => {
    const img = new Image();
    const url = URL.createObjectURL(new Blob([result.svg], { type: "image/svg+xml" }));
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * 3;
      canvas.height = img.height * 3;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false; // crisp modules, no antialiased edges
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) { setNote("The browser could not encode the PNG."); return; }
        const purl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = purl;
        a.download = `barcode-${result.label.replace(/[^\w-]+/g, "_")}.png`;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(purl); a.remove(); }, 8000);
      }, "image/png");
    };
    img.src = url;
  };

  return (
    <div className="pdfw">
      <div className="pdfw-opts">
        <div className="field-row">
          <label>
            Barcode type
            <select value={type} onChange={(e) => { setType(e.target.value); setNote(""); }}>
              <option value="code128">Code 128, for SKUs and text</option>
              <option value="ean13">EAN-13, for retail products</option>
            </select>
          </label>
          <label>
            {type === "ean13" ? "Product number, 12 or 13 digits" : "Text or number to encode"}
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === "ean13" ? "590123412345" : "SKU-2026-0815"}
              autoComplete="off"
              spellCheck={false}
            />
          </label>
        </div>
        <label className="field-row">
          <input type="checkbox" checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)} />
          Print the value under the bars
        </label>
      </div>

      {result?.error && <div className="error-note">{result.error}</div>}

      {result?.svg && (
        <>
          <div
            style={{ background: "#fff", borderRadius: 12, padding: 16, overflowX: "auto",
                     border: "1px solid var(--line)" }}
            dangerouslySetInnerHTML={{ __html: result.svg }}
          />
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={saveSvg}>Download SVG</button>
            <button type="button" className="btn" onClick={savePng}>Download PNG</button>
          </div>
          <p className="note">
            {note || "Test a printed sample with your scanner before producing labels in volume. Generated on this device; the code you typed was not sent anywhere."}
          </p>
        </>
      )}

      {!value.trim() && (
        <p className="note">
          Type a value and the barcode appears as you type. EAN-13 checks its
          own last digit, so a typo in a product number is caught here rather
          than at the till.
        </p>
      )}
    </div>
  );
}
