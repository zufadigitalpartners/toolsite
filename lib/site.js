// ======================================================
//  SITE SETTINGS - edit in Tina (/admin) or content/settings/site.json
// ======================================================
import settings from "../content/settings/site.json";

export const site = {
  name: settings.name,
  tagline: settings.tagline,
  description: settings.description,
  url: settings.url,
  contactEmail: settings.contactEmail,
  contactFormKey: settings.contactFormKey || "",
  homeTitle: settings.homeTitle || "Free Online Tools",
  // Head section: verification meta tags, external scripts and inline code
  verificationTags: settings.verificationTags || [],
  headScripts: settings.headScripts || [],
  inlineHeadCode: settings.inlineHeadCode || "",
  ui: settings.ui || {},
  footer: settings.footer,
  hero: settings.hero,
  whyUs: settings.whyUs,
};

// UI label helper: ui("nav.categories", "Categories") - falls back to the
// default string if the setting is missing, and fills {token} replacements.
export function ui(path, fallback, tokens) {
  let value = path.split(".").reduce((obj, key) => obj?.[key], site.ui);
  if (typeof value !== "string" || value === "") value = fallback;
  if (tokens) {
    for (const [token, replacement] of Object.entries(tokens)) {
      value = value.split(`{${token}}`).join(String(replacement));
    }
  }
  return value;
}
