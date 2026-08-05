"use client";

import { useEffect, useRef, useState } from "react";
import { readJpegMeta, stripJpegMeta } from "@/lib/exif";
import { fmtBytes } from "@/components/tools/pdf/PdfWorkspace";

/* Shows what a photo says about you, then removes it.

   The stripping is byte surgery on the JPEG's segment list (lib/exif.js),
   not a re-encode, so the pixels in the clean copy are identical to the
   original down to the last byte of image data. That is the difference
   between this and "compress it somewhere and hope": quality is untouched
   and so is the file's colour profile.

   The GPS row gets special treatment because it is the row that matters.
   A photo taken at home carries the house's coordinates, and most people
   have no idea. */

export default function ExifRemover() {
  const [file, setFile] = useState(null);
  const [meta, setMeta] = useState(null);
  const [preview, setPreview] = useState("");
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function take(list) {
    const f = Array.from(list || [])[0];
    if (!f) return;
    setErr("");
    setNote("");
    setMeta(null);
    if (!/\.jpe?g$/i.test(f.name || "") && f.type !== "image/jpeg") {
      setErr("This tool reads JPG photos, which is where cameras and phones put their metadata. PNG screenshots carry almost none to begin with. HEIC photos: convert them with our HEIC to JPG tool first, which drops the metadata as a side effect.");
      return;
    }
    try {
      const bytes = new Uint8Array(await f.arrayBuffer());
      const m = readJpegMeta(bytes);
      setFile({ f, bytes });
      setMeta(m);
      setPreview((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(f); });
      const found = Object.keys(m.tags).length + (m.gps ? 1 : 0);
      setNote(found
        ? "Read on this device; nothing was uploaded."
        : "No readable metadata found. Either it was already stripped, or the app that saved this photo never wrote any.");
    } catch (e) {
      setErr(e?.message || "That file could not be read.");
    }
  }

  const saveClean = () => {
    try {
      const { bytes, removed } = stripJpegMeta(file.bytes);
      const url = URL.createObjectURL(new Blob([bytes], { type: "image/jpeg" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = file.f.name.replace(/\.(jpe?g)$/i, "") + "-clean.jpg";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
      setNote(`Saved. ${fmtBytes(removed)} of metadata removed; every pixel untouched.`);
    } catch (e) {
      setErr(e?.message || "Stripping failed.");
    }
  };

  const rows = meta ? Object.entries(meta.tags) : [];
  const hasAnything = meta && (rows.length > 0 || meta.gps);

  return (
    <div className="pdfw">
      <div
        className={"pdfw-drop" + (over ? " over" : "")}
        onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
      >
        <p><b>Drop a JPG photo here</b></p>
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          or choose a photo
        </button>
        <input
          ref={inputRef} type="file" accept=".jpg,.jpeg,image/jpeg" hidden
          onChange={(e) => { take(e.target.files); e.target.value = ""; }}
        />
        <p className="note">Your photo never leaves this device. Nothing is uploaded.</p>
      </div>

      {preview && (
        <figure className="p2j-page" style={{ maxWidth: 260, marginTop: "var(--s5)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="The photo being inspected" />
        </figure>
      )}

      {meta && (
        <>
          {meta.gps && (
            <div className="error-note">
              This photo contains its exact location: {meta.gps.lat}, {meta.gps.lon}.{" "}
              <a
                href={`https://www.openstreetmap.org/?mlat=${meta.gps.lat}&mlon=${meta.gps.lon}#map=16/${meta.gps.lat}/${meta.gps.lon}`}
                target="_blank" rel="noopener noreferrer"
              >
                See where that is
              </a>
              . If this photo was taken at home, that link points at your home.
            </div>
          )}

          {rows.length > 0 && (
            <div className="table-scroll">
              <table className="mini-table">
                <tbody>
                  {rows.map(([k, v]) => (
                    <tr key={k}><th>{k}</th><td>{v}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {hasAnything && (
            <div className="btn-row">
              <button type="button" className="btn btn-primary" onClick={saveClean}>
                Download a clean copy
              </button>
            </div>
          )}
        </>
      )}

      {err && <div className="error-note">{err}</div>}
      {note && !err && <p className="note">{note}</p>}
    </div>
  );
}
