"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";

export default function QrGenerator() {
  const [text, setText] = useState("https://");
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const value = text.trim() || " ";
    QRCode.toCanvas(canvasRef.current, value, {
      width: 260,
      margin: 2,
      color: { dark: "#0d1326", light: "#ffffff" },
    }).catch(() => {});
  }, [text]);

  function download() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr-code.png";
    a.click();
  }

  return (
    <div>
      <div className="input-row">
        <label>
          Link or text
          <input
            className="tool-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="https://your-link.com or any text"
          />
        </label>
      </div>
      <div className="qr-box">
        <canvas ref={canvasRef} aria-label="Generated QR code" />
      </div>
      <div className="btn-row">
        <button className="btn btn-primary" onClick={download}>Download PNG</button>
      </div>
    </div>
  );
}
