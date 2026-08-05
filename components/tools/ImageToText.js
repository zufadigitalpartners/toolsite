"use client";

import { useRef, useState } from "react";

/* Image to text, run by Tesseract compiled to WebAssembly.

   One honest caveat, stated in the UI as well: the first run downloads the
   recognition model (a few megabytes) from a CDN. The *image* still never
   leaves the device; the network is used to fetch the engine, not to send
   the picture. That distinction is the whole point of the tool, so the
   status line spells it out.

   The worker is created once and kept, because loading the model is the
   expensive part and people OCR several images in a row. */

let workerPromise = null;
function getWorker(lang) {
  if (!workerPromise) {
    workerPromise = import("tesseract.js").then(async (T) => {
      const worker = await T.createWorker(lang);
      worker.__lang = lang;
      return worker;
    });
  }
  return workerPromise;
}

async function workerFor(lang) {
  let worker = await getWorker(lang);
  if (worker.__lang !== lang) {
    await worker.reinitialize(lang);
    worker.__lang = lang;
  }
  return worker;
}

const LANGS = [
  { id: "eng", label: "English" },
  { id: "spa", label: "Spanish" },
  { id: "fra", label: "French" },
  { id: "deu", label: "German" },
  { id: "por", label: "Portuguese" },
  { id: "ita", label: "Italian" },
  { id: "nld", label: "Dutch" },
  { id: "pol", label: "Polish" },
  { id: "tur", label: "Turkish" },
  { id: "ind", label: "Indonesian" },
  { id: "vie", label: "Vietnamese" },
  { id: "urd", label: "Urdu" },
  { id: "hin", label: "Hindi" },
  { id: "ara", label: "Arabic" },
  { id: "rus", label: "Russian" },
  { id: "jpn", label: "Japanese" },
  { id: "kor", label: "Korean" },
  { id: "chi_sim", label: "Chinese, simplified" },
];

export default function ImageToText() {
  const [lang, setLang] = useState("eng");
  const [text, setText] = useState("");
  const [conf, setConf] = useState(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [over, setOver] = useState(false);
  const [preview, setPreview] = useState("");
  const inputRef = useRef(null);

  async function recognize(file) {
    if (!file) return;
    if (!/^image\//.test(file.type) && !/\.(png|jpe?g|webp|bmp|gif)$/i.test(file.name || "")) {
      setErr("That is not an image. PNG, JPG, WebP and BMP work here. For PDFs, turn the pages into images first with our PDF to JPG tool.");
      return;
    }
    setErr("");
    setText("");
    setConf(null);
    setCopied(false);
    setBusy(true);
    setPreview((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(file); });
    try {
      setStatus("Loading the recognition engine. First time takes a few seconds while the model downloads; your image is not being uploaded.");
      const worker = await workerFor(lang);
      setStatus("Reading the image on this device…");
      const { data } = await worker.recognize(file);
      const clean = (data.text || "").replace(/[ \t]+\n/g, "\n").trim();
      setText(clean);
      setConf(Math.round(data.confidence || 0));
      setStatus(clean ? "" : "No text was found in that image.");
    } catch (e) {
      setErr("Recognition failed: " + (e?.message || "unknown problem") + ". If this keeps happening, the model download may be blocked on your network.");
      setStatus("");
    }
    setBusy(false);
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setErr("Your browser blocked the clipboard. Select the text and copy it by hand.");
    }
  };

  const saveTxt = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "extracted-text.txt";
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
        onDrop={(e) => { e.preventDefault(); setOver(false); recognize(e.dataTransfer.files?.[0]); }}
      >
        <p><b>Drop a photo or screenshot here</b></p>
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          or choose an image
        </button>
        <input
          ref={inputRef} type="file" accept="image/*" hidden
          onChange={(e) => { recognize(e.target.files?.[0]); e.target.value = ""; }}
        />
        <p className="note">The image is read on this device. The engine downloads once; your picture is never sent anywhere.</p>
      </div>

      <div className="pdfw-opts">
        <label className="field-row">
          Language of the text
          <select value={lang} disabled={busy} onChange={(e) => setLang(e.target.value)}>
            {LANGS.map((l) => (<option key={l.id} value={l.id}>{l.label}</option>))}
          </select>
        </label>
        <p className="note">Picking the right language matters more than image quality. Each language is a separate model, downloaded when first used.</p>
      </div>

      {preview && (
        <figure className="p2j-page" style={{ maxWidth: 320 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="The image being read" />
        </figure>
      )}

      {text && (
        <>
          <label className="field-row" style={{ display: "block" }}>
            Extracted text{conf != null ? ` · ${conf}% confidence` : ""}
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} spellCheck={false} />
          </label>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={copy}>{copied ? "Copied" : "Copy text"}</button>
            <button type="button" className="btn" onClick={saveTxt}>Download .txt</button>
            <button type="button" className="btn" onClick={() => { setText(""); setConf(null); setPreview((old) => { if (old) URL.revokeObjectURL(old); return ""; }); }}>
              Clear
            </button>
          </div>
        </>
      )}

      {err && <div className="error-note">{err}</div>}
      {status && !err && <p className="note">{status}</p>}
    </div>
  );
}
