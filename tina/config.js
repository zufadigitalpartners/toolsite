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
          { type: "string", name: "contactEmail", label: "Contact email" },
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
          { type: "string", name: "metaTitle", label: "Meta title" },
          paragraphList("body", "Paragraphs", "Supports {siteName}, {contactEmail}, **bold** and [links](/path/)"),
        ],
      },
    ],
  },
});
