import ToolShell from "@/components/ToolShell";
import ToolRenderer from "@/components/ToolRenderer";
import { tools, getTool, getCategory } from "@/lib/tools";
import { toolMetadata } from "@/lib/seo";

// Every tool in content/tools/ gets its own page automatically, so adding
// a tool in TinaCMS is enough to publish it. No route file to create.
export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }) {
  return toolMetadata(params.slug);
}

export default function ToolPage({ params }) {
  const tool = getTool(params.slug);
  const cat = getCategory(tool.category);

  return (
    <ToolShell slug={params.slug}>
      <ToolRenderer tool={tool} accent={cat?.color} />
    </ToolShell>
  );
}
