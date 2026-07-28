import Link from "next/link";
import PageBody from "@/components/PageBody";
import RichText from "@/components/RichText";
import ContactForm from "@/components/ContactForm";
import { getPage, routablePages, fill } from "@/lib/pages";
import { pageMetadata } from "@/lib/seo";
import { site, ui } from "@/lib/site";

// Every file in content/pages/ becomes a page at /<filename>/, so a new
// page created in TinaCMS is published on the next build with no code
// change. Pages that back a custom route are skipped in lib/pages.js.
export function generateStaticParams() {
  return routablePages().map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }) {
  return pageMetadata(params.slug, `/${params.slug}/`);
}

export default function ContentPage({ params }) {
  const page = getPage(params.slug);
  if (!page) return null;

  return (
    <div className="container page-prose">
      <div className="breadcrumb">
        <Link href="/">{ui("toolPage.breadcrumbHome", "Home")}</Link> ›{" "}
        {page.metaTitle || page.title}
      </div>

      <h1>{fill(page.title)}</h1>

      {page.showUpdated && (
        <p className="updated-line">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      <PageBody page={page} />

      {page.showContactForm && (
        <div className="form-card">
          <h2>{page.formHeading ? fill(page.formHeading) : "Send us a message"}</h2>
          <ContactForm
            accessKey={site.contactFormKey}
            email={site.contactEmail}
            siteName={site.name}
            labels={page.formLabels}
          />
        </div>
      )}

      {page.afterForm?.length > 0 && (
        <div className="after-form">
          {page.afterForm.map((section, i) => (
            <section key={i}>
              {section.heading && <h2>{fill(section.heading)}</h2>}
              {section.paragraphs?.map((para, j) => (
                <RichText key={j} text={fill(para)} />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
