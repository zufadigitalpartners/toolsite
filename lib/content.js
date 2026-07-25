// ======================================================
//  SEO CONTENT — long-form content for tool & category pages
//
//  TEMPLATE for every new tool (add an entry keyed by slug):
//  {
//    metaTitle:        "Primary Keyword — Benefit | modifier",
//    metaDescription:  "150-160 chars, primary keyword near the start",
//    keywords:         ["primary keyword", "long-tail variants"],
//    intro:            ["100-150 words, primary keyword in first sentence"],
//    howto:            ["5-6 detailed steps"],
//    benefits:         ["'Why use our X' — 150-200 words"],
//    useCases:         ["'Who is this for' — 150-200 words, long-tail audiences"],
//    faqs:             [{ q, a } x 5-7, 200-300 words total],
//  }
//
//  Inline internal links use markdown syntax: [anchor text](/tools/slug/)
//  They are rendered as <Link> by components/RichText.js.
//  Aim for 3-5 contextual links per tool, woven into paragraphs.
// ======================================================

export const toolContent = {
  // ================= WORD COUNTER =================
  "word-counter": {
    metaTitle: "Word Counter — Count Words & Characters Online Free",
    metaDescription:
      "Free online word counter. Count words, characters, sentences, paragraphs and reading time instantly. No signup, no uploads — works in your browser.",
    keywords: [
      "word counter", "character counter", "count words online",
      "word count tool", "reading time calculator", "sentence counter",
    ],
    intro: [
      "This free online word counter counts words, characters, sentences and paragraphs the moment you start typing — no button to press, no page reload, no signup. Paste an essay, a blog draft, a tweet or an entire manuscript and you instantly see exactly how long it is, along with an estimated reading time based on average reading speed. Because everything runs directly in your browser, your text is never uploaded to a server, which makes it safe to check confidential documents, unpublished articles or client work. Whether you are trimming a college essay to a strict word limit, keeping a meta description under 160 characters, or checking that a LinkedIn post fits the cap, this word count tool gives you a precise answer in real time.",
    ],
    howto: [
      "Type directly into the text box, or paste your text with Ctrl+V (Cmd+V on Mac). The counters update instantly with every keystroke.",
      "Read the word count first — this is the number most essays, articles and assignments are measured by.",
      "Check the character count (with and without spaces) when you are writing for platforms with character limits, such as X/Twitter, SMS or meta descriptions.",
      "Use the sentence and paragraph counts to judge structure — long paragraphs with many sentences are a signal to break your text up.",
      "Use the estimated reading time to plan speeches, presentations and blog posts; it is based on an average adult reading speed of 200 words per minute.",
      "Edit your text right in the box and watch the numbers change until you hit your target length.",
    ],
    benefits: [
      "Most word count tools make you click a button, watch an ad, or upload your document to someone else's server. Ours does none of that. The counts update live as you type, so trimming a 1,050-word essay down to a 1,000-word limit becomes a simple loop: delete, glance at the counter, done. Everything is computed locally in your browser, which means it works at full speed even on huge documents and your text never leaves your device — important when you are working on unpublished content, legal text or client material.",
      "You also get more than a single number. Words, characters with and without spaces, sentences, paragraphs and reading time are all visible at once, so one tool covers essays, ad copy, subtitles and social posts. And when you finish editing, related utilities are one click away — fix inconsistent capitalization with the [case converter](/tools/case-converter/), or turn your published article's link into a scannable code with the [QR code generator](/tools/qr-code-generator/).",
    ],
    useCases: [
      "Students and academics rely on word counts daily: admissions essays, coursework with strict limits, abstracts capped at 250 words, dissertations measured in tens of thousands. This tool shows live progress toward any limit, and teachers can use it to check assignment lengths in seconds — or pick a random student for a presentation with the [random number generator](/tools/random-number-generator/).",
      "Freelance writers and content marketers are often paid or briefed per word, so an accurate count is money. Bloggers use reading time to keep posts skimmable, SEO specialists keep title tags and meta descriptions inside character limits, and social media managers check captions against platform caps before posting. Novelists tracking daily output, translators quoting per source word, and job seekers keeping a cover letter tight all get the same instant answer. If you are also juggling deadlines for all that writing, the [date difference calculator](/tools/date-difference-calculator/) tells you exactly how many days you have left.",
    ],
    faqs: [
      { q: "Is my text uploaded anywhere?", a: "No. Everything is counted inside your browser using JavaScript. Your text never leaves your device, so it is safe to paste confidential or unpublished work." },
      { q: "How is reading time calculated?", a: "We divide your word count by 200 words per minute, a widely used average adult reading speed. Slides and speeches are usually delivered slower, around 130 words per minute, so add a margin for spoken content." },
      { q: "Is there a word or character limit?", a: "No limit — you can paste an entire book. Because counting happens locally, even very large documents are processed instantly." },
      { q: "Does it count characters with and without spaces?", a: "Yes, both. Character-with-spaces is what most platforms (like X/Twitter) measure, while some translation and typesetting work is billed on characters without spaces." },
      { q: "How are words counted — do hyphenated words count as one?", a: "Anything separated by spaces or line breaks counts as a word, so 'well-known' counts as one word. This matches how most word processors count." },
      { q: "Can I use this on my phone?", a: "Yes. The counter is fully responsive and works in any modern mobile browser — handy for checking captions and messages on the go." },
      { q: "Why does my count differ slightly from Microsoft Word?", a: "Different tools treat symbols, numbers and stray punctuation slightly differently. Differences are typically a handful of words on very long texts; for limits that strict, always follow the counter your submission system uses." },
    ],
  },

  // ================= CASE CONVERTER =================
  "case-converter": {
    metaTitle: "Case Converter — UPPERCASE, lowercase & Title Case Online",
    metaDescription:
      "Free online case converter. Change text to UPPERCASE, lowercase, Title Case or Sentence case instantly. No signup — runs entirely in your browser.",
    keywords: [
      "case converter", "uppercase to lowercase", "title case converter",
      "sentence case", "capitalization tool", "change text case online",
    ],
    intro: [
      "This free case converter changes any text to UPPERCASE, lowercase, Title Case or Sentence case in a single click. Instead of retyping a heading that was pasted in all caps, or manually capitalizing every word of a title, paste the text once and switch between case styles instantly. It is the fastest way to fix text copied from PDFs, emails written with Caps Lock on, or headings that need to follow a style guide. The conversion happens entirely in your browser — nothing is uploaded, stored or logged — and it works with any language that distinguishes upper and lower case letters. Writers, students, developers and social media managers use this capitalization tool to clean up text in seconds rather than minutes.",
    ],
    howto: [
      "Paste or type your text into the input box — anything from a single heading to several pages.",
      "Click UPPERCASE to capitalize every letter, ideal for acronyms, labels and emphasis.",
      "Click lowercase to strip all capitals — the quickest fix for text typed with Caps Lock on.",
      "Click Title Case to capitalize the first letter of every word, the standard for headlines and titles.",
      "Click Sentence case to capitalize only the first letter of each sentence, the normal style for body text.",
      "Press Copy to send the converted text to your clipboard, then paste it wherever you need it.",
    ],
    benefits: [
      "Retyping text just to fix its capitalization is one of the most tedious jobs in writing. Our case converter turns it into one click, and because the text converts instantly you can try every style and compare before copying. There are no ads interrupting the flow, no signup wall, and no server round-trip — your text stays on your device, so it is safe for contracts, credentials in config files, or unpublished drafts.",
      "It also pairs naturally with the rest of your editing workflow. After converting a heading, check your draft's length with the [word counter](/tools/word-counter/) to make sure it fits your brief. Developers cleaning up string constants often follow up in the [JSON formatter](/tools/json-formatter/) to pretty-print the file they are editing, or use the [Base64 encoder](/tools/base64-encoder-decoder/) when the cleaned text needs to be embedded in a data URI or API payload. One browser tab covers the whole clean-up job.",
    ],
    useCases: [
      "Students and academic writers use Sentence case and Title Case constantly — essay titles, headings formatted to APA or MLA style, and reference lists all have strict capitalization rules. Instead of second-guessing every word, convert the line and move on. Copy editors and journalists fixing wire copy or reader submissions save even more time.",
      "Social media managers and marketers switch between styles daily: Title Case for YouTube titles and email subject lines, UPPERCASE for promo banners, lowercase for a casual brand voice. Virtual assistants and data-entry teams standardizing spreadsheets of names and addresses can normalize hundreds of rows a day with paste-convert-copy. Developers use the converter to tidy UI strings, error messages and documentation headings before committing. Anyone who has ever typed a whole paragraph before noticing Caps Lock was on — which is everyone — gets their minutes back with one click.",
    ],
    faqs: [
      { q: "What is Title Case?", a: "Title Case capitalizes the first letter of every word — the common convention for headlines, book titles and section headings. Style guides differ on small words like 'and' or 'of'; our converter capitalizes every word for consistency, so lower small words manually if your guide requires it." },
      { q: "What is Sentence case?", a: "Sentence case capitalizes only the first letter of each sentence, exactly as normal prose is written. It is the standard for body text and increasingly popular for headings in modern web design." },
      { q: "Does this work with other languages?", a: "Yes. It works with any script that has upper and lower case letters — including accented characters like é, ü and ñ in European languages." },
      { q: "Is my text stored or sent anywhere?", a: "No. The conversion runs entirely in your browser with JavaScript. Nothing is uploaded, logged or saved." },
      { q: "Is there a length limit?", a: "No practical limit — you can convert entire documents at once. Everything runs locally, so even long texts convert instantly." },
      { q: "Will it break my formatting?", a: "Line breaks and spacing are preserved — only the letters' case changes. Bold and italic styling from word processors is not carried through plain text, so apply visual formatting after converting." },
    ],
  },

  // ================= PASSWORD GENERATOR =================
  "password-generator": {
    metaTitle: "Password Generator — Create Strong Random Passwords Free",
    metaDescription:
      "Free strong password generator. Create secure, random passwords with letters, numbers and symbols — generated locally in your browser, never sent anywhere.",
    keywords: [
      "password generator", "strong password generator", "random password",
      "secure password creator", "password maker online",
    ],
    intro: [
      "This free password generator creates strong, random passwords in one click, using your browser's built-in cryptographic random number generator. Choose a length, tick the character sets you want — uppercase, lowercase, numbers, symbols — and copy a password that is practically impossible to guess or brute-force. Unlike passwords invented by humans, which lean on names, birthdays and keyboard patterns, a randomly generated password has no structure for attackers to exploit. And unlike many online generators, this one never sends anything over the network: the password is generated on your device and exists nowhere else. With data breaches exposing billions of reused credentials every year, a unique random password for every account is the single most effective upgrade you can make to your personal security.",
    ],
    howto: [
      "Set the password length with the slider. Twelve characters is a sensible minimum; 16 or more is recommended for important accounts.",
      "Tick the character types to include — uppercase letters, lowercase letters, numbers and symbols. More variety means a stronger password.",
      "Click Generate password. A new random password appears instantly.",
      "Not happy with it? Click Generate again — you can create as many as you like, free.",
      "Click Copy to place the password on your clipboard, then paste it into the signup form or your password manager.",
      "Store it in a password manager rather than a text file or sticky note — the generated password appears nowhere else and cannot be recovered if lost.",
    ],
    benefits: [
      "The biggest reason to use our generator is where the password is made: on your device, never on a server. Passwords are produced with the Web Crypto API — the same cryptographically secure randomness used by encryption software — and are never transmitted, logged or stored. A password only you have ever seen is fundamentally safer than one that passed through someone else's infrastructure.",
      "It is also built for real-world use. Some websites reject symbols or cap length, so you can tune the character sets and length to fit any site's rules and regenerate instantly until one is accepted. Need a numeric PIN instead? The [random number generator](/tools/random-number-generator/) does that with the same secure randomness. Sharing your Wi-Fi with guests? Put the new password in the [QR code generator](/tools/qr-code-generator/) so visitors scan instead of typing 20 characters. And remember that encoding is not encryption — if you are curious what Base64 actually does to text, see our [Base64 encoder/decoder](/tools/base64-encoder-decoder/).",
    ],
    useCases: [
      "Everyone with online accounts needs this tool, but some groups need it most. Remote workers and freelancers juggle dozens of client logins — CMS dashboards, hosting panels, invoicing apps — and reusing one password across them puts every client at risk. Generating a unique password per service, stored in a password manager, closes that hole in minutes.",
      "Small business owners and IT admins use it when creating accounts for new employees, setting router and database credentials, or rotating passwords after staff changes. Developers reach for it to fill in API secrets, test-user credentials and one-off tokens during development. Students securing their first email, banking and university accounts can start with good habits instead of 'name123'. And families setting up a password manager together can generate a strong master-worthy password for each member in seconds. If a password protects money, work or identity, it deserves to be random.",
    ],
    faqs: [
      { q: "Are these passwords safe to use?", a: "Yes. They are generated on your device with your browser's cryptographic random generator (Web Crypto API) and are never sent, logged or stored anywhere. Nobody — including us — ever sees them." },
      { q: "What makes a password strong?", a: "Length first, variety second. Every extra character multiplies the number of possible passwords, so a random 16-character password with mixed character sets would take modern hardware an astronomically long time to brute-force." },
      { q: "How long should my password be?", a: "At least 12 characters for everyday accounts and 16+ for email, banking and anything holding payment details. Your email deserves the strongest password of all, since it can reset most other accounts." },
      { q: "Can the same password be generated twice?", a: "It is astronomically unlikely. A 16-character mixed password has more possible combinations than there are grains of sand on Earth — by many orders of magnitude." },
      { q: "Should I use a different password for every site?", a: "Yes. Password reuse is how one leaked database becomes ten hacked accounts, via 'credential stuffing' attacks. Generate a unique password per site and let a password manager remember them." },
      { q: "How do I remember a random password?", a: "You don't — a password manager does. You only memorize one strong master password; the manager stores the rest and fills them in for you." },
      { q: "Why do some sites reject generated passwords?", a: "Some sites ban certain symbols or cap the length. Adjust the options — for example, turn off symbols or shorten the password — and generate again until it fits their rules." },
    ],
  },

  // ================= QR CODE GENERATOR =================
  "qr-code-generator": {
    metaTitle: "QR Code Generator — Create Free QR Codes Online",
    metaDescription:
      "Free QR code generator. Turn any link, text or phone number into a QR code and download it as a PNG. No signup, no expiry — generated in your browser.",
    keywords: [
      "qr code generator", "free qr code", "create qr code online",
      "qr code maker", "link to qr code", "download qr code png",
    ],
    intro: [
      "This free QR code generator turns any link, text or phone number into a scannable QR code instantly — and lets you download it as a PNG image ready for print or screen. There is no signup, no watermark and, crucially, no expiry: the code you generate contains your data directly, so it will keep working forever without depending on our servers. Everything is generated locally in your browser, meaning the link or text you encode is never uploaded anywhere. From restaurant menus and event posters to business cards, product packaging and Wi-Fi sharing, QR codes are the fastest bridge between the physical world and your online content, and this QR code maker produces one in the time it takes to paste a URL.",
    ],
    howto: [
      "Type or paste what you want to encode — a website URL, plain text, a phone number or any other string.",
      "Watch the QR code render instantly as you type; there is no generate button to press.",
      "Test it before publishing: point your phone's camera at the code on screen and confirm it opens the right destination.",
      "Click Download PNG to save the image to your device.",
      "Place the PNG in your design — poster, menu, slide, business card or packaging. Keep it at least 2 cm wide in print and leave white space around it.",
      "Print a test page and scan it from a realistic distance before mass-producing anything.",
    ],
    benefits: [
      "Many QR services quietly route your code through a tracking redirect and disable it when a free trial ends — every poster you printed goes dead. Ours encodes your destination directly into the image, so the code is permanent, private and entirely yours. No account, no watermark, no monthly fee, and commercial use is welcome.",
      "Generation happens in your browser, which means confidential links — an unlisted video, an internal document, a pre-launch page — never touch a server. The live preview updates as you type so you can fix typos before downloading, and the PNG output stays crisp on flyers and packaging. It pairs well with other tools here: generate a strong Wi-Fi key with the [password generator](/tools/password-generator/) and share it as a scannable code, keep the caption next to your printed code tight using the [word counter](/tools/word-counter/), or run a giveaway where scanning leads to a draw powered by the [random number generator](/tools/random-number-generator/).",
    ],
    useCases: [
      "Small business owners are the classic users: a café linking its menu, a salon linking its booking page, a market stall linking to Instagram. Restaurants replace laminated menus with a code on the table; retailers put codes on receipts pointing to review pages. Event organizers print codes on tickets and posters that open schedules, maps or registration forms.",
      "Freelancers and job seekers add a QR code to business cards, CVs and portfolios so a paper introduction becomes a website visit. Teachers share worksheet links with a code on the projector instead of dictating URLs. Wedding planners link RSVP forms from invitations. Landlords and Airbnb hosts print a code that opens the Wi-Fi details or house guide. Nonprofits put donation links on flyers. Anywhere a human would otherwise have to type a URL by hand, a QR code removes the friction — and this generator makes one in seconds, free.",
    ],
    faqs: [
      { q: "Do these QR codes expire?", a: "No. The code contains your text or link directly — nothing is hosted on our servers — so it keeps working as long as your destination exists. There are no scan limits or trial periods." },
      { q: "Can I use the QR code commercially?", a: "Yes. The generated image is yours to use anywhere — menus, posters, business cards, packaging, adverts — with no attribution or license fee." },
      { q: "Is my link or text sent to a server?", a: "No. The QR code is generated entirely in your browser, so even confidential links stay on your device." },
      { q: "Can I track how many people scan my code?", a: "Not directly — a direct-encoded code has no tracking layer, which is why it never expires. If you need scan counts, encode a link with UTM parameters and read the results in your website analytics." },
      { q: "What size should I print a QR code?", a: "At least 2 x 2 cm for close-range scanning, and roughly 1/10 of the scanning distance for posters — a code meant to be scanned from 1 metre should be about 10 cm wide. Always leave a white margin around it." },
      { q: "Why won't my QR code scan?", a: "The usual causes are printing it too small, too little contrast, or a missing white margin. Dark code on a light background scans best. Print a test page and scan it from a realistic distance." },
      { q: "What can I put in a QR code besides a link?", a: "Any text: phone numbers, email addresses, plain messages, Wi-Fi credentials or contact details. Anything a phone can read as text can live in a QR code." },
    ],
  },

  // ================= RANDOM NUMBER GENERATOR =================
  "random-number-generator": {
    metaTitle: "Random Number Generator — Pick Numbers in Any Range Free",
    metaDescription:
      "Free random number generator. Generate one or many random numbers in any range, with or without duplicates — ideal for draws, games, sampling and picks.",
    keywords: [
      "random number generator", "random number picker", "number generator online",
      "lucky draw number picker", "rng", "random number between",
    ],
    intro: [
      "This free random number generator produces one or many random numbers in any range you choose — instantly, fairly and without installing anything. Set a minimum and maximum, say how many numbers you need, decide whether duplicates are allowed, and click Generate. Behind the scenes it uses your browser's cryptographically secure random source, the same quality of randomness used in encryption, which makes it far more trustworthy than spreadsheet formulas or 'pick a number in your head'. Whether you are running a giveaway, drawing raffle winners, assigning teams, sampling survey responses or settling who does the dishes, this number picker gives every value in the range an equal chance — and it does it all locally in your browser.",
    ],
    howto: [
      "Enter the minimum and maximum values of your range — for example 1 to 100, or 1 to the number of raffle tickets sold.",
      "Choose how many numbers you want to generate at once.",
      "Decide whether duplicates are allowed. Untick 'Allow duplicates' for prize draws so no ticket can win twice.",
      "Click Generate — your numbers appear instantly.",
      "Click Copy to grab the results for a spreadsheet, an announcement post or your records.",
      "For a public draw, consider screen-recording the generation so participants can see the result was produced live.",
    ],
    benefits: [
      "Fairness is the whole point of a random draw, and fairness depends on the quality of the randomness. This generator uses the browser's cryptographic random source rather than a basic pseudo-random formula, so results are statistically unbiased and every number in your range has an exactly equal chance. The no-duplicates mode does the bookkeeping a manual draw gets wrong — once a number is drawn, it cannot come up again.",
      "It is also fast for real workflows: generate a hundred sample IDs in one click and copy them straight into a spreadsheet. Because everything runs locally, it works offline once loaded and nothing about your draw is sent anywhere. If your giveaway needs supporting tools, they are a click away — announce winners with a scannable link from the [QR code generator](/tools/qr-code-generator/), count down to the draw date with the [date difference calculator](/tools/date-difference-calculator/), or create credentials for a prize account with the [password generator](/tools/password-generator/).",
    ],
    useCases: [
      "Social media managers and small businesses use it for giveaway draws: number the entrants, generate one winner, screenshot the result. Raffle organizers at schools, clubs and charities draw ticket numbers without pulling paper from a hat. Teachers pick a random student for a question, assign presentation order, or split a class into random groups — with duplicates off, everyone gets picked exactly once.",
      "Researchers and analysts use random numbers for sampling — selecting which 50 of 800 survey responses to audit — and for randomizing participants into test groups. Game nights use it as a giant dice roller when the real dice are missing; sports coaches use it to draw fixtures and knockout brackets. Developers generate quick test IDs and mock data values during development. Any decision that should be visibly fair — who wins, who goes first, which item gets audited — is a use case for this tool.",
    ],
    faqs: [
      { q: "Are the numbers truly random?", a: "They come from your browser's cryptographically secure random generator, which is dramatically stronger than basic random functions. For draws, games, sampling and picks, the results are statistically unbiased and fair." },
      { q: "Can I avoid duplicate numbers?", a: "Yes — untick 'Allow duplicates' and every generated number will be unique, which is exactly what you want for raffles and prize draws where a ticket must not win twice." },
      { q: "Is there a limit to the range?", a: "You can use any practical range, from 1-2 up to millions. Min and max are both included in the possible results." },
      { q: "Can anyone predict or influence the results?", a: "No. Cryptographic randomness is unpredictable by design, and because generation happens on your device, there is no server for anyone to tamper with." },
      { q: "Is this suitable for a public giveaway draw?", a: "Yes. Assign each entrant a number, generate the winner, and screenshot or screen-record the draw for transparency. Many small businesses run their contest draws exactly this way." },
      { q: "Can I use it as a dice roller or coin flip?", a: "Absolutely. Set the range to 1-6 for a die (generate two numbers for a pair of dice) or 1-2 for a coin flip — heads on 1, tails on 2." },
    ],
  },

  // ================= AGE CALCULATOR =================
  "age-calculator": {
    metaTitle: "Age Calculator — Exact Age in Years, Months & Days",
    metaDescription:
      "Free age calculator. Enter your date of birth and instantly see your exact age in years, months and days, total days lived and days to your next birthday.",
    keywords: [
      "age calculator", "calculate age from date of birth", "how old am I",
      "exact age in years months days", "birthday calculator", "date of birth calculator",
    ],
    intro: [
      "This free age calculator tells you your exact age in years, months and days from your date of birth — instantly and precisely. Working out an exact age by hand is harder than it looks: months have different lengths, leap years add a day every four years (usually), and 'how old am I in days?' is not something anyone wants to do on paper. Enter a birth date and this calculator handles all of it, showing your age broken down properly, the total number of days you have been alive, and how many days remain until your next birthday. It runs entirely in your browser, so the date you enter is never stored or sent anywhere. Use it for official forms, milestone planning, eligibility checks or plain curiosity.",
    ],
    howto: [
      "Select your date of birth using the date picker — day, month and year.",
      "Your exact age appears instantly, broken down into years, months and days.",
      "Check the total days lived figure for milestone tracking — 10,000 days is a popular one to celebrate.",
      "See the countdown to your next birthday, correctly accounting for leap years.",
      "Change the date freely to calculate someone else's age — a family member, a historical figure, or a pet's birth date.",
      "Nothing is saved between visits, so every calculation starts fresh and private.",
    ],
    benefits: [
      "The value of an age calculator is precision. 'About 34' is easy; '34 years, 7 months and 12 days' requires correctly handling months of 28-31 days and leap year rules — which this tool does exactly. That precision matters for immigration and visa forms that ask for age at a specific cutoff, for school enrollment deadlines, for pension and insurance paperwork, and for sports categories where eligibility can hinge on a single day.",
      "It is also instant and private: the calculation runs locally, your birth date never leaves the device, and there is no form to submit or account to create. The extra outputs earn their place too — total days lived turns birthdays into more interesting milestones, and the next-birthday countdown helps you plan ahead. Speaking of planning: work out the gap between any two dates with the [date difference calculator](/tools/date-difference-calculator/), put a scannable RSVP link on party invitations with the [QR code generator](/tools/qr-code-generator/), and keep the birthday speech the right length with the [word counter](/tools/word-counter/).",
    ],
    useCases: [
      "Parents use it constantly — for school admission forms that ask a child's age in years and months at a cutoff date, for tracking a baby's age in months, and for settling 'exactly how much older is she than her brother?' HR and admin staff verify ages for contracts, insurance and retirement paperwork, where an exact figure is required rather than a guess.",
      "Sports coaches and clubs check age-category eligibility, where being days over a cutoff moves a player up a division. Genealogists and history enthusiasts calculate ages of ancestors at marriage, emigration or other events from record dates. Doctors' receptionists and clinics compute patient ages from dates of birth all day long. And plenty of people use it for fun: finding the day they turn 10,000 days old, comparing exact ages with friends, or counting down to a milestone birthday party.",
    ],
    faqs: [
      { q: "How accurate is the calculation?", a: "Exact to the day. It correctly handles leap years, different month lengths and month boundaries — the details that make manual age arithmetic error-prone." },
      { q: "How does the calculator handle leap years?", a: "Leap year days are counted properly in both your age and the next-birthday countdown. Born on 29 February? Your birthday is counted in the next calendar year where the date exists." },
      { q: "Can I calculate age at a specific date, not just today?", a: "Currently it calculates age as of today. For age between two arbitrary dates, use our date difference calculator, which measures the exact gap between any two dates." },
      { q: "Is my birth date stored anywhere?", a: "No. The calculation happens in your browser and nothing is saved, logged or transmitted. Reloading the page clears everything." },
      { q: "Why does the answer show months and days, not just years?", a: "Because a year is not a fixed number of days, an exact age needs three parts: full years, then full months, then remaining days. That is the format official forms usually expect." },
      { q: "Can I calculate a pet's age or an ancestor's age?", a: "Yes — enter any birth date. For pets you will get their real calendar age (the 'multiply by 7' dog years rule is folklore, not arithmetic)." },
    ],
  },

  // ================= DATE DIFFERENCE CALCULATOR =================
  "date-difference-calculator": {
    metaTitle: "Date Difference Calculator — Days Between Two Dates",
    metaDescription:
      "Free date difference calculator. Count the exact days, weeks, months and years between any two dates — deadlines, countdowns, anniversaries and durations.",
    keywords: [
      "date difference calculator", "days between dates", "date duration calculator",
      "countdown to date", "how many days until", "weeks between two dates",
    ],
    intro: [
      "This free date difference calculator counts the exact number of days between two dates — and breaks the gap down into weeks, months and years. Pick a start date and an end date and the answer appears instantly, with leap years and uneven month lengths handled correctly. Counting dates by hand is notoriously easy to get wrong: February is short, months alternate between 30 and 31 days, and a February-to-March count that ignores a leap year is off by a day. Whether you need a countdown to a wedding, the number of working weeks left before a project deadline, the length of a rental period, or how many days old an invoice is, this days-between-dates calculator gives you a precise answer in seconds, entirely in your browser.",
    ],
    howto: [
      "Pick the start date — the earlier of your two dates.",
      "Pick the end date. For a countdown, set this to the future event you are counting toward.",
      "Read the result instantly: total days, plus the equivalent in weeks, months and years.",
      "Use total days for precise measures like invoice ageing or visa day-limits, and months/years for durations like tenancy or employment length.",
      "Swap the dates to measure a different span — every change recalculates instantly.",
      "Nothing is stored; the dates you enter stay on your device.",
    ],
    benefits: [
      "The point of this calculator is trust in the number. Leap years, 28/30/31-day months and month-boundary edge cases are exactly where mental arithmetic and quick spreadsheet formulas slip by a day — and a one-day error matters when a contract notice period, visa limit or payment deadline depends on it. This tool applies real calendar rules to give you the exact figure, presented as days, weeks, months and years at once so you can quote whichever unit the situation needs.",
      "It is also flexible in direction: past-to-today for durations, today-to-future for countdowns. Project managers can count days to launch, then keep an eye on drafting time with the [word counter](/tools/word-counter/) as content deadlines approach. Planning an event on the target date? Print a scannable RSVP link with the [QR code generator](/tools/qr-code-generator/). And if the span you care about starts at someone's birth, the [age calculator](/tools/age-calculator/) formats it properly as an age.",
    ],
    useCases: [
      "Project managers and freelancers live by date math: days until the deliverable, working weeks in a sprint, how long a milestone slipped. Freelancers also use it for invoice ageing — exactly how many days a payment is overdue — and for quoting realistic timelines. HR teams calculate lengths of service, probation periods and notice periods, where the difference between 89 and 90 days can change someone's entitlements.",
      "Travelers count trip lengths and visa day-limits, where overstaying by one miscounted day is an expensive mistake. Couples count down to weddings or measure exactly how long they have been together. Landlords and tenants compute rental periods and deposit deadlines. Students count study days left before an exam and plan revision accordingly. Fitness enthusiasts measure training streaks. Anyone with a deadline, an anniversary or a countdown has a reason to know exactly how many days lie between two points on the calendar.",
    ],
    faqs: [
      { q: "Does the count include both dates?", a: "It measures the full span between your two dates — the same convention calendars and date libraries use. If your context needs both endpoints counted (some legal deadlines do), add one day to the result." },
      { q: "Are leap years handled correctly?", a: "Yes. The calculator uses real calendar arithmetic, so 29 February and every month-length quirk are accounted for exactly." },
      { q: "Can I count down to a future date?", a: "Yes — set the end date in the future and you get an instant countdown: days until the wedding, launch, exam or holiday." },
      { q: "Can it show working days only?", a: "It currently counts calendar days. As a rule of thumb, multiply calendar days by 5/7 for a quick working-day estimate, and remember public holidays vary by country." },
      { q: "Why do 'months between dates' answers vary between tools?", a: "Because months have different lengths, tools can define 'a month apart' slightly differently near month ends. Our calculator uses consistent calendar rules; for exact comparisons, rely on the total-days figure, which is unambiguous." },
      { q: "Is anything I enter stored?", a: "No. All calculations happen in your browser — nothing is uploaded, saved or logged." },
    ],
  },

  // ================= JSON FORMATTER =================
  "json-formatter": {
    metaTitle: "JSON Formatter — Format, Validate & Minify JSON Online",
    metaDescription:
      "Free JSON formatter and validator. Pretty-print, minify and validate JSON with clear error messages — runs locally in your browser, safe for sensitive data.",
    keywords: [
      "json formatter", "json validator", "json beautifier", "pretty print json",
      "minify json", "json parser online", "format json online",
    ],
    intro: [
      "This free JSON formatter pretty-prints, validates and minifies JSON instantly in your browser. Paste a wall of unreadable single-line JSON from an API response or a log file, click Format, and get cleanly indented, readable output; click Minify to strip the whitespace back out for production payloads. If the JSON is invalid, you get a clear error message that tells you what went wrong — a missing comma, an unquoted key, a trailing bracket — instead of a silent failure. Everything runs locally: your JSON is never uploaded, which matters when the payload contains API keys, customer records or internal data. For developers, testers and anyone who touches APIs, a fast JSON validator is one of the most-used tools of the working day.",
    ],
    howto: [
      "Paste your JSON into the input box — an API response, a config file, a log entry, anything.",
      "Click Format to pretty-print it with 2-space indentation, the standard in modern codebases.",
      "Click Minify to compress it to a single line — ideal for production payloads and query strings.",
      "If the JSON is invalid, read the error message: it identifies the problem so you can fix the exact spot.",
      "Common culprits: a trailing comma after the last item, single quotes instead of double quotes, unquoted keys, or comments (JSON allows none of these).",
      "Copy the result and paste it back into your code, API client or config file.",
    ],
    benefits: [
      "The reason to use this formatter over pasting into random websites is privacy: formatting happens entirely in your browser, so API responses containing tokens, personal data or unreleased features never leave your machine. That makes it safe for exactly the payloads developers most often need to inspect. It is also fast on large documents — there is no upload round-trip, so even big API dumps format instantly.",
      "Validation doubles as debugging. When a config file refuses to load or an API rejects your request body, pasting the JSON here pinpoints the syntax error in seconds — usually a trailing comma or single quotes. Formatting and minifying are one click each, so you can go readable-to-compact and back without touching your editor. When your debugging session widens, the neighbours help: decode a JWT segment or API payload with the [Base64 encoder/decoder](/tools/base64-encoder-decoder/), normalize key names with the [case converter](/tools/case-converter/), or fill test fixtures with values from the [random number generator](/tools/random-number-generator/).",
    ],
    useCases: [
      "Backend and frontend developers are the obvious audience — inspecting API responses, debugging webhook payloads, editing package.json or tsconfig files, and formatting fixtures for tests. QA engineers and testers validate request bodies before filing bug reports, and paste failing responses here to see structure at a glance. DevOps engineers untangle JSON logs and cloud configuration exports.",
      "But JSON is no longer only a developer format. Data analysts receive JSON exports from analytics platforms and need them readable before conversion. Technical writers format example payloads for API documentation. Students learning web development use the validator to understand why their first fetch call fails. No-code builders wiring up Zapier, Make or Airtable automations hit raw JSON at every webhook step. Anyone who has ever been emailed a one-line JSON blob and asked to 'take a look' can turn it into something readable here in one click.",
    ],
    faqs: [
      { q: "Is my JSON uploaded anywhere?", a: "No. Formatting, validation and minification all run locally in your browser — nothing is sent to any server. It is safe even for payloads containing keys, tokens or customer data." },
      { q: "What indentation does Format use?", a: "Two spaces — the dominant convention in modern JavaScript and web projects. Minify removes all insignificant whitespace for the smallest output." },
      { q: "Why is my JSON invalid?", a: "The most common causes: a trailing comma after the last element, single quotes instead of double quotes, unquoted property names, or // comments. Standard JSON allows none of these — the error message points you to the problem." },
      { q: "Can it handle large files?", a: "Yes. Because everything runs locally with the browser's native parser, even multi-megabyte JSON documents format quickly." },
      { q: "What is the difference between formatting and minifying?", a: "Formatting adds line breaks and indentation for human reading; minifying strips them for machines. The data is identical — only whitespace changes, so it is always safe to go back and forth." },
      { q: "Does it change my data or key order?", a: "Values are preserved exactly; keys keep the order they appear in your input. Only whitespace is added or removed." },
      { q: "Can I validate JSON5 or JSONC (JSON with comments)?", a: "This tool validates standard JSON, which is what APIs and most config parsers require. Remove comments and trailing commas first — or treat the error messages as a checklist of what to strip." },
    ],
  },

  // ================= BASE64 ENCODER / DECODER =================
  "base64-encoder-decoder": {
    metaTitle: "Base64 Encode & Decode Online — Free Base64 Converter",
    metaDescription:
      "Free Base64 encoder and decoder. Convert text to Base64 or decode Base64 to text instantly, with full UTF-8 support — runs entirely in your browser.",
    keywords: [
      "base64 encode", "base64 decode", "base64 converter", "base64 to text",
      "text to base64", "base64 decoder online", "utf-8 base64",
    ],
    intro: [
      "This free Base64 encoder and decoder converts text to Base64 and back instantly, with full UTF-8 support — so accented characters, non-Latin scripts and emoji survive the round trip intact. Base64 is everywhere in modern computing: it is how email attachments travel, how images get embedded in CSS and HTML as data URIs, how HTTP Basic Auth credentials are transmitted, and how JSON Web Tokens (JWTs) package their payloads. When you need to encode a string for an API, or decode a Base64 blob you found in a config file, a log line or a token, this tool does it in your browser with nothing uploaded or logged. Choose Encode or Decode, paste your text, and the result appears as you type.",
    ],
    howto: [
      "Choose the mode: Encode to convert plain text into Base64, or Decode to turn Base64 back into readable text.",
      "Paste or type your input — the result appears instantly, no button needed.",
      "Encoding example: 'Hello' becomes 'SGVsbG8=' — the trailing = signs are padding and are part of the output.",
      "Decoding: paste the Base64 string exactly, including any = padding at the end.",
      "If decoding fails, check for missing characters, line breaks inserted by email clients, or URL-safe variants that use - and _ instead of + and /.",
      "Click Copy to grab the output for your code, API request or config file.",
    ],
    benefits: [
      "The main reason to use this converter is that it runs entirely locally. Base64 strings frequently contain things you should not paste into arbitrary websites — API credentials, auth headers, token payloads, configuration secrets. Here, encoding and decoding happen in your browser and nothing ever leaves your device. Full UTF-8 handling is the second win: many quick converters mangle emoji and non-English characters because they ignore character encoding; this one gets 'héllo 👋' right in both directions.",
      "It is also honest about what Base64 is: an encoding, not encryption. Anyone can decode it, so it must never be used to protect secrets — for real credentials, generate something strong with the [password generator](/tools/password-generator/). In daily developer work it slots in alongside the [JSON formatter](/tools/json-formatter/) — decode a JWT segment here, then pretty-print the JSON payload there — and alongside the [QR code generator](/tools/qr-code-generator/) when you want to move an encoded snippet from screen to phone.",
    ],
    useCases: [
      "Developers use Base64 constantly: building Basic Auth headers, embedding small images as data URIs in CSS, inspecting the payload of a JWT during authentication debugging, and encoding binary-ish content for JSON APIs that only accept text. DevOps engineers meet it in Kubernetes secrets, which are Base64-encoded by design, and in CI/CD environment variables and certificate bundles.",
      "QA engineers decode tokens and webhook payloads while reproducing bugs. Security analysts and IT support decode Base64 strings found in email headers, logs and suspicious scripts to see what they actually contain. Students learning web development use it to understand how data URIs and HTTP authentication actually work under the hood. Email administrators troubleshoot MIME-encoded message parts. Even no-code builders occasionally hit an API that demands Base64-encoded input — paste, encode, done. If your work ever touches an API, a token or a config file, you will need this converter sooner rather than later.",
    ],
    faqs: [
      { q: "Is Base64 encryption?", a: "No — and this matters. Base64 is a reversible encoding that anyone can decode; it provides zero secrecy. Never use it to protect passwords or sensitive data. Use real encryption for security." },
      { q: "Does this support Unicode and emoji?", a: "Yes — full UTF-8 support in both directions, so accented characters, non-Latin scripts and emoji encode and decode correctly. Many simpler tools get this wrong." },
      { q: "Is my data sent to a server?", a: "No. Encoding and decoding happen entirely in your browser, which makes it safe for tokens, credentials and internal data." },
      { q: "What are the = signs at the end of Base64?", a: "Padding. Base64 works in blocks of 3 input bytes, and = fills the final block when input length is not a multiple of 3. They are part of the string — keep them when copying." },
      { q: "Why does Base64 make my data bigger?", a: "Base64 represents every 3 bytes as 4 text characters, so output is about 33% larger than input. That is the price of making arbitrary data safe to embed in text-only formats." },
      { q: "Why won't my Base64 string decode?", a: "Usual causes: characters missing from the start or end, line breaks added by an email client, or a URL-safe variant that replaces + and / with - and _. Fix those and decode again." },
      { q: "What is Base64 actually used for?", a: "Email attachments (MIME), data URIs for inline images, HTTP Basic Auth, JWT tokens, Kubernetes secrets and any place binary data must travel through text-only channels." },
    ],
  },
};

