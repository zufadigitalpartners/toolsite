"use client";

import { useEffect, useRef, useState } from "react";
import { makeZip } from "@/lib/zip";
import { fmtBytes } from "@/components/tools/pdf/PdfWorkspace";

/* HEIC and HEIF to JPG, decoded in the browser by libheif compiled to wasm
   (the heic2any package). Same discipline as pdf-lib and pdf.js: dynamic
   import, cached, own chunk, so only the people converting iPhone photos
   ever download the decoder.

   Some browsers can already decode HEIC natively (Safari 17+). We try the
   cheap native path first and fall back to wasm, so on an iPhone this tool
   is instant. */

let heicPromise = null;
function loadHeic() {
  if (!heicPromise) heicPromise = import("heic2any").then((m) => m.default || m);
  return heicPromise;
}

async function nativeDecode(file) {
  // createImageBitmap throws on formats the browser cannot decode, which
  // is exactly the test we want.
  try { return await createImageBitmap(file); } catch { return null; }
}

const MAX_FILES = 30;

export default function HeicToJpg() {
  const [items, setItems] = useState([]); // {name, inBytes, outBlob, url, w, h} | {name, error}
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { loadHeic().catch(() => {}); }, []);

  // Revoke object URLs on unmount only. Keying this cleanup on [items]
  // would revoke the URLs of already-listed photos every time one more
  // finishes converting, breaking their Save buttons.
  const itemsRef = useRef(items);
  itemsRef.current = items;
  useEffect(() => () => { itemsRef.current.forEach((it) => it.url && URL.revokeObjectURL(it.url)); }, []);

  async function toJpg(file, q) {
    const bitmap = await nativeDecode(file);
    let source = bitmap;
    if (!source) {
      const heic2any = await loadHeic();
      // heic2any can convert straight to JPEG, but going via PNG blob and
      // re-encoding on canvas gives one code path for both decode routes
      // and lets the quality slider apply either way.
      const png = await heic2any({ blob: file, toType: "image/png" });
      source = await createImageBitmap(Array.isArray(png) ? png[0] : png);
    }
    const w = source.width;
    const h = source.height;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(source, 0, 0);
    source.close?.();
    const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", q));
    canvas.width = 0;
    if (!blob) throw new Error("the browser could not encode the JPG");
    return { blob, w, h };
  }

  async function add(list) {
    const incoming = Array.from(list || [])
      .filter((f) => /\.heic$|\.heif$/i.test(f.name || "") || /heic|heif/.test(f.type))
      .slice(0, MAX_FILES);
    if (!incoming.length) {
      setErr("Those files do not look like HEIC photos. This tool wants the .heic files an iPhone produces.");
      return;
    }
    setErr("");
    setBusy(true);
    for (let i = 0; i < incoming.length; i++) {
      const f = incoming[i];
      setNote(`Converting ${i + 1} of ${incoming.length}: ${f.name}`);
      try {
        const { blob, w, h } = await toJpg(f, quality);
        setItems((prev) => [...prev, {
          name: f.name.replace(/\.(heic|heif)$/i, "") + ".jpg",
          inBytes: f.size, outBlob: blob, url: URL.createObjectURL(blob), w, h,
        }]);
      } catch (e) {
        setItems((prev) => [...prev, { name: f.name, error: e?.message || "could not be converted" }]);
      }
    }
    setNote("Done. Nothing was uploaded; the conversion ran on this device.");
    setBusy(false);
  }

  const good = items.filter((it) => it.outBlob);

  const saveOne = (it) => {
    const a = document.createElement("a");
    a.href = it.url;
    a.download = it.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const saveZip = async () => {
    const entries = [];
    for (const it of good) entries.push({ name: it.name, data: new Uint8Array(await it.outBlob.arrayBuffer()) });
    const url = URL.createObjectURL(new Blob([makeZip(entries)], { type: "application/zip" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-jpg.zip";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
  };

  return (
    <div className="pdfw">
      <div
        className={"pdfw-drop" + (over ? " over" : "")}
        onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files); }}
      >
        <p><b>Drop your HEIC photos here</b></p>
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          or choose files
        </button>
        <input
          ref={inputRef} type="file" accept=".heic,.heif,image/heic,image/heif" multiple hidden
          onChange={(e) => { add(e.target.files); e.target.value = ""; }}
        />
        <p className="note">Your photos never leave this device. Nothing is uploaded.</p>
      </div>

      <div className="pdfw-opts">
        <label className="field-row">
          JPG quality: {Math.round(quality * 100)}%
          <input type="range" min="0.5" max="1" step="0.05" value={quality} disabled={busy}
            onChange={(e) => setQuality(Number(e.target.value))} />
        </label>
        <p className="note">90% is visually identical to the original for photographs. The slider applies to photos you add after moving it.</p>
      </div>

      {items.length > 0 && (
        <>
          <div className="pdfw-files">
            {items.map((it, i) => (
              <div className="pdfw-file" key={it.name + i}>
                <span className="pdfw-name">{it.name}</span>
                {it.error ? (
                  <span className="pdfw-meta">{it.error}</span>
                ) : (
                  <>
                    <span className="pdfw-meta">{fmtBytes(it.inBytes)} → {fmtBytes(it.outBlob.size)}</span>
                    <span className="pdfw-btns">
                      <button type="button" onClick={() => saveOne(it)}>Save</button>
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="btn-row">
            {good.length > 1 && (
              <button type="button" className="btn btn-primary" disabled={busy} onClick={saveZip}>
                Download all as ZIP
              </button>
            )}
            {good.length === 1 && (
              <button type="button" className="btn btn-primary" disabled={busy} onClick={() => saveOne(good[0])}>
                Download JPG
              </button>
            )}
            <button type="button" className="btn" disabled={busy}
              onClick={() => { setItems((p) => { p.forEach((it) => it.url && URL.revokeObjectURL(it.url)); return []; }); setNote(""); setErr(""); }}>
              Clear
            </button>
          </div>
        </>
      )}

      {err && <div className="error-note">{err}</div>}
      {note && !err && <p className="note">{note}</p>}
    </div>
  );
}
