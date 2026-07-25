import { site } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function Contact() {
  return (
    <div className="container page-prose">
      <h1>Contact</h1>
      <p>
        Have a question, found a bug, or want to suggest a new tool for {site.name}? We
        would love to hear from you.
      </p>
      <p>
        Email us at: <strong>hello@example.com</strong>
      </p>
      <p>
        We read every message and usually reply within a few days. Tool suggestions are
        especially welcome — many of our tools started as user requests.
      </p>
    </div>
  );
}
