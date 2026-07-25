# ToolSite — Free Online Tools

Next.js static site. 3 tools included: Word Counter, Case Converter, Password Generator.

## Deploy (Cloudflare Pages)
- Framework preset: **Next.js (Static HTML Export)**
- Build command: **npm run build**
- Build output directory: **out**

## Add a new tool
1. Add an entry in `lib/tools.js`
2. Create `components/tools/YourTool.js` (the tool UI)
3. Create `app/tools/your-tool/page.js` (copy an existing one, change slug)

## Rename the site
Edit `lib/site.js` — name appears everywhere automatically.
