import Link from "next/link";
import Icon from "@/lib/icons";
import { getCategory } from "@/lib/tools";

export default function ToolCard({ tool }) {
  const cat = getCategory(tool.category);
  return (
    <Link
      href={`/tools/${tool.slug}/`}
      className="tool-card"
      style={{ "--cat-color": cat?.color }}
    >
      <Icon name={tool.icon} emoji={tool.emoji} size={20} className="t-icon" />
      <div className="t-name">{tool.name}</div>
      <div className="t-short">{tool.short}</div>
      <span className="t-tag">{cat?.name}</span>
    </Link>
  );
}