// ======================================================
//  CATEGORY PAGE CONTENT — 300-400 words each
//  Same inline-link syntax as tool content.
// ======================================================

export const categoryContent = {
  text: {
    heading: "Free online text tools — clean up, count and convert",
    paragraphs: [
      "Text is the raw material of almost everything we do online — essays, emails, captions, product descriptions, documentation — and almost all of it needs measuring or tidying before it ships. Our text tools handle those chores instantly, right in your browser. Nothing you type or paste is ever uploaded: every tool on this page runs locally on your device, which makes them safe for confidential drafts, client work and unpublished writing.",
      "The [word counter](/tools/word-counter/) is the workhorse. It counts words, characters (with and without spaces), sentences and paragraphs live as you type, and estimates reading time — essential for students trimming an essay to a limit, freelancers billing per word, and marketers keeping meta descriptions under 160 characters. Because the counts update in real time, editing to a target length becomes a tight feedback loop instead of guesswork.",
      "The [case converter](/tools/case-converter/) fixes capitalization in one click: UPPERCASE for labels and emphasis, lowercase to undo a Caps Lock accident, Title Case for headlines, and Sentence case for body text. It preserves your line breaks and works with any language that has letter casing — a small tool that saves a surprising amount of retyping for editors, virtual assistants and anyone standardizing spreadsheet data.",
      "The two tools work well as a pipeline: paste your draft into the case converter to normalize headings, then run the final text through the word counter to confirm it fits the brief. When the writing is done, the rest of the site picks up where these tools stop — turn the published link into a printable code with the [QR code generator](/tools/qr-code-generator/), or count down to your submission deadline with the [date difference calculator](/tools/date-difference-calculator/).",
      "Every text tool here is free, requires no account, shows no paywall, and works on phones as well as desktops. If you regularly write, edit, teach or publish, it is worth bookmarking this page — the next time a word limit or a Caps-Lock paragraph shows up, the fix is one click away.",
    ],
  },
  generators: {
    heading: "Free online generators — passwords, QR codes and random numbers",
    paragraphs: [
      "Generators create something new on demand — a credential, an image, a number — and the three on this page cover the requests that come up most often in daily digital life. All of them run entirely in your browser using cryptographically secure randomness where it matters, and none of them send your data anywhere: what you generate on your device stays on your device.",
      "The [password generator](/tools/password-generator/) builds strong, random passwords with your choice of length and character sets. Human-invented passwords lean on names, dates and keyboard patterns that attackers guess first; a random 16-character password removes that structure entirely. Because generation uses the browser's Web Crypto API and never touches a server, the password exists only on your screen — pair it with a password manager and you have fixed the single biggest hole in most people's security.",
      "The [QR code generator](/tools/qr-code-generator/) turns any link, phone number or text into a scannable code you can download as a PNG. The data is encoded directly into the image — no redirect service, no tracking, no expiry — so a menu, poster or business card printed today still scans in ten years. Restaurants, event organizers, teachers and job seekers use it to close the gap between paper and web in seconds.",
      "The [random number generator](/tools/random-number-generator/) produces fair, unbiased numbers in any range, with a no-duplicates mode built for raffles and giveaways. It draws on the same cryptographic randomness as the password tool, which makes it a trustworthy referee for contests, classroom picks, sampling and games.",
      "The three tools also combine naturally: generate a Wi-Fi password, share it as a QR code, and draw a giveaway winner — all without leaving the site or creating an account. There are no watermarks, no scan limits, no trial periods and no accounts to manage. Free, instant and private is the rule for every generator here — bookmark the page and the next credential, code or draw is seconds away.",
    ],
  },
  calculators: {
    heading: "Free online calculators — exact answers for dates and ages",
    paragraphs: [
      "Calendar arithmetic looks trivial until you try it by hand: months run 28 to 31 days, leap years add a day most-but-not-all of the time, and 'how many days between these two dates?' is exactly the kind of question humans get wrong by one. The calculators in this category apply real calendar rules so the answer is exact — and they do it instantly, in your browser, without storing anything you enter.",
      "The [age calculator](/tools/age-calculator/) converts a date of birth into an exact age in years, months and days, plus total days lived and a countdown to the next birthday. That precision matters more often than you would expect: school admission cutoffs, sports age categories, visa and insurance forms, and HR paperwork all ask for exact ages, where 'about 34' is not an acceptable answer. It is equally happy calculating a child's age in months, an ancestor's age at emigration, or the day you turn 10,000 days old.",
      "The [date difference calculator](/tools/date-difference-calculator/) measures the exact gap between any two dates — as days, weeks, months and years simultaneously. Point it backward to measure durations: length of service, invoice ageing, how long a project actually took. Point it forward for countdowns: days until the wedding, the exam, the product launch, the visa deadline. Leap years and month lengths are handled exactly, which is precisely where spreadsheet formulas and mental math slip.",
      "The two calculators complement each other: birth-date questions go to the age calculator, everything else on the calendar goes to the date difference tool. And once your date math is done, the rest of the site helps with what comes next — a scannable invitation link from the [QR code generator](/tools/qr-code-generator/) for the event you just counted down to, or a fair draw from the [random number generator](/tools/random-number-generator/) at the party itself. Free, instant, exact — no signup required.",
    ],
  },
  developer: {
    heading: "Free developer tools — format, validate, encode and decode",
    paragraphs: [
      "Developer workflows are full of small conversions: an API response that needs pretty-printing, a config file that will not parse, a token payload that needs decoding. The tools in this category handle those conversions instantly — and, unlike most online dev tools, they run entirely in your browser. That is not a minor detail: the JSON and Base64 blobs developers work with routinely contain API keys, auth tokens and customer data, and pasting them into a site that uploads to a server is a quiet security risk. Here, nothing leaves your machine.",
      "The [JSON formatter](/tools/json-formatter/) pretty-prints, minifies and validates JSON with clear error messages. Paste a single-line API response and get readable, 2-space-indented output; paste a broken config file and the validator points at the trailing comma or single quote that broke it. It handles large payloads quickly because there is no upload round-trip — everything runs on the browser's native parser.",
      "The [Base64 encoder/decoder](/tools/base64-encoder-decoder/) converts text to Base64 and back with full UTF-8 support, so emoji and non-Latin characters survive the round trip. Base64 is everywhere — Basic Auth headers, data URIs, JWT payloads, Kubernetes secrets, MIME attachments — and being able to decode a blob on sight is a daily debugging skill. The two tools chain naturally: decode a JWT segment here, then pretty-print the resulting JSON in the formatter.",
      "Adjacent tools round out the workbench. The [case converter](/tools/case-converter/) normalizes identifier and heading case in bulk, the [random number generator](/tools/random-number-generator/) fills test fixtures with fair random values, and the [password generator](/tools/password-generator/) creates throwaway credentials for test accounts using cryptographic randomness. Everything is free, instant and account-free, with no rate limits and no upload size caps — built to be the tab you keep open next to your editor, from the first API call of the morning to the last debugging session of the day.",
    ],
  },
};

export function getToolContent(slug) {
  return toolContent[slug] || null;
}

export function getCategoryContent(id) {
  return categoryContent[id] || null;
}
