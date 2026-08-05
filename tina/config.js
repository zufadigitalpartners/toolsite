import { defineConfig } from "tinacms";

// Tina Cloud credentials come from env vars (see .env.example).
// The client ID is public; the read-only token must NEVER be committed.
const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.CF_PAGES_BRANCH || // set automatically by Cloudflare Pages
  "main";

// The icon names available in lib/icons.js. Listed here rather than imported
// because lib/icons.js exports a React component and this config is evaluated
// by the Tina CLI, which does not compile JSX. Add an icon there, add its name
// here, and it appears in the dropdown.
const ICON_OPTIONS = [
  "activity", "align-left", "arrow-right", "badge-check", "banknote", "barcode",
  "binary", "braces", "briefcase", "cake", "calculator", "calendar-days",
  "camera", "case-upper", "chevron-down", "clock", "coins", "dices",
  "file-image", "fingerprint", "flame", "git-compare", "image", "image-down",
  "images", "key-round", "landmark", "link", "link-2", "list-reorder",
  "moon-star", "palette", "percent", "qr-code", "receipt", "ruler", "scales",
  "scaling", "scan-text", "search", "shield", "signature", "smartphone",
  "sparkles", "square", "table", "table-down", "target", "terminal", "text",
  "trending-up", "type", "user-x", "wheel",
];

