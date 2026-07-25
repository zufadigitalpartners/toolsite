"use client";

import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const paragraphs = text.trim()
    ? text.trim().split(/\n\s*\n/).filter(Boolean).length
    : 0;
  const readingMins = Math.max(1, Math.round(words / 200));

  return (
    <div>
      <textarea
        className="tool-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here…"
        aria-label="Text to count"
      />
      <div className="stat-grid">
        <div className="stat"><div className="s-num">{words}</div><div className="s-label">Words</div></div>
        <div className="stat"><div className="s-num">{chars}</div><div className="s-label">Characters</div></div>
        <div className="stat"><div className="s-num">{charsNoSpaces}</div><div className="s-label">No spaces</div></div>
        <div className="stat"><div className="s-num">{sentences}</div><div className="s-label">Sentences</div></div>
        <div className="stat"><div className="s-num">{paragraphs}</div><div className="s-label">Paragraphs</div></div>
        <div className="stat"><div className="s-num">{words ? readingMins : 0}</div><div className="s-label">Min read</div></div>
      </div>
    </div>
  );
}
