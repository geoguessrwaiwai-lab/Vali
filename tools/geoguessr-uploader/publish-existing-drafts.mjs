import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

// Publishes drafts that already have locations imported (created by a
// previous, partially-failed upload-batch.mjs run). Looks up all AR-*
// drafts via the API, then for each one navigates fresh to the map-maker
// page (a fresh nav means no leftover "Import successful!" modal) and
// clicks Publish.

const storageStatePath = path.resolve(import.meta.dirname, "storage-state.json");
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ storageState: storageStatePath });
const page = await context.newPage();

const listResp = await page.request.get("https://www.geoguessr.com/api/v4/user-maps/drafts?page=0&count=200");
const drafts = await listResp.json();
const arDrafts = drafts.filter((d) => d.name && d.name.startsWith("AR-"));
console.log(`found ${arDrafts.length} AR-* drafts`);

const results = [];

for (const draft of arDrafts) {
  const mapId = draft.slug;
  try {
    const detailResp = await page.request.get(`https://www.geoguessr.com/api/v4/user-maps/drafts/${mapId}`);
    const detail = await detailResp.json();
    const coordCount = detail.coordinates ? detail.coordinates.length : 0;
    if (coordCount === 0) {
      console.log(`[skip] ${draft.name}: no coordinates imported`);
      results.push({ name: draft.name, mapId, status: "no-coordinates" });
      continue;
    }

    await page.goto(`https://www.geoguessr.com/map-maker/${mapId}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    // Dismiss any leftover modal just in case.
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(300);

    await page.getByText("Publish locations", { exact: true }).click({ timeout: 10000 });
    await page.waitForTimeout(500);
    await page.getByText(/yes,\s*publish/i).click({ timeout: 10000 });
    await page.waitForTimeout(1800);

    const url = `https://www.geoguessr.com/maps/${mapId}`;
    console.log(`[ok] ${draft.name}: ${coordCount} locations -> ${url}`);
    results.push({ name: draft.name, mapId, url, coordCount, status: "published" });
  } catch (err) {
    console.error(`[fail] ${draft.name}: ${err.message.split("\n")[0]}`);
    results.push({ name: draft.name, mapId, status: "error", error: err.message.split("\n")[0] });
  }
}

await browser.close();

fs.writeFileSync(
  path.resolve(import.meta.dirname, "publish-results.json"),
  JSON.stringify(results, null, 2)
);
console.log("\nSaved publish-results.json");
