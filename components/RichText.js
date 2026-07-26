import Link from "next/link";

// Renders a string containing markdown-style links — [text](/tools/slug/) —
// and **bold** spans as a paragraph with real <Link>/<strong> elements.
// Used for CMS content from content/ so inline markup survives the render.
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const BOLD_RE = /\*\*([^*]+)\*\*/g;

export function stripLinks(text) {
  return text.replace(LINK_RE, "$1").replace(BOLD_RE, "$1");
}

function renderBold(text, keyBase) {
  const parts = [];
  let last = 0;
  let match;
  BOLD_RE.lastIndex = 0;
  while ((match = BOLD_RE.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(<strong key={`${keyBase}-${parts.length}`}>{match[1]}</strong>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function RichText({ text, className }) {
  const parts = [];
  let last = 0;
  let match;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) parts.push(...renderBold(text.slice(last, match.index), parts.length));
    const [, label, href] = match;
    parts.push(
      href.startsWith("/") ? (
        <Link key={parts.length} href={href}>{label}</Link>
      ) : (
        <a key={parts.length} href={href}>{label}</a>
      )
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(...renderBold(text.slice(last), parts.length));
  return <p className={className}>{parts}</p>;
}
