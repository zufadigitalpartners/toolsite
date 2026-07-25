"use client";

import { useState } from "react";

function calcAge(dobStr) {
  const dob = new Date(dobStr + "T00:00:00");
  const now = new Date();
  if (isNaN(dob) || dob > now) return null;

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((now - dob) / 86400000);

  let nextBday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBday < now) nextBday = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
  const daysToBday = Math.ceil((nextBday - now) / 86400000);

  return { years, months, days, totalDays, daysToBday };
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const age = dob ? calcAge(dob) : null;

  return (
    <div>
      <div className="input-row">
        <label>
          Date of birth
          <input
            className="tool-text"
            type="date"
            value={dob}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDob(e.target.value)}
          />
        </label>
      </div>

      {age && (
        <div className="stat-grid">
          <div className="stat"><div className="s-num">{age.years}</div><div className="s-label">Years</div></div>
          <div className="stat"><div className="s-num">{age.months}</div><div className="s-label">Months</div></div>
          <div className="stat"><div className="s-num">{age.days}</div><div className="s-label">Days</div></div>
          <div className="stat"><div className="s-num">{age.totalDays.toLocaleString()}</div><div className="s-label">Total days</div></div>
          <div className="stat"><div className="s-num">{age.daysToBday}</div><div className="s-label">Days to birthday</div></div>
        </div>
      )}
      {dob && !age && <div className="error-note">Please pick a valid date in the past.</div>}
      {!dob && <p className="result-note">Pick your date of birth to see your exact age.</p>}
    </div>
  );
}
