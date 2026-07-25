// ======================================================
//  TOOLS REGISTRY
//  Naya tool add karna ho to:
//  1) Yahan ek entry add karo
//  2) components/tools/<Naam>.js banao
//  3) app/tools/<slug>/page.js banao
//  Homepage, search, category pages, footer — sab khud update ho jayega
// ======================================================

export const categories = [
  {
    id: "text",
    name: "Text Tools",
    emoji: "✍️",
    color: "#2563eb",
    desc: "Count, convert and clean up text — fast, free and private.",
  },
  {
    id: "generators",
    name: "Generators",
    emoji: "⚡",
    color: "#d97706",
    desc: "Generate passwords, QR codes, random numbers and more in one click.",
  },
  {
    id: "calculators",
    name: "Calculators",
    emoji: "🧮",
    color: "#059669",
    desc: "Everyday calculators for age, dates and more — instant answers.",
  },
  {
    id: "developer",
    name: "Developer Tools",
    emoji: "👨‍💻",
    color: "#7c3aed",
    desc: "Format, encode and debug — handy utilities for developers.",
  },
];

export const tools = [
  // ---------- TEXT ----------
  {
    slug: "word-counter",
    name: "Word Counter",
    category: "text",
    emoji: "🔢",
    popular: true,
    short: "Count words, characters, sentences and reading time instantly.",
    howto: [
      "Type or paste your text into the box above.",
      "Counts update instantly as you type — nothing to click.",
      "Use the reading time to plan essays, posts or speeches.",
    ],
    faqs: [
      { q: "Is my text uploaded anywhere?", a: "No. Everything is counted inside your browser. Your text never leaves your device." },
      { q: "How is reading time calculated?", a: "We use an average reading speed of 200 words per minute, a common standard for adult readers." },
      { q: "Is there a word limit?", a: "No limit — paste an entire book if you want. It all runs locally, so it stays fast." },
    ],
  },
  {
    slug: "case-converter",
    name: "Case Converter",
    category: "text",
    emoji: "🔠",
    popular: true,
    short: "Convert text to UPPERCASE, lowercase, Title Case or Sentence case.",
    howto: [
      "Paste your text into the box.",
      "Click the case style you want — the text converts instantly.",
      "Press “Copy” to copy the result to your clipboard.",
    ],
    faqs: [
      { q: "What is Title Case?", a: "Title Case capitalizes the first letter of every word — commonly used for headings and titles." },
      { q: "Does this work with other languages?", a: "Yes, it works with any language that has upper and lower case letters." },
      { q: "Is my text stored?", a: "No. The conversion happens in your browser and nothing is saved or sent anywhere." },
    ],
  },

  // ---------- GENERATORS ----------
  {
    slug: "password-generator",
    name: "Password Generator",
    category: "generators",
    emoji: "🔐",
    popular: true,
    short: "Create strong, random passwords with one click.",
    howto: [
      "Choose a length with the slider (12+ recommended).",
      "Tick the character types you want to include.",
      "Click “Generate password”, then “Copy” to use it.",
    ],
    faqs: [
      { q: "Are these passwords safe to use?", a: "Yes. Passwords are generated on your device using your browser's cryptographic random generator, and are never sent or stored anywhere." },
      { q: "What makes a password strong?", a: "Length matters most. A 16+ character password mixing letters, numbers and symbols is very hard to crack." },
      { q: "Can the same password appear twice?", a: "It is astronomically unlikely. Each password is generated from secure random values." },
    ],
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    category: "generators",
    emoji: "🔳",
    popular: true,
    short: "Turn any link or text into a QR code and download it as an image.",
    howto: [
      "Type or paste a link, phone number or any text.",
      "The QR code appears instantly as you type.",
      "Click “Download PNG” to save it for printing or sharing.",
    ],
    faqs: [
      { q: "Do these QR codes expire?", a: "No. The QR code simply contains your text or link, so it works forever — nothing is hosted on our servers." },
      { q: "Can I use the QR code commercially?", a: "Yes. The generated image is yours to use anywhere — menus, posters, business cards, packaging." },
      { q: "Is my link sent to a server?", a: "No. The QR code is generated entirely in your browser." },
    ],
  },
  {
    slug: "random-number-generator",
    name: "Random Number Generator",
    category: "generators",
    emoji: "🎲",
    popular: false,
    short: "Generate random numbers in any range — for draws, games and picks.",
    howto: [
      "Set the minimum and maximum values.",
      "Choose how many numbers you need.",
      "Click “Generate” — copy the results with one click.",
    ],
    faqs: [
      { q: "Are the numbers truly random?", a: "They are generated with your browser's cryptographic random generator, which is far stronger than a basic random function." },
      { q: "Can I avoid duplicate numbers?", a: "Yes — untick “Allow duplicates” to get unique numbers, perfect for lucky draws." },
      { q: "What can I use this for?", a: "Prize draws, picking numbers, games, sampling, classroom activities — anything that needs a fair random pick." },
    ],
  },

  // ---------- CALCULATORS ----------
  {
    slug: "age-calculator",
    name: "Age Calculator",
    category: "calculators",
    emoji: "🎂",
    popular: true,
    short: "Find your exact age in years, months and days from your birth date.",
    howto: [
      "Select your date of birth.",
      "Your exact age appears instantly — years, months and days.",
      "See total days lived and days left until your next birthday.",
    ],
    faqs: [
      { q: "How accurate is the calculation?", a: "It is exact to the day, correctly handling leap years and different month lengths." },
      { q: "Can I calculate age at a specific date?", a: "Currently it calculates age as of today. An age-at-date option is coming soon." },
      { q: "Is my birth date stored?", a: "No. The calculation happens in your browser and nothing is saved or sent anywhere." },
    ],
  },
  {
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    category: "calculators",
    emoji: "📅",
    popular: false,
    short: "Count the days, weeks and months between any two dates.",
    howto: [
      "Pick a start date and an end date.",
      "The difference appears instantly — days, weeks, months and years.",
      "Great for deadlines, anniversaries, project timelines and countdowns.",
    ],
    faqs: [
      { q: "Does it include both dates?", a: "It counts the full time between the two dates. Leap years and month lengths are handled exactly." },
      { q: "Can I count down to a future date?", a: "Yes — set the end date in the future to see exactly how many days are left." },
      { q: "Is anything stored?", a: "No. All calculations happen in your browser." },
    ],
  },

  // ---------- DEVELOPER ----------
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    category: "developer",
    emoji: "🧩",
    popular: true,
    short: "Format, minify and validate JSON with clear error messages.",
    howto: [
      "Paste your JSON into the box.",
      "Click “Format” for pretty output or “Minify” for compact output.",
      "If the JSON is invalid, the error message tells you what's wrong.",
    ],
    faqs: [
      { q: "Is my JSON uploaded anywhere?", a: "No. Formatting happens entirely in your browser — safe even for sensitive data." },
      { q: "What indentation is used?", a: "Format uses 2 spaces, the most common standard in modern codebases." },
      { q: "Can it handle large files?", a: "Yes — since everything runs locally, even large JSON documents format quickly." },
    ],
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    category: "developer",
    emoji: "🔣",
    popular: false,
    short: "Encode text to Base64 or decode Base64 back to text.",
    howto: [
      "Choose Encode or Decode mode.",
      "Paste your text — the result appears instantly.",
      "Click “Copy” to grab the output.",
    ],
    faqs: [
      { q: "Does this support Unicode and emoji?", a: "Yes — full UTF-8 support, so special characters and emoji encode and decode correctly." },
      { q: "Is Base64 encryption?", a: "No. Base64 is just an encoding format for representing data as text — it is not secure and anyone can decode it." },
      { q: "Is my data sent to a server?", a: "No. Encoding and decoding happen entirely in your browser." },
    ],
  },
];

export function getTool(slug) {
  return tools.find((t) => t.slug === slug);
}

export function getCategory(id) {
  return categories.find((c) => c.id === id);
}

export function toolsByCategory(id) {
  return tools.filter((t) => t.category === id);
}

export function popularTools() {
  return tools.filter((t) => t.popular);
}

export function relatedTools(slug, count = 4) {
  const tool = getTool(slug);
  if (!tool) return [];
  const same = tools.filter((t) => t.slug !== slug && t.category === tool.category);
  const others = tools.filter((t) => t.slug !== slug && t.category !== tool.category);
  return [...same, ...others].slice(0, count);
}
