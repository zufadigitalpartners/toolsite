import { defineConfig } from "tinacms";

// Tina Cloud credentials come from env vars (see .env.example).
// The client ID is public; the read-only token must NEVER be committed.
const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.CF_PAGES_BRANCH || // set automatically by Cloudflare Pages
  "main";

const slugify = (values) =>
  (values?.name || "new-entry")
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
          { type: "string", name: "url", label: "Site URL", description: "Full origin, e.g. https://wearetool.com — used for sitemap, canonicals and Open Graph" },
          { type: "string", name: "contactEmail", label: "Contact email", description: "Shown on the contact page and used as the fallback if the form is not configured" },
          {
            type: "string",
            name: "contactFormKey",
            label: "Contact form access key (Web3Forms)",
            description: "Get a free key at web3forms.com by entering your email. Paste it here and the contact form starts delivering messages to your inbox. Leave empty to show a plain email link instead.",
          },
          {
            type: "string",
            name: "googleVerification",
            label: "Google Search Console verification code",
            description: "Only the content value of the google-site-verification meta tag, not the whole tag",
          },
          { type: "string", name: "homeTitle", label: "Homepage meta title suffix", description: "Browser tab title: \"SiteName | <this text>\"" },
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
        ],
      },

      // ---------- CATEGORIES ----------
      {
        name: "category",
        label: "Categories",
        path: "content/categories",
        format: "json",
        ui: {
          filename: { readonly: false, slugify },
        },
        fields: [
          { type: "string", name: "name", label: "Name", required: true },
          { type: "string", name: "emoji", label: "Emoji" },
          { type: "string", name: "color", label: "Color", ui: { component: "color" } },
          { type: "string", name: "desc", label: "Short description", ui: { component: "textarea" } },
          { type: "number", name: "order", label: "Sort order" },
          {
            type: "object",
            name: "seo",
            label: "Category page SEO content",
            fields: [
              { type: "string", name: "heading", label: "Section heading" },
              paragraphList("paragraphs", "Paragraphs", "300-400 words total; [links](/tools/slug/) allowed"),
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
          filename: { readonly: false, slugify },
        },
        fields: [
          { type: "string", name: "name", label: "Name", required: true },
          { type: "string", name: "emoji", label: "Emoji" },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: ["text", "generators", "calculators", "developer"],
            required: true,
          },
          { type: "boolean", name: "popular", label: "Show in Popular tools" },
          { type: "number", name: "order", label: "Sort order" },
          { type: "string", name: "short", label: "Short description (cards & search)", ui: { component: "textarea" } },
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

      // ---------- STATIC PAGES ----------
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "json",
        ui: {
          allowedActions: { create: false, delete: false },
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
            description: "On for legal pages. The page still works normally and stays linked in the footer, it is just kept out of search results and the sitemap.",
          },
          {
            type: "boolean",
            name: "showUpdated",
            label: "Show \"Last updated\" date",
          },
          paragraphList("intro", "Intro paragraphs", "Shown larger, before the first heading"),
          {
            type: "object",
            name: "sections",
            label: "Sections",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.heading || "section" }) },
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              paragraphList("paragraphs", "Paragraphs", "Supports {siteName}, {contactEmail}, **bold** and [links](/path/)"),
            ],
          },
          paragraphList("body", "Extra paragraphs (legacy)", "Older flat paragraph list, still rendered if used"),
          { type: "string", name: "formHeading", label: "Contact form heading (contact page only)" },
          {
            type: "object",
            name: "formLabels",
            label: "Contact form labels (contact page only)",
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
            label: "Sections below the contact form (contact page only)",
            list: true,
            ui: { itemProps: (item) => ({ label: item?.heading || "section" }) },
            fields: [
              { type: "string", name: "heading", label: "Heading" },
              paragraphList("paragraphs", "Paragraphs"),
            ],
          },
        ],
      },
    ],
  },
});
