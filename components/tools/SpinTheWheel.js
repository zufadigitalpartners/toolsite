"use client";

import { useEffect, useRef, useState } from "react";

/* A spinning wheel that picks a name. Canvas, no dependencies.

   Fairness note, because "is it rigged" is the first question a classroom
   asks: the winner is chosen by the final resting angle of a spin whose
   length comes from crypto.getRandomValues, not by picking a name first
   and animating towards it. Every slice is the same size, so every name
   has exactly the same odds.

   The animation is a fixed cubic ease-out over ~5s. requestAnimationFrame
   drives it; the winner is read from the angle under the pointer when the
   wheel stops. */

const COLORS = ["#1d4ed8", "#c4356e", "#0b7285", "#1f8a55", "#a21caf", "#c4402a", "#b45309", "#4338ca"];

function randomTurns() {
  const u32 = new Uint32Array(1);
  crypto.getRandomValues(u32);
  // 6 to 10 full turns plus a uniformly random fraction of one turn.
  return 6 + (u32[0] / 0xffffffff) * 4;
}

export default function SpinTheWheel() {
  const [names, setNames] = useState("Ayesha\nBilal\nSara\nHamza\nZainab\nOmar");
  const [winner, setWinner] = useState("");
  const [history, setHistory] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const canvasRef = useRef(null);
  const angleRef = useRef(0); // radians, persists between spins
  const rafRef = useRef(0);

  const list = names.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 60);

  function draw(angle) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssSize = Math.min(canvas.parentElement?.clientWidth || 340, 340);
    if (canvas.width !== Math.round(cssSize * dpr)) {
      canvas.width = canvas.height = Math.round(cssSize * dpr);
      canvas.style.width = canvas.style.height = cssSize + "px";
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssSize, cssSize);
    const cx = cssSize / 2;
    const cy = cssSize / 2;
    const r = cssSize / 2 - 10;
    const n = Math.max(list.length, 1);
    const slice = (Math.PI * 2) / n;

    for (let i = 0; i < n; i++) {
      const a0 = angle + i * slice;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a0, a0 + slice);
      ctx.closePath();
      ctx.fillStyle = list.length ? COLORS[i % COLORS.length] : "#e7ebf2";
      // Neighbouring slices must differ; when count % palette === 1 the
      // first and last would clash, so nudge the last one.
      if (i === n - 1 && n > 1 && n % COLORS.length === 1) ctx.fillStyle = COLORS[(i + 3) % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.85)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (list.length) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(a0 + slice / 2);
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        const size = n > 24 ? 10 : n > 12 ? 12 : 14;
        ctx.font = `600 ${size}px system-ui, sans-serif`;
        let label = list[i];
        while (label.length > 2 && ctx.measureText(label).width > r - 34) label = label.slice(0, -2) + "…";
        ctx.fillText(label, r - 14, 0);
        ctx.restore();
      }
    }

    // hub and pointer
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#d2d9e4";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + r + 8, cy - 10);
    ctx.lineTo(cx + r + 8, cy + 10);
    ctx.lineTo(cx + r - 12, cy);
    ctx.closePath();
    ctx.fillStyle = "#12141c";
    ctx.fill();
  }

  useEffect(() => {
    draw(angleRef.current);
    const onResize = () => draw(angleRef.current);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [names]);

  function spin() {
    if (spinning || list.length < 2) return;
    setSpinning(true);
    setWinner("");
    const start = angleRef.current;
    const delta = randomTurns() * Math.PI * 2;
    const dur = 4800;
    let t0 = 0;

    const step = (ts) => {
      if (!t0) t0 = ts;
      const t = Math.min((ts - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      angleRef.current = start + delta * eased;
      draw(angleRef.current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // The pointer sits at angle 0 (3 o'clock). Which slice is under it?
        const n = list.length;
        const slice = (Math.PI * 2) / n;
        const a = ((-angleRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const ix = Math.floor(a / slice) % n;
        const name = list[ix];
        setWinner(name);
        setHistory((h) => [name, ...h].slice(0, 12));
        setSpinning(false);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }

  const removeWinner = () => {
    if (!winner) return;
    setNames((prev) => prev.split("\n").filter((s) => s.trim() !== winner).join("\n"));
    setWinner("");
  };

  return (
    <div className="pdfw">
      <div className="field-row" style={{ alignItems: "start" }}>
        <label style={{ flex: "1 1 200px" }}>
          One name per line · {list.length} in the wheel
          <textarea value={names} onChange={(e) => setNames(e.target.value)} rows={10}
            disabled={spinning} spellCheck={false} />
        </label>
        <div style={{ flex: "2 1 280px", display: "grid", justifyItems: "center", gap: "var(--s3)" }}>
          <canvas ref={canvasRef} aria-label="The wheel" role="img" />
          <button type="button" className="btn btn-primary" onClick={spin}
            disabled={spinning || list.length < 2}>
            {spinning ? "Spinning…" : "Spin the wheel"}
          </button>
        </div>
      </div>

      <div aria-live="polite">
        {winner && (
          <div className="stat-grid">
            <div className="stat"><span className="s-num">{winner}</span><span className="s-label">Winner</span></div>
          </div>
        )}
      </div>

      {winner && (
        <div className="btn-row">
          <button type="button" className="btn" onClick={removeWinner}>
            Remove {winner} and keep going
          </button>
        </div>
      )}

      {history.length > 1 && (
        <p className="note">Previous winners: {history.slice(1).join(", ")}</p>
      )}

      {list.length < 2 && <p className="note">Add at least two names to spin.</p>}
      <p className="note">
        Every slice is the same size and the spin length comes from the
        browser&apos;s cryptographic random generator, so every name has exactly
        equal odds. Runs entirely on this device.
      </p>
    </div>
  );
}
