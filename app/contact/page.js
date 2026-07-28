import Link from "next/link";
import PageBody from "@/components/PageBody";
import ContactForm from "@/components/ContactForm";
import { getPage, fill } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";
import { site, ui } from "@/lib/site";

const SLUG = "contact";

export const metadata = pageMetadata(SLUG, "/contact/");

export default function Contact() {
  const page = getPage(SLUG);

  return (
    <div className="container page-prose">
      <div className="breadcrumb">
        <Link href="/">{ui("toolPage.breadcrumbHome", "Home")}</Link> › {page.metaTitle || page.title}
      </div>

      <h1>{fill(page.title)}</h1>

      <PageBody page={page} />

      <div className="form-card">
        <h2>{page.formHeading ? fill(page.formHeading) : "Send us a message"}</h2>
        <ContactForm
          accessKey={site.contactFormKey}
          email={site.contactEmail}
          siteName={site.name}
          labels={page.formLabels}
        />
      </div>

      {page.afterForm?.length > 0 && (
        <div className="after-form">
          {page.afterForm.map((section, i) => (
            <section key={i}>
              {section.heading && <h2>{fill(section.heading)}</h2>}
              {section.paragraphs?.map((para, j) => (
                <p key={j}>{fill(para)}</p>
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
