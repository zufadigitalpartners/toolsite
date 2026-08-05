"use client";

import { useEffect, useRef, useState } from "react";
import { fmtBytes } from "@/components/tools/pdf/PdfWorkspace";

/* XLSX and XLS to CSV, parsed by SheetJS in the browser. Dynamic import,
   cached, own chunk, same as every other heavy dependency here.

   Two decisions worth explaining:

   raw: false asks SheetJS for the *formatted* text of each cell, the way
   Excel displays it, rather than the stored value. For a converter this is
   the right default: a cell showing 007 stays 007, a date column shows the
   dates people saw in Excel rather than serial numbers like 45231.

   The output is quoted per RFC 4180 only where needed, so simple files
   stay clean and files containing commas, quotes or line breaks stay
   correct. */

let xlsxPromise = null;
function loadXlsx() {
  if (!xlsxPromise) xlsxPromise = import("xlsx");
  return xlsxPromise;
}

function csvField(v) {
  const s = v == null ? "" : String(v);
  return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

export default function ExcelToCsv() {
  const [wb, setWb] = useState(null); // {name, sheets: [{name, rows, cols, csv}]}
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { loadXlsx().catch(() => {}); }, []);

  async function take(list) {
    const f = Array.from(list || []).find((x) => /\.(xlsx|xls|xlsm|ods)$/i.test(x.name || ""));
    if (!f) { setErr("That does not look like an Excel file. This tool reads .xlsx, .xls, .xlsm and .ods."); return; }
    setErr("");
    setBusy(true);
    setNote("Reading " + f.name + "…");
    try {
      const XLSX = await loadXlsx();
      const book = XLSX.read(await f.arrayBuffer(), { type: "array", cellDates: false });
      const sheets = book.SheetNames.map((name) => {
        const ws = book.Sheets[name];
        // sheet_to_json with header:1 gives rows of formatted strings; from
        // there the CSV writing is ours, so quoting behaviour is known
        // rather than whatever a library version does this month.
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });
        while (rows.length && rows[rows.length - 1].every((c) => c === "")) rows.pop();
        const csv = rows.map((r) => r.map(csvField).join(",")).join("\r\n");
        return { name, rows: rows.length, cols: rows[0]?.length || 0, csv, preview: rows.slice(0, 8) };
      });
      setWb({ name: f.name, size: f.size, sheets });
      setActive(0);
      setNote(
        sheets.length === 1
          ? "One sheet found. Nothing was uploaded."
          : sheets.length + " sheets found. Each one becomes its own CSV. Nothing was uploaded."
      );
    } catch (e) {
      setErr("That file could not be read: " + (e?.message || "unknown problem") + ". If it has a password, remove it in Excel first.");
      setNote("");
    }
    setBusy(false);
  }

  const save = (sheet) => {
    const stem = wb.name.replace(/\.(xlsx|xls|xlsm|ods)$/i, "");
    const name = wb.sheets.length === 1 ? stem + ".csv" : stem + "-" + sheet.name.replace(/[^\w-]+/g, "_") + ".csv";
    // The BOM is for Excel itself: without it, Excel opens UTF-8 CSVs as
    // ANSI and mangles anything beyond ASCII.
    const url = URL.createObjectURL(new Blob(["﻿" + sheet.csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 8000);
  };

  const sheet = wb?.sheets[active];

  return (
    <div className="pdfw">
      <div
        className={"pdfw-drop" + (over ? " over" : "")}
        onDragEnter={(e) => { e.preventDefault(); setOver(true); }}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
      >
        <p><b>Drop your Excel file here</b></p>
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          or choose a file
        </button>
        <input
          ref={inputRef} type="file" accept=".xlsx,.xls,.xlsm,.ods" hidden
          onChange={(e) => { take(e.target.files); e.target.value = ""; }}
        />
        <p className="note">Your file never leaves this device. Nothing is uploaded.</p>
      </div>

      {wb && sheet && (
        <>
          {wb.sheets.length > 1 && (
            <div className="btn-row" role="tablist" aria-label="Sheets">
              {wb.sheets.map((s, i) => (
                <button key={s.name} type="button" role="tab" aria-selected={i === active}
                  className={"btn" + (i === active ? " btn-primary" : "")}
                  onClick={() => setActive(i)}>
                  {s.name}
                </button>
              ))}
            </div>
          )}

          <div className="stat-grid">
            <div className="stat"><span className="s-num">{sheet.rows}</span><span className="s-label">Rows</span></div>
            <div className="stat"><span className="s-num">{sheet.cols}</span><span className="s-label">Columns</span></div>
            <div className="stat"><span className="s-num">{fmtBytes(sheet.csv.length)}</span><span className="s-label">CSV size</span></div>
          </div>

          {sheet.preview.length > 0 && (
            <div className="table-scroll">
              <table className="mini-table">
                <tbody>
                  {sheet.preview.map((r, i) => (
                    <tr key={i}>
                      {r.slice(0, 8).map((c, j) => (<td key={j}>{String(c).slice(0, 40)}</td>))}
                      {r.length > 8 && <td>…</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="btn-row">
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => save(sheet)}>
              Download {wb.sheets.length > 1 ? `"${sheet.name}" as CSV` : "CSV"}
            </button>
            {wb.sheets.length > 1 && (
              <button type="button" className="btn" disabled={busy} onClick={() => wb.sheets.forEach(save)}>
                Download every sheet
              </button>
            )}
            <button type="button" className="btn" disabled={busy}
              onClick={() => { setWb(null); setNote(""); setErr(""); }}>
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
