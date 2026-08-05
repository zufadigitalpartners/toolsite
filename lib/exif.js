// JPEG metadata: read it, and strip it without touching the image.
//
// A JPEG is a sequence of segments (0xFF marker, length, payload) ending in
// the entropy-coded image data. All the revealing material lives in APP
// segments: EXIF and XMP in APP1, Photoshop IRB in APP13, free-text COM.
// The pixels do not need any of them, so removal is byte surgery: copy the
// file, skip those segments. No decode, no re-encode, not one pixel changed.
//
// The parser reads the TIFF structure inside APP1 for the tags people
// actually care about, GPS above all.

const TAG_NAMES = {
  0x010f: "Camera make",
  0x0110: "Camera model",
  0x0112: "Orientation",
  0x0131: "Software",
  0x0132: "Date modified",
  0x013b: "Artist",
  0x8298: "Copyright",
  0x9003: "Date taken",
  0x829a: "Exposure time",
  0x829d: "F-number",
  0x8827: "ISO",
  0x920a: "Focal length",
  0xa434: "Lens model",
  0xa002: "Pixel width",
  0xa003: "Pixel height",
};

function readIfd(view, tiffStart, ifdOffset, little, out, isGps) {
  if (ifdOffset <= 0 || tiffStart + ifdOffset + 2 > view.byteLength) return;
  const count = view.getUint16(tiffStart + ifdOffset, little);
  const gps = {};
  for (let i = 0; i < count; i++) {
    const e = tiffStart + ifdOffset + 2 + i * 12;
    if (e + 12 > view.byteLength) break;
    const tag = view.getUint16(e, little);
    const type = view.getUint16(e + 2, little);
    const n = view.getUint32(e + 4, little);
    const sizes = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
    const unit = sizes[type] || 1;
    const byteLen = unit * n;
    // Values longer than 4 bytes live elsewhere in the TIFF; short ones sit
    // inline in the entry itself.
    const at = byteLen <= 4 ? e + 8 : tiffStart + view.getUint32(e + 8, little);
    if (at + byteLen > view.byteLength) continue;

    const rational = (ix) => {
      const num = view.getUint32(at + ix * 8, little);
      const den = view.getUint32(at + ix * 8 + 4, little);
      return den ? num / den : 0;
    };

    let value;
    if (type === 2) {
      let s = "";
      for (let j = 0; j < n - 1; j++) s += String.fromCharCode(view.getUint8(at + j));
      value = s.trim();
    } else if (type === 3) value = view.getUint16(at, little);
    else if (type === 4) value = view.getUint32(at, little);
    else if (type === 5 || type === 10) value = rational(0);
    else continue;

    if (isGps) {
      if (tag === 1 || tag === 3) gps[tag] = value; // N/S, E/W refs
      else if (tag === 2 || tag === 4) gps[tag] = [rational(0), rational(1), rational(2)];
      else if (tag === 6) gps[tag] = value; // altitude
      continue;
    }

    if (tag === 0x8769) readIfd(view, tiffStart, value, little, out, false); // Exif sub-IFD
    else if (tag === 0x8825) readIfd(view, tiffStart, value, little, out, true); // GPS IFD
    else if (TAG_NAMES[tag] && value !== "" && value !== undefined) {
      let shown = value;
      if (tag === 0x829a && value > 0 && value < 1) shown = "1/" + Math.round(1 / value) + " s";
      if (tag === 0x829d) shown = "f/" + Number(value.toFixed ? value.toFixed(1) : value);
      if (tag === 0x920a) shown = value + " mm";
      out.tags[TAG_NAMES[tag]] = String(shown);
    }
  }
  if (isGps && gps[2] && gps[4]) {
    const dms = (a) => a[0] + a[1] / 60 + a[2] / 3600;
    let lat = dms(gps[2]);
    let lon = dms(gps[4]);
    if (gps[1] === "S") lat = -lat;
    if (gps[3] === "W") lon = -lon;
    out.gps = { lat: Number(lat.toFixed(6)), lon: Number(lon.toFixed(6)), alt: gps[6] };
  }
}

/** Walks the JPEG. Returns { tags: {label: value}, gps, segments: [...] } */
export function readJpegMeta(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (bytes.length < 4 || view.getUint16(0) !== 0xffd8) {
    throw new Error("This is not a JPEG. Metadata stripping here works on .jpg photos.");
  }
  const out = { tags: {}, gps: null, segments: [] };
  let p = 2;
  while (p + 4 <= bytes.length) {
    if (bytes[p] !== 0xff) break;
    const marker = bytes[p + 1];
    if (marker === 0xd9) break; // EOI
    if (marker === 0xda) { out.segments.push({ marker, start: p, end: bytes.length }); break; } // SOS: rest is image data
    const len = view.getUint16(p + 2);
    const seg = { marker, start: p, end: p + 2 + len };
    out.segments.push(seg);

    // APP1 holding "Exif\0\0" carries the TIFF block.
    if (marker === 0xe1 && len > 8) {
      const sig = String.fromCharCode(...bytes.slice(p + 4, p + 10));
      if (sig.startsWith("Exif")) {
        const tiff = p + 10;
        const order = view.getUint16(tiff);
        const little = order === 0x4949;
        if (little || order === 0x4d4d) {
          readIfd(view, tiff, view.getUint32(tiff + 4, little), little, out, false);
        }
      } else if (sig.startsWith("http:")) {
        seg.xmp = true;
      }
    }
    p = seg.end;
  }
  return out;
}

// Everything a decoder needs stays; everything about *you* goes.
// APP0 (JFIF) and APP2 (usually the ICC colour profile) are kept because
// dropping the profile visibly shifts colours on wide-gamut photos, which
// would break the "not one pixel changed" promise in spirit.
const STRIP = new Set([0xe1, 0xed, 0xfe]); // APP1 (EXIF+XMP), APP13, COM

export function stripJpegMeta(bytes) {
  const meta = readJpegMeta(bytes);
  const parts = [bytes.slice(0, 2)]; // SOI
  let removed = 0;
  for (const seg of meta.segments) {
    if (STRIP.has(seg.marker)) { removed += seg.end - seg.start; continue; }
    parts.push(bytes.slice(seg.start, seg.end));
  }
  const total = parts.reduce((a, b) => a + b.length, 0);
  const out = new Uint8Array(total);
  let q = 0;
  for (const b of parts) { out.set(b, q); q += b.length; }
  return { bytes: out, removed };
}
