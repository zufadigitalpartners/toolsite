// Writes lib/lastmod.json: route -> the ISO date its content last truly
// changed, read from git history. The sitemap attaches these as lastmod.
//
// Google has said plainly that it uses sitemap lastmod when the values
// prove trustworthy and ignores the field site-wide when they lie. So the
// one rule here is honesty: dates come from the last commit that touched
// the page's own content file, never from "now", and a file with no
// history is simply omitted rather than stamped fresh.
//
// Runs as part of build:local and the result is committed. It does NOT run
// on Cloudflare, whose shallow clones would date every file to the moment
// of cloning, which is exactly the lie the rule above forbids.

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "lib", "lastmod.json");

function sh(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim();
}

try {
  if (sh("git rev-parse --is-shallow-repository") === "true") {
    console.log("[lastmod] shallow clone, keeping the committed map as is");
    process.exit(0);
  }
} catch {
  console.log("[lastmod] no git available, keeping the committed map as is");
  process.exit(0);
}

function lastCommitIso(file) {
  try {
    const iso = sh(`git log -1 --format=%cI -- "${file}"`);
    return iso ? iso.slice(0, 10) : null;
  } catch {
    return null;
  }
}

function listJson(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith(".json"));
}

const map = {};
const maxDate = (dates) => dates.filter(Boolean).sort().pop() || null;

// tools
const toolDates = [];
for (const f of listJson("content/tools")) {
  const d = lastCommitIso(`content/tools/${f}`);
  if (d) {
    map[`/tools/${f.replace(/\.json$/, "")}/`] = d;
    toolDates.push(d);
  }
}

// categories: a category page changes when its own copy changes OR when a
// tool inside it does, since the page lists them.
const catTools = {};
for (const f of listJson("content/tools")) {
  try {
    const j = JSON.parse(fs.readFileSync(path.join(ROOT, "content/tools", f), "utf8"));
    const cat = (j.category || "").split("/").pop().replace(/\.json$/, "");
    (catTools[cat] = catTools[cat] || []).push(map[`/tools/${f.replace(/\.json$/, "")}/`]);
  } catch { /* unparsable file changes nothing */ }
}
for (const f of listJson("content/categories")) {
  const id = f.replace(/\.json$/, "");
  const d = maxDate([lastCommitIso(`content/categories/${f}`), ...(catTools[id] || [])]);
  if (d) map[`/category/${id}/`] = d;
}

// blog
const postDates = [];
for (const f of listJson("content/posts")) {
  const d = lastCommitIso(`content/posts/${f}`);
  if (d) {
    map[`/blog/${f.replace(/\.json$/, "")}/`] = d;
    postDates.push(d);
  }
}

// static pages
for (const f of listJson("content/pages")) {
  const d = lastCommitIso(`content/pages/${f}`);
  if (d) map[`/${f.replace(/\.json$/, "")}/`] = d;
}

// hubs: newest of what they list
map["/"] = maxDate([...toolDates, ...postDates]);
map["/tools/"] = maxDate(toolDates);
map["/blog/"] = maxDate(postDates);

fs.writeFileSync(OUT, JSON.stringify(map, null, 2) + "\n");
console.log(`[lastmod] wrote ${Object.keys(map).length} routes to lib/lastmod.json`);
