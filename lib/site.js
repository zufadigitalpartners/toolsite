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
  // How many tools each footer column lists before "View all"
  footerToolLimit: Number(settings.footerToolLimit) > 0 ? Number(settings.footerToolLimit) : 5,
  // Head section: verification meta tags, external scripts and inline code
  verificationTags: settings.verificationTags || [],
  headScripts: settings.headScripts || [],
  inlineHeadCode: settings.inlineHeadCode || "",
  // Google Analytics measurement ID, e.g. G-XXXXXXXXXX. Empty turns it off.
  analyticsId: (settings.analyticsId || "").trim(),
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
    // {s} becomes an "s" unless the count is exactly one, so a CMS string can
    // read "{count} tool{s}" and produce "1 tool" rather than "1 tools".
    if (value.includes("{s}")) {
      value = value.split("{s}").join(Number(tokens.count) === 1 ? "" : "s");
    }
  }
  return value;
}
