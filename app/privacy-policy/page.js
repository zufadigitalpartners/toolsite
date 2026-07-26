import RichText from "@/components/RichText";
import { getPage, fill } from "@/lib/pages";

const page = getPage("privacy-policy");

export const metadata = { title: page.metaTitle };

export default function Privacy() {
  return (
    <div className="container page-prose">
      <h1>{fill(page.title)}</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      {page.body.map((para, i) => (
        <RichText key={i} text={fill(para)} />
      ))}
    </div>
  );
}
