// ======================================================
//  SITE SETTINGS — edit in Tina (/admin) or content/settings/site.json
// ======================================================
import settings from "../content/settings/site.json";

export const site = {
  name: settings.name,
  tagline: settings.tagline,
  description: settings.description,
  url: settings.url,
  contactEmail: settings.contactEmail,
  footer: settings.footer,
  hero: settings.hero,
  whyUs: settings.whyUs,
};
