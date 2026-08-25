import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

// Usage:
//   GEOGUESSR_NCFA=... node upload-map.mjs --name "MX-JAL" --file ../../mexico-states/mx-jal-locations.json [--publish]
//
// Without --publish the map is created and locations are imported, but left
// as a private draft. Pass --publish to also make it public and print the
// final https://www.geoguessr.com/maps/<id> link.

const args = process.argv.slice(2);
function argValue(flag) {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1];
}

const name = argValue("--name");
const file = argValue("--file");
const shouldPublish = args.includes("--publish");

if (!name || !file) {
  console.error("Usage: node upload-map.mjs --name <map name> --file <locations.json> [--publish]");
  process.exit(1);
}

const ncfa = process.env.GEOGUESSR_NCFA;
if (!ncfa) {
  console.error("GEOGUESSR_NCFA env var is not set. See README.md for how to obtain it.");
  process.exit(1);
}

const jsonPath = path.resolve(file);
if (!fs.existsSync(jsonPath)) {
  console.error(`File not found: ${jsonPath}`);
  process.exit(1);
}

const storageStatePath = path.resolve(import.meta.dirname, "storage-state.json");

const browser = await chromium.launch({ headless: true });
const context = fs.existsSync(storageStatePath)
  ? await browser.newContext({ storageState: storageStatePath })
  : await browser.newContext();

if (!fs.existsSync(storageStatePath)) {
  await context.addCookies([
    { name: "_ncfa", value: ncfa, domain: ".geoguessr.com", path: "/", httpOnly: true, secure: true },
  ]);
}

const page = await context.newPage();

// Sanity check: make sure the cookie is actually valid before doing anything else.
const profileResp = await page.request.get("https://www.geoguessr.com/api/v3/profiles");
if (!profileResp.ok()) {
  console.error(`Not authenticated (profiles endpoint returned ${profileResp.status()}). Cookie may be expired.`);
  process.exit(1);
}

await page.goto("https://www.geoguessr.com/map-maker", { waitUntil: "domcontentloaded" });
await page.getByPlaceholder("Map name (required)").fill(name);
await page.getByText("Handpicked locations", { exact: false }).click();
await page.getByText("Create map", { exact: false }).click();
await page.waitForURL(/\/map-maker\/[a-f0-9]+/, { timeout: 15000 });

const mapId = page.url().split("/map-maker/")[1];
console.log(`Created draft map: ${name} (${mapId})`);

// Open the "..." menu next to the Publish button and import the JSON file.
await page.waitForTimeout(1000);
const headerButtons = await page.locator("button").elementHandles();
await headerButtons[3].click();
await page.waitForTimeout(500);
await page.getByText("Import JSON file", { exact: true }).click();
await page.waitForTimeout(500);
await page.locator("input[type=file]").first().setInputFiles(jsonPath);
await page.waitForTimeout(2000);

const bodyText = await page.locator("body").innerText();
const importedMatch = bodyText.match(/Added:\s*(\d+)\s*locations?/i);
console.log(importedMatch ? `Imported ${importedMatch[1]} locations` : "Import result unclear — check screenshot");
await page.screenshot({ path: path.resolve(import.meta.dirname, `last-import-${mapId}.png`) });

let finalUrl = `https://www.geoguessr.com/map-maker/${mapId}`;
if (shouldPublish) {
  await page.getByText("Publish locations", { exact: true }).click();
  await page.waitForTimeout(500);
  await page.getByText(/yes,\s*publish/i).click();
  await page.waitForTimeout(2000);
  finalUrl = `https://www.geoguessr.com/maps/${mapId}`;
  console.log(`Published: ${finalUrl}`);
} else {
  console.log(`Draft saved (not published): ${finalUrl}`);
}

await context.storageState({ path: storageStatePath });
await browser.close();

console.log(finalUrl);
