/* Line icons, drawn to one grid: 24x24 box, 1.5px stroke, round caps and
   joins, no fills. They replace emoji, which rendered as flat Segoe blobs on
   Windows and glossy art on macOS, so the site was literally a different
   product per operating system.

   Colour is never set here. It comes from `color` on the parent, which is how
   a tool card passes its category pigment down without a second variable. */

export const ICONS = {
  // text
  type: '<path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>',
  text: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h10"/>',
  "case-upper":
    '<path d="M3 18 7 6l4 12"/><path d="M4.6 14.5h4.8"/><path d="M14 18V9"/><path d="M14 9h4a2.5 2.5 0 0 1 0 5h-4"/><path d="M18 14a2.5 2.5 0 0 1 0 4h-4"/>',
  "git-compare":
    '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M13 6H9a3 3 0 0 0-3 3v6.5"/><path d="M11 18h4a3 3 0 0 0 3-3V8.5"/>',
  link: '<path d="M10 13a4 4 0 0 0 5.7.3l3-3a4 4 0 0 0-5.7-5.7L11.3 6.3"/><path d="M14 11a4 4 0 0 0-5.7-.3l-3 3a4 4 0 0 0 5.7 5.7l1.7-1.7"/>',
  "link-2":
    '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 0 1 0 10h-2"/><path d="M8 12h8"/>',
  "align-left":
    '<path d="M4 5h16"/><path d="M4 10h10"/><path d="M4 15h14"/><path d="M4 20h8"/>',

  // generators
  "key-round":
    '<path d="M2.6 15.4 9 9a5.5 5.5 0 1 1 5 5l-1.2 1.2H11v2H9v2H6.5L5 21H3v-2.5z"/><circle cx="16.5" cy="7.5" r="1.2"/>',
  "qr-code":
    '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3z"/><path d="M20 14v3"/><path d="M14 20h3"/><path d="M20 20h1"/>',
  dices:
    '<rect x="3" y="9" width="12" height="12" rx="2"/><path d="M9 9V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4"/><path d="M7 13h.01"/><path d="M11 17h.01"/>',
  sparkles:
    '<path d="M12 3l1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>',

  // calculators
  calculator:
    '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 11h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 15h.01"/><path d="M12 15h.01"/><path d="M16 15v4"/><path d="M8 19h5"/>',
  cake: '<path d="M4 21h16"/><path d="M4 21v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/><path d="M4 17h16"/><path d="M12 13V9"/><path d="M12 6.5a1.2 1.2 0 1 1-1.2-1.2c0-.8 1.2-2.3 1.2-2.3s1.2 1.5 1.2 2.3A1.2 1.2 0 0 1 12 6.5z"/>',
  "calendar-days":
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/>',
  percent: '<path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
  activity: '<path d="M3 12h4l3 8 4-16 3 8h4"/>',
  landmark:
    '<path d="M3 21h18"/><path d="M5 21V10"/><path d="M9 21V10"/><path d="M15 21V10"/><path d="M19 21V10"/><path d="M3 10h18"/><path d="M12 3 3 7.5h18z"/>',
  ruler:
    '<path d="M16.5 2.5 21.5 7.5a1.4 1.4 0 0 1 0 2L9.5 21.5a1.4 1.4 0 0 1-2 0l-5-5a1.4 1.4 0 0 1 0-2L14.5 2.5a1.4 1.4 0 0 1 2 0z"/><path d="M12 6l2.5 2.5"/><path d="M9 9l2.5 2.5"/><path d="M6 12l2.5 2.5"/>',

  // developer
  braces:
    '<path d="M9 3H8a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1"/><path d="M15 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1"/>',
  terminal: '<path d="m5 17 6-5-6-5"/><path d="M12 19h7"/>',
  binary:
    '<rect x="4" y="3" width="6" height="7" rx="1"/><rect x="14" y="14" width="6" height="7" rx="1"/><path d="M14 3h3v7"/><path d="M14 10h6"/><path d="M4 14h3v7"/><path d="M4 21h6"/>',
  fingerprint:
    '<path d="M12 11v2a9 9 0 0 1-1.3 4.7"/><path d="M8 20a13 13 0 0 0 1.8-7v-2a2.2 2.2 0 0 1 4.4 0v2c0 1.6-.2 3.2-.6 4.7"/><path d="M16.8 18.5c.5-1.8.8-3.6.8-5.5v-2a5.6 5.6 0 0 0-11.2 0v2"/><path d="M3.7 8.5A9 9 0 0 1 20 8"/>',
  palette:
    '<path d="M12 3a9 9 0 0 0 0 18 2 2 0 0 0 1.6-3.2 2 2 0 0 1 1.6-3.2H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="15" cy="8.5" r="1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  table:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M3 15h18"/><path d="M10 4v16"/>',

  // image
  image:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m3 17 5-5 4 4 3-3 6 6"/>',
  "image-down":
    '<rect x="3" y="3" width="18" height="13" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 13 4-4 3 3 3-3 4 4"/><path d="M12 18v4"/><path d="m9 20 3 2 3-2"/>',
  scaling:
    '<path d="M13 3H5a2 2 0 0 0-2 2v8"/><path d="M21 11v8a2 2 0 0 1-2 2h-8"/><path d="M14 14h7v7"/><path d="m14 21 7-7"/><path d="M3 17v2a2 2 0 0 0 2 2h2"/>',
  "file-image":
    '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><circle cx="10" cy="12.5" r="1.2"/><path d="m8 18 2.5-2.5L13 18l2-2 2 2"/>',

  // conversion and creation tools
  images:
    '<rect x="8" y="3" width="13" height="13" rx="2"/><circle cx="12.5" cy="7.5" r="1.3"/><path d="m8 13 3.5-3.5 3.5 3.5 2-2 4 4"/><path d="M3 8v10a3 3 0 0 0 3 3h10"/>',
  "scan-text":
    '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 8h10"/><path d="M7 12h10"/><path d="M7 16h6"/>',
  receipt:
    '<path d="M6 2h12v20l-2-1.5L14 22l-2-1.5L10 22l-2-1.5L6 22z"/><path d="M9 7h6"/><path d="M9 11h6"/><path d="M9 15h4"/>',
  signature:
    '<path d="M13 5.5 18.5 11 8 21.5H2.5V16z"/><path d="m11.5 7 5.5 5.5"/><path d="M14 21.5h7.5"/>',
  barcode:
    '<path d="M3 5v14"/><path d="M6.5 5v14"/><path d="M8 5v14"/><path d="M11.5 5v14"/><path d="M14 5v14"/><path d="M15.5 5v14"/><path d="M19 5v14"/><path d="M21 5v14"/>',
  wheel:
    '<circle cx="12" cy="12" r="9"/><path d="M12 12V3"/><path d="m12 12 7.8 4.5"/><path d="m12 12-7.8 4.5"/><circle cx="12" cy="12" r="1.5"/>',
  camera:
    '<path d="M3 8.5A1.5 1.5 0 0 1 4.5 7H7l2-3h6l2 3h2.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.5"/>',
  "list-reorder":
    '<path d="M4 6h11"/><path d="M4 12h11"/><path d="M4 18h11"/><path d="M19 5v14"/><path d="m16.8 7.5 2.2-2.5 2.2 2.5"/><path d="m16.8 16.5 2.2 2.5 2.2-2.5"/>',
  "table-down":
    '<rect x="3" y="4" width="18" height="11" rx="2"/><path d="M3 9h18"/><path d="M10 4v11"/><path d="M12 18v4"/><path d="m9 20 3 2 3-2"/>',

  // interface
  "arrow-right": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  "badge-check":
    '<path d="M12 2.5 14.3 5l3.4-.2.5 3.4 2.8 2-1.5 3 1.5 3-2.8 2-.5 3.4-3.4-.2L12 21.5 9.7 19l-3.4.2-.5-3.4-2.8-2 1.5-3-1.5-3 2.8-2 .5-3.4L9.7 5z"/><path d="m9 12 2 2 4-4"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.4-3 8.2-7.5 9.5-4.5-1.3-7.5-5.1-7.5-9.5V6z"/>',
  "user-x":
    '<circle cx="10" cy="8" r="4"/><path d="M3 20a7 7 0 0 1 11.5-5.4"/><path d="m17 16 5 5"/><path d="m22 16-5 5"/>',
  smartphone:
    '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18.5h2"/>',
  square: '<rect x="4" y="4" width="16" height="16" rx="3"/>',
};

/* Renders a known icon, or falls back to the emoji the tool already carries.
   That fallback matters: tools are created in the CMS, and a new one with no
   icon picked yet must still show something rather than an empty box. */
export default function Icon({ name, emoji, size = 20, className }) {
  const inner = name && ICONS[name];

  if (!inner) {
    if (emoji) {
      return (
        <span
          className={className}
          aria-hidden="true"
          style={{ fontSize: `${size - 2}px`, lineHeight: 1, display: "inline-block" }}
        >
          {emoji}
        </span>
      );
    }
    return null;
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}

/* For the Tina dropdown, so someone adding a tool picks from the real set
   instead of guessing a name. */
export const ICON_NAMES = Object.keys(ICONS).sort();
