// Tells search engines the site changed, using the IndexNow protocol.
//
// IndexNow is the sanctioned way to do this. Bing, Yandex, Seznam and Naver
// all consume it, and submitting your own URLs after a deploy is exactly
// what it is for. Google does not participate: for Google the sitemap and
// Search Console are still the only routes.
//
// Runs automatically after every production build. It reads the URLs from
// the sitemap that was just generated, so it always matches what actually
// shipped. It never fails the build: a search engine being unreachable is
// not a reason to break a deploy.

import fs from "node:fs";
import path from "node:path";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const OUT_DIR = path.join(process.cwd(), "out");
const DRY_RUN = process.argv.includes("--dry-run");

function log(msg) {
  console.log("[indexnow] " + msg);
}

function findKey() {
  // The key file lives in public/ and is copied into the build output.
  const files = fs.existsSync(OUT_DIR) ? fs.readdirSync(OUT_DIR) : [];
  const keyFile = files.find((f) => /^[0-9a-f]{8,128}\.txt$/i.test(f));
  if (!keyFile) return null;
  const key = fs.readFileSync(path.join(OUT_DIR, keyFile), "utf8").trim();
  return { key, keyFile };
}

function readSitemapUrls() {
  const file = path.join(OUT_DIR, "sitemap.xml");
  if (!fs.existsSync(file)) return [];
  const xml = fs.readFileSync(file, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const found = findKey();
  if (!found) {
    log("no key file in the build output, skipping");
    return;
  }

  const urls = readSitemapUrls();
  if (!urls.length) {
    log("sitemap has no URLs, skipping");
    return;
  }

  const host = new URL(urls[0]).host;
  const body = {
    host,
    key: found.key,
    keyLocation: `https://${host}/${found.keyFile}`,
    urlList: urls,
  };

  // Only the real production deploy notifies anyone. Local builds and
  // preview branches stay quiet, so search engines are never told about a
  // URL that is not actually live.
  const branch = process.env.CF_PAGES_BRANCH;
  const isProduction = process.env.CF_PAGES && branch === "main";

  if (DRY_RUN || !isProduction) {
    const why = DRY_RUN
      ? "dry run"
      : !process.env.CF_PAGES
      ? "local build"
      : `preview branch "${branch}"`;
    log(`${why}: would submit ${urls.length} URLs for ${host}`);
    log(`  key location: ${body.keyLocation}`);
    log(`  first URL:    ${urls[0]}`);
    return;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    // 200 accepted, 202 accepted but key still being validated
    if (res.ok) {
      log(`submitted ${urls.length} URLs for ${host} (HTTP ${res.status})`);
    } else {
      log(`search engines returned HTTP ${res.status}, continuing anyway`);
    }
  } catch (err) {
    log(`could not reach the endpoint (${err.message}), continuing anyway`);
  }

  // WebSub, on top: Google runs this hub itself and reads our RSS feed
  // through it, which makes the ping the one sanctioned way to push a
  // "something new is live" signal toward Google specifically. IndexNow
  // covers Bing and friends; this covers the feed readers, Google's
  // included.
  try {
    const feed = `https://${host}/feed.xml`;
    const hub = await fetch("https://pubsubhubbub.appspot.com/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `hub.mode=publish&hub.url=${encodeURIComponent(feed)}`,
    });
    log(`websub ping for ${feed} (HTTP ${hub.status})`);
  } catch (err) {
    log(`websub hub unreachable (${err.message}), continuing anyway`);
  }
}

// Whatever happens, the deploy succeeds.
main().catch((err) => log("unexpected error: " + err.message));
