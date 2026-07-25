import { site } from "@/lib/site";

export const metadata = { title: "About" };

export default function About() {
  return (
    <div className="container page-prose">
      <h1>About {site.name}</h1>
      <p>
        {site.name} is a growing collection of free online tools for everyday tasks —
        counting words, converting text, generating passwords, and much more. New tools
        are added regularly.
      </p>
      <p>
        Every tool runs entirely inside your browser. That means your text and files are
        never uploaded to any server: your data stays on your device, and the tools stay
        fast even on slow connections.
      </p>
      <p>
        There are no accounts, no paywalls and no usage limits. Open a tool, get your
        work done, and move on.
      </p>
    </div>
  );
}
