"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Renders a tool that was added through TinaCMS as pasted HTML, CSS and JS.
// The code runs inside a sandboxed frame, so a broken or badly behaved
// tool can never break the page around it, and it cannot reach the parent
// document. The frame reports its own height so there is no inner scrollbar.
export default function ToolEmbed({ doc, title, frameId }) {
  const frameRef = useRef(null);
  const [height, setHeight] = useState(260);

  // The frame loads from srcdoc almost instantly, usually before React has
  // hydrated, so its first height messages would be sent with nobody
  // listening. Asking for the height after mount closes that race.
  const requestHeight = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage({ __wtPing: true, __wtId: frameId }, "*");
  }, [frameId]);

  useEffect(() => {
    function onMessage(event) {
      // The frame is sandboxed and therefore cross-origin, so match on the
      // id we baked into its runtime rather than on the window object.
      if (!event.data || event.data.__wtId !== frameId) return;
      const next = event.data.__wtHeight;
      if (typeof next === "number" && next > 0) {
        setHeight(Math.ceil(next) + 2);
      }
    }
    window.addEventListener("message", onMessage);

    requestHeight();
    const timers = [80, 300, 900, 2000].map((ms) => setTimeout(requestHeight, ms));

    return () => {
      window.removeEventListener("message", onMessage);
      timers.forEach(clearTimeout);
    };
  }, [frameId, requestHeight]);

  return (
    <iframe
      ref={frameRef}
      className="tool-embed"
      title={title || "Tool"}
      srcDoc={doc}
      style={{ height }}
      onLoad={requestHeight}
      sandbox="allow-scripts allow-popups allow-modals allow-downloads"
    />
  );
}
