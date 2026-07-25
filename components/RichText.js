import Link from "next/link";

// Renders a string containing markdown-style links — [text](/tools/slug/) —
// as a paragraph with real <Link> elements. Used for SEO content in
// lib/content.js so contextual internal links can live inside paragraphs.
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export function stripLinks(text) {
  return text.replace(LINK_RE, "$1");
}

export default function RichText({ text, className }) {
  const parts = [];
  let last = 0;
  let match;
  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
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
  if (last < text.length) parts.push(text.slice(last));
  return <p className={className}>{parts}</p>;
}
