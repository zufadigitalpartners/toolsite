import { site } from "@/lib/site";

export const metadata = { title: "Privacy Policy" };

export default function Privacy() {
  return (
    <div className="container page-prose">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      <p>
        <strong>Your files and text stay on your device.</strong> All tools on {site.name}
        {" "}process data locally in your browser. We do not upload, store, or have access
        to the content you work with.
      </p>
      <p>
        <strong>Analytics.</strong> We may use privacy-respecting analytics to understand
        which tools are popular and improve the site. This data is aggregated and does not
        identify you personally.
      </p>
      <p>
        <strong>Advertising.</strong> We may display ads (such as Google AdSense) to keep
        the tools free. Ad providers may use cookies as described in their own policies.
        You can control cookies through your browser settings.
      </p>
      <p>
        <strong>Contact.</strong> Questions about this policy? Reach us via the contact
        page.
      </p>
    </div>
  );
}
