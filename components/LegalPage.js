import Link from "next/link";
import PageBody from "@/components/PageBody";
import { getPage, fill } from "@/lib/pages";
import { ui } from "@/lib/site";

// Shared shell for About, Privacy, Terms, Disclaimer and Cookie pages.
export default function LegalPage({ slug }) {
  const page = getPage(slug);
  if (!page) return null;

  return (
    <div className="container page-prose">
      <div className="breadcrumb">
        <Link href="/">{ui("toolPage.breadcrumbHome", "Home")}</Link> › {page.metaTitle || page.title}
      </div>

      <h1>{fill(page.title)}</h1>

      {page.showUpdated && (
        <p className="updated-line">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      )}

      <PageBody page={page} />
    </div>
  );
}
