"use client";

import { useState } from "react";
import PdfWorkspace from "./PdfWorkspace";

export default function WatermarkPdf() {
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(15);
  const [angle, setAngle] = useState(45);
  const [size, setSize] = useState(60);
  const [color, setColor] = useState("grey");

  const COLOURS = {
    grey: [0.35, 0.35, 0.38],
    red: [0.72, 0.16, 0.13],
    blue: [0.11, 0.3, 0.72],
    black: [0, 0, 0],
  };

  return (
    <PdfWorkspace
      actionLabel="Add the watermark"
      outputName="watermarked.pdf"
      hint="Marks a document as a draft or a copy before you send it on."
      canRun={() => text.trim().length > 0}
      onRun={async (files, { PDFDocument, StandardFonts, rgb, degrees }) => {
        const f = files[0];
        const doc = await PDFDocument.load(f.buf, { ignoreEncryption: true });
        const font = await doc.embedFont(StandardFonts.HelveticaBold);
        const [r, g, b] = COLOURS[color] || COLOURS.grey;
        const fs = Math.max(10, Math.min(200, +size || 60));
        const rad = ((+angle || 0) * Math.PI) / 180;

        doc.getPages().forEach((page) => {
          const { width, height } = page.getSize();
          const w = font.widthOfTextAtSize(text, fs);
          // Rotating about the text's own start point moves it off centre, so
          // the offset is worked out from the rotated bounding box and the
          // text is placed to sit in the middle of the page whatever the angle.
          const dx = (w / 2) * Math.cos(rad);
          const dy = (w / 2) * Math.sin(rad);
          page.drawText(text, {
            x: width / 2 - dx,
            y: height / 2 - dy - (fs / 2) * Math.cos(rad),
            size: fs,
            font,
            color: rgb(r, g, b),
            opacity: Math.max(0.02, Math.min(1, (+opacity || 15) / 100)),
            rotate: degrees(+angle || 0),
          });
        });

        doc.setProducer("toolsinpocket.com");
        return doc.save();
      }}
    >
      {() => (
        <>
          <div className="input-row">
            <label>
              <span>What should it say?</span>
              <input type="text" className="tool-text" value={text} maxLength={40}
                onChange={(e) => setText(e.target.value)} placeholder="CONFIDENTIAL" />
            </label>
          </div>
          <div className="input-2col" style={{ marginTop: 14 }}>
            <label>
              <span>Color</span>
              <select className="tool-text" value={color} onChange={(e) => setColor(e.target.value)}>
                <option value="grey">Grey</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="black">Black</option>
              </select>
            </label>
            <label>
              <span>Angle across the page</span>
              <select className="tool-text" value={angle} onChange={(e) => setAngle(e.target.value)}>
                <option value="45">Diagonal, bottom left to top right</option>
                <option value="0">Straight across</option>
                <option value="315">Diagonal, top left to bottom right</option>
                <option value="90">Vertical</option>
              </select>
            </label>
          </div>
          <div className="input-2col" style={{ marginTop: 14 }}>
            <label>
              <span>How faint? {opacity}%</span>
              <input type="range" min="2" max="60" value={opacity}
                onChange={(e) => setOpacity(e.target.value)} />
            </label>
            <label>
              <span>Text size</span>
              <input type="number" className="tool-text" min="10" max="200" value={size}
                onChange={(e) => setSize(e.target.value)} />
            </label>
          </div>
          <p className="note" style={{ marginTop: 12 }}>
            Around 15% is readable without fighting the text underneath. This
            marks a document, it does not protect it: anyone can remove a
            watermark with the right software.
          </p>
        </>
      )}
    </PdfWorkspace>
  );
}
