import RichText from "@/components/RichText";
import { getPage, fill } from "@/lib/pages";

const page = getPage("about");

export const metadata = { title: page.metaTitle };

export default function About() {
  return (
    <div className="container page-prose">
      <h1>{fill(page.title)}</h1>
      {page.body.map((para, i) => (
        <RichText key={i} text={fill(para)} />
      ))}
    </div>
  );
}
