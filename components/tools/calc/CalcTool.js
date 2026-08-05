"use client";

import { useMemo, useState } from "react";

/* The chassis for every form-in, numbers-out calculator. A tool file
   supplies fields and one pure compute(values) function; this renders the
   form, runs compute on every change, and lays out stats, tables and
   notes the same way across the whole site.

   compute returns any of:
     error: string        -> red box, nothing else shown
     warn: string         -> red box, results still shown
     stats: [{num,label}] -> the stat strip
     table: {head:[], rows:[][]} -> scrollable mini table
     notes: [string]      -> explanation paragraphs
*/

export default function CalcTool({ config }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(config.fields.map((f) => [f.key, f.default ?? ""]))
  );

  const result = useMemo(() => {
    try {
      return config.compute(values) || null;
    } catch {
      return { error: "Those inputs do not work together. Check them and try again." };
    }
  }, [values, config]);

  const set = (key, v) => setValues((p) => ({ ...p, [key]: v }));

  return (
    <div className="pdfw">
      <div className="field-row">
        {config.fields.map((f) => (
          <label key={f.key} style={f.flex ? { flex: f.flex } : undefined}>
            {f.label}
            {f.type === "select" ? (
              <select value={values[f.key]} onChange={(e) => set(f.key, e.target.value)}>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : f.type === "checkbox" ? (
              <input type="checkbox" checked={!!values[f.key]} onChange={(e) => set(f.key, e.target.checked)} />
            ) : (
              <input
                type={f.type || "number"}
                inputMode={f.type === "date" ? undefined : "decimal"}
                min={f.min} max={f.max} step={f.step ?? "any"}
                value={values[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => set(f.key, e.target.value)}
              />
            )}
          </label>
        ))}
      </div>

      {config.intro && !result?.stats && !result?.error && <p className="note">{config.intro}</p>}
      {result?.error && <div className="error-note">{result.error}</div>}

      {result && !result.error && (
        <>
          {result.stats?.length > 0 && (
            <div className="stat-grid">
              {result.stats.map((s, i) => (
                <div className="stat" key={i}>
                  <span className="s-num">{s.num}</span>
                  <span className="s-label">{s.label}</span>
                </div>
              ))}
            </div>
          )}
          {result.warn && <div className="error-note">{result.warn}</div>}
          {result.table && (
            <div className="table-scroll">
              <table className="mini-table">
                {result.table.head && (
                  <thead><tr>{result.table.head.map((h, i) => (<th key={i}>{h}</th>))}</tr></thead>
                )}
                <tbody>
                  {result.table.rows.map((r, i) => (
                    <tr key={i}>{r.map((c, j) => (<td key={j}>{c}</td>))}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {(result.notes || []).map((n, i) => (
            <p className="note" key={i}>{n}</p>
          ))}
        </>
      )}
    </div>
  );
}

export const fmt = (n, d = 0) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
export const num = (v) => Number(v) || 0;
