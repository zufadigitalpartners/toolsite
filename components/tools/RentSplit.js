"use client";

import { useMemo, useState } from "react";
import { rentSplit } from "@/lib/property";

/* Fair is a method, not a feeling. Three methods, visible working, and
   the flatmates can pick their fairness in the open. */

const fmt = (n) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(n));
const row = () => ({ name: "", roomSize: "", income: "" });

export default function RentSplit() {
  const [total, setTotal] = useState("1500");
  const [method, setMethod] = useState("roomSize");
  const [people, setPeople] = useState([row(), row()]);

  const set = (i, k, v) => setPeople((p) => p.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  const result = useMemo(() => {
    const t = Number(total) || 0;
    const ps = people
      .map((p, i) => ({ name: p.name.trim() || "Person " + (i + 1), roomSize: p.roomSize, income: p.income }))
      .filter((p, i) => people[i].name.trim() || Number(people[i].roomSize) > 0 || Number(people[i].income) > 0);
    if (t <= 0 || ps.length < 2) return null;
    return rentSplit({ totalRent: t, method, people: ps });
  }, [total, method, people]);

  const keyLabel = method === "income" ? "Monthly income" : "Room size, m²";

  return (
    <div className="pdfw">
      <div className="field-row">
        <label>
          Total rent
          <input type="number" min="0" step="any" inputMode="decimal" value={total}
            onChange={(e) => setTotal(e.target.value)} />
        </label>
        <label>
          Split by
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="roomSize">Room size, bigger room pays more</option>
            <option value="income">Income, stronger shoulders carry more</option>
            <option value="equal">Equally, simplest and bluntest</option>
          </select>
        </label>
      </div>

      {people.map((p, i) => (
        <div className="field-row" key={i}>
          <label style={{ flex: "1.4 1 140px" }}>
            {i === 0 ? "Name" : ""}
            <input type="text" value={p.name} placeholder={["Ayesha", "Bilal", "Sara"][i % 3]}
              onChange={(e) => set(i, "name", e.target.value)} />
          </label>
          {method !== "equal" && (
            <label style={{ flex: "1 1 120px" }}>
              {i === 0 ? keyLabel : ""}
              <input type="number" min="0" step="any" inputMode="decimal"
                value={method === "income" ? p.income : p.roomSize}
                placeholder={method === "income" ? "2500" : "14"}
                onChange={(e) => set(i, method === "income" ? "income" : "roomSize", e.target.value)} />
            </label>
          )}
          <button type="button" className="btn" aria-label={`Remove person ${i + 1}`}
            disabled={people.length === 2}
            onClick={() => setPeople((prev) => prev.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <div className="btn-row">
        <button type="button" className="btn" onClick={() => setPeople((p) => [...p, row()])}>
          Add a flatmate
        </button>
      </div>

      {result && (
        <>
          <div className="table-scroll">
            <table className="mini-table">
              <thead><tr><th>Who</th><th>Pays</th>{method !== "equal" && <th>Share</th>}</tr></thead>
              <tbody>
                {result.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{fmt(r.share)}</td>
                    {method !== "equal" && <td>{r.pct != null ? r.pct + "%" : ""}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note">
            {method === "roomSize"
              ? "Splitting by room area treats shared space as shared and private space as purchased: the 16 m² room pays proportionally more than the 10 m². Count only bedroom area; the kitchen belongs to everyone. A room with a private bathroom or balcony can be nudged up a few percent by agreement, which is easier once this baseline is on the table."
              : method === "income"
                ? "Splitting by income is what couples and families often quietly want and rarely say out loud: the same flat costs each person the same fraction of their means. It requires the honesty of sharing income figures, which is exactly why having a calculator produce the number helps."
                : "Equal splits are unbeatable for identical rooms and awkward everywhere else, which is why the other two methods exist one click away."}
            {" "}Rounded shares can drift from the total by a unit or two; the person who got the biggest room traditionally absorbs it. Nothing entered here is stored or sent.
          </p>
        </>
      )}
    </div>
  );
}
