"use client";

import { useEffect, useRef, useState } from "react";

/* Draw or type a signature, download it as a transparent PNG.

   The drawing surface is a plain canvas at devicePixelRatio, with pointer
   events so mouse, finger and stylus are one code path. Strokes are kept
   as point arrays and replayed on every change, which makes undo trivial
   (drop the last stroke) and lets the export re-render clean at 3x.

   The typed tab exists because plenty of people cannot draw a signature
   they like with a mouse, and a handwriting font is what every e-sign
   service gives them anyway. */

const FONTS = [
  { css: "'Segoe Script', 'Bradley Hand', cursive", label: "Flowing" },
  { css: "'Lucida Handwriting', 'Apple Chancery', cursive", label: "Formal" },
  { css: "'Comic Sans MS', 'Chalkboard SE', cursive", label: "Relaxed" },
];
const COLORS = [
  { v: "#101828", label: "Ink" },
  { v: "#1d4ed8", label: "Blue" },
  { v: "#111111", label: "Black" },
];

export default function SignatureMaker() {
  const [mode, setMode] = useState("draw");
  const [strokes, setStrokes] = useState([]);
  const [color, setColor] = useState(COLORS[0].v);
  const [width, setWidth] = useState(2.5);
  const [typed, setTyped] = useState("");
  const [font, setFont] = useState(0);
  const [note, setNote] = useState("");
  const canvasRef = useRef(null);
  const live = useRef(null); // stroke being drawn right now

  // Replay everything. Runs on every stroke commit; cheap at these sizes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const s of strokes) {
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.beginPath();
      s.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    }
  }, [strokes]);

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  const down = (e) => {
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    live.current = { color, width, pts: [pos(e)] };
  };
  const moveP = (e) => {
    if (!live.current) return;
    const p = pos(e);
    live.current.pts.push(p);
    // Draw the segment immediately; the replay effect redraws on commit.
    const ctx = canvasRef.current.getContext("2d");
    const n = live.current.pts.length;
    if (n > 1) {
      ctx.strokeStyle = live.current.color;
      ctx.lineWidth = live.current.width;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(...live.current.pts[n - 2]);
      ctx.lineTo(...p);
      ctx.stroke();
    }
  };
  const up = () => {
    if (!live.current) return;
    const s = live.current;
    live.current = null;
    if (s.pts.length > 1) setStrokes((prev) => [...prev, s]);
  };

  function exportPng() {
    const scale = 3; // print-sharp
    const out = document.createElement("canvas");

    if (mode === "draw") {
      if (!strokes.length) { setNote("Draw something first."); return; }
      // Tight crop with padding, so the PNG is the signature, not the pad.
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const s of strokes) for (const [x, y] of s.pts) {
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      }
      const pad = 12;
      out.width = Math.round((maxX - minX + pad * 2) * scale);
      out.height = Math.round((maxY - minY + pad * 2) * scale);
      const ctx = out.getContext("2d");
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const s of strokes) {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        s.pts.forEach(([x, y], i) => {
          const px = x - minX + pad, py = y - minY + pad;
          i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
        });
        ctx.stroke();
      }
    } else {
      const name = typed.trim();
      if (!name) { setNote("Type your name first."); return; }
      const fontCss = `52px ${FONTS[font].css}`;
      const measure = document.createElement("canvas").getContext("2d");
      measure.font = fontCss;
      const m = measure.measureText(name);
      const pad = 24;
      out.width = Math.round((m.width + pad * 2) * scale);
      out.height = Math.round(110 * scale);
      const ctx = out.getContext("2d");
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.font = fontCss;
      ctx.fillStyle = color;
      ctx.textBaseline = "middle";
      ctx.fillText(name, pad, 55);
    }

    out.toBlob((blob) => {
      if (!blob) { setNote("The browser could not encode the PNG."); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "signature.png";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
      setNote("Saved. The background is transparent, so it drops onto any document cleanly.");
    }, "image/png");
  }

  return (
    <div className="pdfw">
      <div className="btn-row" role="tablist" aria-label="Signature mode">
        <button type="button" role="tab" aria-selected={mode === "draw"}
          className={"btn" + (mode === "draw" ? " btn-primary" : "")} onClick={() => setMode("draw")}>
          Draw it
        </button>
        <button type="button" role="tab" aria-selected={mode === "type"}
          className={"btn" + (mode === "type" ? " btn-primary" : "")} onClick={() => setMode("type")}>
          Type it
        </button>
      </div>

      <div className="pdfw-opts">
        <div className="field-row">
          <label>
            Color
            <select value={color} onChange={(e) => setColor(e.target.value)}>
              {COLORS.map((c) => (<option key={c.v} value={c.v}>{c.label}</option>))}
            </select>
          </label>
          {mode === "draw" ? (
            <label>
              Pen thickness: {width}px
              <input type="range" min="1" max="6" step="0.5" value={width}
                onChange={(e) => setWidth(Number(e.target.value))} />
            </label>
          ) : (
            <label>
              Style
              <select value={font} onChange={(e) => setFont(Number(e.target.value))}>
                {FONTS.map((f, i) => (<option key={f.label} value={i}>{f.label}</option>))}
              </select>
            </label>
          )}
        </div>
      </div>

      {mode === "draw" ? (
        <>
          <canvas
            ref={canvasRef}
            className="sig-pad"
            style={{ width: "100%", height: 220, touchAction: "none", cursor: "crosshair",
                     background: "var(--surface-2)", borderRadius: 12, border: "1px dashed var(--line-strong)" }}
            onPointerDown={down}
            onPointerMove={moveP}
            onPointerUp={up}
            onPointerCancel={up}
            aria-label="Signature drawing area"
          />
          <div className="btn-row">
            <button type="button" className="btn" disabled={!strokes.length}
              onClick={() => setStrokes((p) => p.slice(0, -1))}>Undo stroke</button>
            <button type="button" className="btn" disabled={!strokes.length}
              onClick={() => setStrokes([])}>Clear</button>
            <button type="button" className="btn btn-primary" onClick={exportPng}>Download PNG</button>
          </div>
        </>
      ) : (
        <>
          <label className="field-row" style={{ display: "block" }}>
            Your name
            <input type="text" value={typed} onChange={(e) => setTyped(e.target.value)}
              placeholder="Alex Morgan" autoComplete="off" />
          </label>
          {typed.trim() && (
            <div style={{ font: `52px ${FONTS[font].css}`, color, padding: "18px 8px", overflowX: "auto" }}>
              {typed.trim()}
            </div>
          )}
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={exportPng}>Download PNG</button>
          </div>
        </>
      )}

      <p className="note">
        {note || "Everything happens on this device. Your signature is never uploaded, which is exactly how a signature should be treated."}
      </p>
    </div>
  );
}