const slugify = (values) =>
  (values?.name || values?.title || "new-entry")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Reusable list-of-paragraphs field (plain strings, markdown-style
// [links](/tools/slug/) and **bold** supported by components/RichText.js)
const paragraphList = (name, label, description) => ({
  type: "string",
  name,
  label,
  description,
  list: true,
  ui: { component: "textarea" },
});

const codeField = (name, label, description) => ({
  type: "string",
  name,
  label,
  description,
  ui: { component: "textarea" },
});

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "ac90b0e6-b455-4967-8517-30843f31d613",
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ---------- SITE SETTINGS (single document) ----------
      {
        name: "settings",
        label: "Site Settings",
        path: "content/settings",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "name", label: "Site name", required: true },
          { type: "string", name: "tagline", label: "Tagline" },
          { type: "string", name: "description", label: "Meta description", ui: { component: "textarea" } },
          { type: "string", name: "url", label: "Site URL", description: "e.g. https://wearetool.com" },
          { type: "string", name: "contactEmail", label: "Contact email", description: "Shown on the contact page" },
          {
            type: "string",
            name: "contactFormKey",
            label: "Contact form access key (Web3Forms)",
            description: "Free key from web3forms.com. Empty shows an email link instead.",
          },
          { type: "string", name: "homeTitle", label: "Homepage meta title suffix", description: "Browser tab title: \"SiteName | <this text>\"" },
          {
            type: "number",
            name: "footerToolLimit",
            label: "Tools listed per footer column",
            description: "The rest stay on the category page behind View all. Default 5.",
          },

          // ----- HEADER CODE -----
          {
            type: "object",
            name: "verificationTags",
            label: "Header code: verification meta tags",
            description: "Google, Bing, Pinterest and similar. Paste the two values, not the whole tag.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.name || "verification tag" }) },
            fields: [
              { type: "string", name: "name", label: "name=", description: "e.g. google-site-verification" },
              { type: "string", name: "content", label: "content=", description: "the long code the service gave you" },
            ],
          },
          {
            type: "object",
            name: "headScripts",
            label: "Header code: external scripts",
            description: "AdSense, analytics and similar. The URL only.",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.src || "script" }) },
            fields: [
              { type: "string", name: "src", label: "Script URL" },
              { type: "boolean", name: "async", label: "Load asynchronously (recommended)" },
              { type: "string", name: "crossorigin", label: "crossorigin value", description: "Usually \"anonymous\" for AdSense. Leave empty otherwise." },
            ],
          },
          {
            type: "string",
            name: "analyticsId",
            label: "Google Analytics measurement ID",
            description: "Just the ID, like G-XXXXXXXXXX. Empty turns analytics off.",
          },
          codeField(
            "inlineHeadCode",
            "Header code: inline JavaScript",
            "Code only, no <script> tags."
          ),

          {
            type: "object",
            name: "footer",
            label: "Footer",
            fields: [
              { type: "string", name: "line1", label: "Left line (after © year + site name)" },
              { type: "string", name: "line2", label: "Right line" },
            ],
          },
          {
            type: "object",
            name: "hero",
            label: "Homepage hero",
            fields: [
              { type: "string", name: "heading", label: "Heading (first line)" },
              { type: "string", name: "headingAccent", label: "Heading accent (second line)" },
              { type: "string", name: "subheading", label: "Subheading", ui: { component: "textarea" } },
              {
                type: "object",
                name: "stats",
                label: "Hero stats",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.label || "stat" }) },
                fields: [
                  { type: "string", name: "value", label: "Value", description: "{toolCount} is replaced with the live number of tools" },
                  { type: "string", name: "label", label: "Label" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "whyUs",
            label: "\"Why us\" feature boxes",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.title || "feature" }) },
            fields: [
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "desc", label: "Description", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "ui",
            label: "Interface text (buttons, headings, labels)",
            fields: [
              {
                type: "object",
                name: "nav",
                label: "Header & footer navigation",
                fields: [
                  { type: "string", name: "logoEmoji", label: "Logo emoji" },
                  { type: "string", name: "categories", label: "\"Categories\" menu label" },
                  { type: "string", name: "allTools", label: "\"All tools\" link label" },
                  { type: "string", name: "about", label: "\"About\" link label" },
                  { type: "string", name: "footerSiteHeading", label: "Footer \"Site\" column heading" },
                  { type: "string", name: "footerLegalHeading", label: "Footer \"Legal\" column heading" },
                  { type: "string", name: "footerViewAll", label: "Footer \"View all\" link" },
                ],
              },
              {
                type: "object",
                name: "search",
                label: "Search box",
                fields: [
                  { type: "string", name: "placeholder", label: "Placeholder text" },
                  { type: "string", name: "noResults", label: "No-results message", description: "{query} = what the visitor typed" },
                ],
              },
              {
                type: "object",
                name: "home",
                label: "Homepage sections",
                fields: [
                  { type: "string", name: "heroEyebrow", label: "Hero status line", description: "The small line above the headline, next to the pulsing dot" },
                  { type: "string", name: "popularEyebrow", label: "Eyebrow above Popular tools" },
                  { type: "string", name: "popularHeading", label: "\"Popular tools\" heading" },
                  { type: "string", name: "toolsGrowing", label: "Tool count text", description: "{count} = number of tools" },
                  { type: "string", name: "viewAll", label: "\"View all\" link", description: "{count} = number of tools" },
                  { type: "string", name: "toolsCount", label: "Category card count text", description: "{count} = number of tools" },
                ],
              },
              {
                type: "object",
                name: "toolPage",
                label: "Tool pages",
                fields: [
                  { type: "string", name: "subSuffix", label: "Line under tool title (after short description)" },
                  { type: "string", name: "breadcrumbHome", label: "Breadcrumb \"Home\" label" },
                  { type: "string", name: "howToHeading", label: "\"How to use\" heading" },
                  { type: "string", name: "whyHeading", label: "\"Why use our...\" heading", description: "{name} = tool name" },
                  { type: "string", name: "whoHeading", label: "\"Who is this tool for?\" heading" },
                  { type: "string", name: "faqHeading", label: "FAQ heading" },
                  { type: "string", name: "relatedHeading", label: "\"Related tools\" heading" },
                  { type: "string", name: "runsLocally", label: "Tool panel status text" },
                  { type: "string", name: "onThisPage", label: "\"On this page\" heading" },
                  { type: "string", name: "privacyHeading", label: "Privacy block heading" },
                  { type: "string", name: "privacyUploads", label: "Privacy: uploads label" },
                  { type: "string", name: "privacyServer", label: "Privacy: server calls label" },
                  { type: "string", name: "privacyAccount", label: "Privacy: account label" },
                  { type: "string", name: "privacyNotRequired", label: "Privacy: account value" },
                  { type: "string", name: "pairsWith", label: "\"Works well with\" strip label" },
                ],
              },
              {
                type: "object",
                name: "categoryPage",
                label: "Category pages",
                fields: [
                  { type: "string", name: "toolsPill", label: "Tool count pill", description: "{count} = number of tools" },
                  { type: "string", name: "moreHeading", label: "\"More categories\" heading" },
                ],
              },
            ],
          },
        ],
      },

      // ---------- CATEGORIES ----------
      {
        name: "category",
        label: "Categories",
        path: "content/categories",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify,
            description: "This becomes the page address: /category/<filename>/",
          },
          router: ({ document }) => `/category/${document._sys.filename}/`,
          defaultItem: () => ({
            name: "New category",
            icon: "square",
            emoji: "📦",
            // Any hex works. Keep it strong enough to read as an icon stroke
            // and as the rule under the section heading, which is the only
            // two places a category colour is ever used.
            color: "#1D5FC4",
            desc: "One line describing what belongs in this category.",
            order: 99,
            seo: {
              heading: "About these tools",
              paragraphs: [
                "300 to 400 words about this group of tools, written for someone searching for the category rather than a single tool. Links like [word counter](/tools/word-counter/) are allowed and help.",
              ],
            },
          }),
        },
        fields: [
          { type: "string", name: "name", label: "Name", required: true },
          {
            type: "string",
            name: "icon",
            label: "Icon",
            options: ICON_OPTIONS,
            description:
              "The line icon shown for this category. Leave it empty and the emoji below is used instead.",
          },
          { type: "string", name: "emoji", label: "Emoji (fallback)" },
          { type: "string", name: "color", label: "Color", ui: { component: "color" } },
          { type: "string", name: "desc", label: "Short description", ui: { component: "textarea" } },
          { type: "number", name: "order", label: "Sort order" },
          {
            type: "object",
            name: "seo",
            label: "Category page SEO content",
            fields: [
              { type: "string", name: "heading", label: "Section heading" },
              paragraphList("paragraphs", "Paragraphs", "300-400 words. [links](/path/) allowed."),
            ],
          },
        ],
      },

      // ---------- TOOLS ----------
      {
        name: "tool",
        label: "Tools",
        path: "content/tools",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify,
            description: "This becomes the page address: /tools/<filename>/",
          },
          router: ({ document }) => `/tools/${document._sys.filename}/`,
          // A brand new tool arrives as a WORKING tool, not a blank form.
          // Press Create, save, and there is a real page you can visit; then
          // replace the parts you want. Starting from something that runs is
          // far easier than starting from an empty box and guessing the
          // contract.
          defaultItem: () => ({
            name: "New tool",
            icon: "square",
            emoji: "🔧",
            popular: false,
            order: 99,
            short: "One line describing what this tool does. Shown on cards and in search.",
            code: {
              html: [
                '<div class="row">',
                '  <label><span>Your text</span>',
                '    <textarea id="in" placeholder="Type or paste here"></textarea>',
                "  </label>",
                "</div>",
                '<div class="btn-row">',
                '  <button class="btn-primary" id="go">Run</button>',
                '  <button id="copy">Copy result</button>',
                "</div>",
                '<div class="out" id="out">The result appears here</div>',
                '<div class="stats">',
                '  <div class="stat"><span class="num" id="n1">0</span><span class="label">Characters</span></div>',
                '  <div class="stat"><span class="num" id="n2">0</span><span class="label">Words</span></div>',
                "</div>",
              ].join("\n"),
              css: "/* Optional. The site's own styles are already applied,\n   so most tools need nothing here. */",
              js: [
                "// Runs inside a sandbox. No internet, no storage, nothing leaves the device.",
                "// Helpers you get for free:  WT.copy(text)   WT.resize()   WT.config.apiKey",
                "(function () {",
                "  var $ = function (id) { return document.getElementById(id); };",
                "",
                "  function run() {",
                "    var text = $('in').value;",
                "    $('out').textContent = text ? text.toUpperCase() : 'The result appears here';",
                "    $('n1').textContent = text.length;",
                "    $('n2').textContent = text.trim() ? text.trim().split(/\\s+/).length : 0;",
                "    if (window.WT) WT.resize();   // tell the page the tool changed height",
                "  }",
                "",
                "  $('in').addEventListener('input', run);",
                "  $('go').addEventListener('click', run);",
                "  $('copy').addEventListener('click', function () {",
                "    WT.copy($('out').textContent);",
                "    var b = this; b.textContent = 'Copied';",
                "    setTimeout(function () { b.textContent = 'Copy result'; }, 1400);",
                "  });",
                "  run();",
                "})();",
              ].join("\n"),
              needsNetwork: false,
              apiKey: "",
              apiBaseUrl: "",
            },
            seo: {
              metaTitle: "New Tool: What It Does",
              metaDescription:
                "One or two sentences describing the tool, containing the phrase people would search for. Around 150 characters.",
              keywords: ["main keyword", "second keyword"],
            },
            content: {
              intro: [
                "Explain what the tool does in the first sentence, using the words someone would type into Google. Then say how it works and who it is for. Aim for 120 to 180 words.",
              ],
              howto: [
                "First step, written as an instruction.",
                "Second step.",
                "Third step.",
              ],
              benefits: [
                "Why this one is worth using: what it does that others do not, and why running in the browser matters. 100 to 200 words.",
              ],
              useCases: [
                "Who actually needs this and in what situation. Naming real jobs and real problems is what brings in search traffic. 100 to 200 words.",
              ],
              faqs: [
                { q: "Is my data uploaded anywhere?", a: "No. Everything happens in your browser and nothing is sent to a server." },
                { q: "Add five or six more questions people really ask.", a: "Answer each one properly, in two or three sentences." },
              ],
            },
          }),
        },
        fields: [
          { type: "string", name: "name", label: "Tool name", required: true },
          {
            type: "string",
            name: "icon",
            label: "Icon",
            options: ICON_OPTIONS,
            description:
              "The line icon shown on cards, in search and beside the title. Leave it empty and the emoji below is used instead, so a new tool is never iconless.",
          },
          { type: "string", name: "emoji", label: "Emoji (fallback)" },
          {
            type: "reference",
            name: "category",
            label: "Category",
            collections: ["category"],
          },
          { type: "boolean", name: "popular", label: "Show in Popular tools" },
          { type: "number", name: "order", label: "Sort order" },
          {
            // A plain string list, not a reference list. Tina's reference
            // field has no list UI, and asking for one breaks the GraphQL
            // codegen and therefore the whole build.
            type: "string",
            name: "related",
            label: "Related tools (optional)",
            list: true,
            description: "Leave empty and the site works these out on its own. To force a pairing, add tool filenames like image-resizer, one per item.",
          },
          { type: "string", name: "short", label: "Short description", description: "Used on cards and in search", ui: { component: "textarea" } },

          // ----- THE TOOL ITSELF -----
          {
            type: "object",
            name: "code",
            label: "Tool code",
            description: "Leave empty for the nine original tools, which are built in",
            fields: [
              codeField("html", "HTML", "The interface. No <style> or <script> tags."),
              codeField("css", "CSS", "Optional. Rules only, no <style> tags."),
              codeField("js", "JavaScript", "The logic. Code only, no <script> tags."),
              {
                type: "boolean",
                name: "needsNetwork",
                label: "This tool calls an API",
                description:
                  "Leave OFF for anything that can be done on the device, which is most tools. Turning it on loosens the sandbox so the tool can reach the internet, and it means this tool no longer honours the 'nothing leaves your device' promise.",
              },
              {
                type: "string",
                name: "apiName",
                label: "Which API",
                description:
                  "The service this tool depends on, for example 'exchangerate.host' or 'Open-Meteo'. Recorded so you can see at a glance which tools would break if a service disappears.",
              },
              {
                type: "string",
                name: "apiDocs",
                label: "API docs link",
                description: "Where to look when it stops working. Paste the documentation URL.",
              },
              {
                type: "string",
                name: "apiKey",
                label: "API key",
                description:
                  "Read in the tool as WT.config.apiKey. WARNING: this is published in the page source and anyone can read it, so only ever use a key that is restricted to your own domain, and never a secret or billing key.",
              },
              {
                type: "string",
                name: "apiBaseUrl",
                label: "API base URL",
                description: "Optional. Read it as WT.config.apiBaseUrl",
              },
              {
                type: "string",
                name: "apiFreeTier",
                label: "Free limits",
                description:
                  "What the free plan allows, for example '1000 requests a day, no card needed'. Worth writing down now rather than rediscovering it when the tool starts failing.",
              },
            ],
          },

          {
            type: "object",
            name: "seo",
            label: "SEO meta",
            fields: [
              { type: "string", name: "metaTitle", label: "Meta title" },
              { type: "string", name: "metaDescription", label: "Meta description", ui: { component: "textarea" } },
              { type: "string", name: "keywords", label: "Keywords", list: true },
            ],
          },

          {
            type: "object",
            name: "content",
            label: "Page content",
            description: "The article below the tool",
            fields: [
              paragraphList("intro", "Intro paragraphs", "Primary keyword in the first sentence"),
              paragraphList("howto", "How-to steps", "One step per item"),
              paragraphList("benefits", "\"Why use our tool\" paragraphs"),
              paragraphList("useCases", "\"Who is this tool for\" paragraphs"),
              {
                type: "object",
                name: "faqs",
                label: "FAQs",
                list: true,
                ui: { itemProps: (item) => ({ label: item?.q || "question" }) },
                fields: [
                  { type: "string", name: "q", label: "Question" },
                  { type: "string", name: "a", label: "Answer", ui: { component: "textarea" } },
                ],
              },
            ],
          },
        ],
      },

      // ---------- PAGES ----------
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify,
            description: "This becomes the page address: /<filename>/",
          },
          router: ({ document }) => `/${document._sys.filename}/`,
          defaultItem: () => ({
            title: "New page",
            metaTitle: "New page",
            metaDescription: "One or two sentences describing this page, around 150 characters.",
            noindex: false,
            showUpdated: false,
            showContactForm: false,
            footerGroup: "site",
            footerOrder: 99,
            intro: ["An opening paragraph, shown slightly larger than the rest."],
            sections: [
              {
                heading: "First heading",
                paragraphs: [
                  "Body text. Links like [our tools](/tools/) and **bold** both work here.",
                ],
              },
            ],
          }),
        },
        fields: [
          { type: "string", name: "title", label: "Page heading", description: "{siteName} is replaced with the site name" },
          { type: "string", name: "metaTitle", label: "Meta title (also the footer link text)" },
          { type: "string", name: "metaDescription", label: "Meta description", ui: { component: "textarea" } },
          { type: "string", name: "subtitle", label: "Subtitle (all tools page only)", ui: { component: "textarea" } },
          {
            type: "boolean",
            name: "noindex",
            label: "Hide from Google",
            description: "Page still works and stays in the footer, just kept out of Google.",
          },
          { type: "boolean", name: "showUpdated", label: "Show \"Last updated\" date" },
          { type: "boolean", name: "showContactForm", label: "Show the contact form on this page" },
          {
            type: "string",
            name: "footerGroup",
            label: "Footer column",
            options: [
              { value: "site", label: "Site column" },
              { value: "legal", label: "Legal column" },
              { value: "none", label: "Do not show in the footer" },
            ],
          },
          { type: "number", name: "footerOrder", label: "Position in the footer column" },
          paragraphList("intro", "Intro paragraphs", "Shown larger, before the first heading"),
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.heading || "section" }) },
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              paragraphList("paragraphs", "Paragraphs", "Supports {siteName}, **bold** and [links](/path/)"),
            ],
          },
          paragraphList("body", "Extra paragraphs (legacy)", "Older format, still rendered"),
          { type: "string", name: "formHeading", label: "Contact form heading" },
          {
            type: "object",
            name: "formLabels",
            label: "Contact form labels",
            fields: [
              { type: "string", name: "name", label: "Name field label" },
              { type: "string", name: "email", label: "Email field label" },
              { type: "string", name: "subject", label: "Subject field label" },
              { type: "string", name: "message", label: "Message field label" },
              { type: "string", name: "send", label: "Send button" },
              { type: "string", name: "sending", label: "Sending button text" },
              { type: "string", name: "success", label: "Success message", ui: { component: "textarea" } },
              { type: "string", name: "error", label: "Error message", ui: { component: "textarea" } },
              { type: "string", name: "subjectOptions", label: "Subject dropdown options", list: true },
            ],
          },
          {
            type: "object",
            name: "afterForm",
            label: "Sections below the contact form",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.heading || "section" }) },
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              paragraphList("paragraphs", "Paragraphs"),
            ],
          },
        ],
      },

      // ---------- BLOG ----------
      {
        name: "post",
        label: "Blog posts",
        path: "content/posts",
        format: "json",
        ui: {
          filename: {
            readonly: false,
            slugify,
            description: "This becomes the address: /blog/<filename>/",
          },
          router: ({ document }) => `/blog/${document._sys.filename}/`,
          defaultItem: () => ({
            title: "New article",
            excerpt: "One or two sentences describing what the reader gets. This shows on the blog index and in Google.",
            date: new Date().toISOString().slice(0, 10),
            // readMinutes left out on purpose: empty means it is counted
            // from the finished text, which is right more often than a guess.
            cover: "",
            coverAlt: "",
            outbound: { label: "", url: "", note: "" },
            relatedTools: [],
            sections: [
              {
                heading: "First heading",
                paragraphs: [
                  "Open with the problem, not with an introduction to the problem. Links like [image compressor](/tools/image-compressor/) belong inside sentences, and **bold** works.",
                ],
              },
            ],
            faqs: [],
            seo: {
              metaTitle: "New article",
              metaDescription: "Around 150 characters, containing the phrase somebody would search for.",
              keywords: [],
            },
          }),
        },
        fields: [
          { type: "string", name: "title", label: "Title", required: true },
          {
            type: "string",
            name: "excerpt",
            label: "Summary",
            ui: { component: "textarea" },
            description: "Shown on the blog index and used as the description if the SEO one is empty.",
          },
          {
            type: "string",
            name: "date",
            label: "Published date",
            description: "Write it as 2026-08-05. Used for sorting and shown on the article.",
          },
          { type: "number", name: "readMinutes", label: "Reading time in minutes", description: "Leave empty and it is worked out from the word count." },
          {
            type: "image",
            name: "cover",
            label: "Featured image",
            description:
              "Optional. Leave it empty and a cover is drawn from the title, which means an article is never published without one. Around 1200 by 630 works best if you do upload.",
          },
          { type: "string", name: "coverAlt", label: "Featured image description", description: "What the image shows, for screen readers and for Google." },
          {
            type: "reference",
            name: "category",
            label: "Related category",
            collections: ["category"],
            description: "Colours the article and decides which tools appear beside it.",
          },
          {
            type: "string",
            name: "relatedTools",
            label: "Tools to show beside the article",
            list: true,
            description: "Tool filenames like image-compressor, one per item. Leave empty and the category's tools are used.",
          },
          {
            type: "object",
            name: "outbound",
            label: "Outbound link",
            description: "One link to a genuinely authoritative source. It signals to Google that the article is researched rather than spun.",
            fields: [
              { type: "string", name: "label", label: "Link text" },
              { type: "string", name: "url", label: "URL" },
              { type: "string", name: "note", label: "Why it is worth reading", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "sections",
            label: "Article sections",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.heading || "section" }) },
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              paragraphList("paragraphs", "Paragraphs", "[links](/tools/slug/) and **bold** work"),
              {
                type: "string",
                name: "bullets",
                label: "Bullet list (optional)",
                list: true,
                ui: { component: "textarea" },
              },
              {
                type: "string",
                name: "callout",
                label: "Highlighted note (optional)",
                ui: { component: "textarea" },
                description: "Pulled out in a box. One per section at most, or they stop standing out.",
              },
            ],
          },
          {
            type: "object",
            name: "faqs",
            label: "FAQs",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.q || "question" }) },
            fields: [
              { type: "string", name: "q", label: "Question" },
              { type: "string", name: "a", label: "Answer", ui: { component: "textarea" } },
            ],
          },
          {
            type: "object",
            name: "seo",
            label: "SEO meta",
            fields: [
              { type: "string", name: "metaTitle", label: "Meta title" },
              { type: "string", name: "metaDescription", label: "Meta description", ui: { component: "textarea" } },
              { type: "string", name: "keywords", label: "Keywords", list: true },
            ],
          },
        ],
      },
    ],
  },
});
