import RichText from "@/components/RichText";
import { fill } from "@/lib/pages";

// Renders a content page from content/pages/<slug>.json.
// Handles the intro + sections shape and the older flat body list.
export default function PageBody({ page }) {
  return (
    <>
      {page.intro?.map((para, i) => (
        <RichText key={`i${i}`} text={fill(para)} className="lead" />
      ))}

      {page.body?.map((para, i) => (
        <RichText key={`b${i}`} text={fill(para)} />
      ))}

      {page.sections?.map((section, i) => (
        <section key={`s${i}`}>
          {section.heading && <h2>{fill(section.heading)}</h2>}
          {section.paragraphs?.map((para, j) => (
            <RichText key={j} text={fill(para)} />
          ))}
        </section>
      ))}
    </>
  );
}
