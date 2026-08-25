import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

// Batch version of upload-map.mjs: creates, imports and publishes one map
// per entry, reusing a single browser context. Prints a JSON results array
// (name, file, mapId, url, status) to stdout at the end so the caller can
// turn it into a table.

const provinces = [
  { name: "AR-Jujuy", file: "../../argentina-provinces/ar-jujuy-locations.json" },
  { name: "AR-Salta", file: "../../argentina-provinces/ar-salta-locations.json" },
  { name: "AR-Formosa", file: "../../argentina-provinces/ar-formosa-locations.json" },
  { name: "AR-Chaco", file: "../../argentina-provinces/ar-chaco-locations.json" },
  { name: "AR-Tucumán", file: "../../argentina-provinces/ar-tucuman-locations.json" },
  { name: "AR-Misiones", file: "../../argentina-provinces/ar-misiones-locations.json" },
  { name: "AR-Santiago del Estero", file: "../../argentina-provinces/ar-santiago-del-estero-locations.json" },
  { name: "AR-Catamarca", file: "../../argentina-provinces/ar-catamarca-locations.json" },
  { name: "AR-Corrientes", file: "../../argentina-provinces/ar-corrientes-locations.json" },
  { name: "AR-La Rioja", file: "../../argentina-provinces/ar-la-rioja-locations.json" },
  { name: "AR-San Juan", file: "../../argentina-provinces/ar-san-juan-locations.json" },
  { name: "AR-Santa Fe", file: "../../argentina-provinces/ar-santa-fe-locations.json" },
  { name: "AR-Entre Ríos", file: "../../argentina-provinces/ar-entre-rios-locations.json" },
  { name: "AR-Córdoba", file: "../../argentina-provinces/ar-cordoba-locations.json" },
  { name: "AR-San Luis", file: "../../argentina-provinces/ar-san-luis-locations.json" },
  { name: "AR-Mendoza", file: "../../argentina-provinces/ar-mendoza-locations.json" },
  { name: "AR-Buenos Aires", file: "../../argentina-provinces/ar-buenos-aires-locations.json" },
  { name: "AR-La Pampa", file: "../../argentina-provinces/ar-la-pampa-locations.json" },
  { name: "AR-Neuquén", file: "../../argentina-provinces/ar-neuquen-locations.json" },
  { name: "AR-Río Negro", file: "../../argentina-provinces/ar-rio-negro-locations.json" },
  { name: "AR-Chubut", file: "../../argentina-provinces/ar-chubut-locations.json" },
  { name: "AR-Santa Cruz", file: "../../argentina-provinces/ar-santa-cruz-locations.json" },
  { name: "AR-Tierra del Fuego", file: "../../argentina-provinces/ar-tierra-del-fuego-locations.json" },
];

const ncfa = process.env.GEOGUESSR_NCFA;
const storageStatePath = path.resolve(import.meta.dirname, "storage-state.json");

if (!ncfa && !fs.existsSync(storageStatePath)) {
  console.error("Set GEOGUESSR_NCFA or provide storage-state.json first.");
  process.exit(1);
}

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

const profileResp = await page.request.get("https://www.geoguessr.com/api/v3/profiles");
if (!profileResp.ok()) {
  console.error(`Not authenticated (status ${profileResp.status()}).`);
  process.exit(1);
}

const results = [];

for (const { name, file } of provinces) {
  const jsonPath = path.resolve(import.meta.dirname, file);
  if (!fs.existsSync(jsonPath)) {
    console.error(`[skip] ${name}: file not found (${jsonPath})`);
    results.push({ name, file, status: "file-not-found" });
    continue;
  }

  try {
    await page.goto("https://www.geoguessr.com/map-maker", { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("Map name (required)").fill(name);
    await page.getByText("Handpicked locations", { exact: false }).click();
    await page.getByText("Create map", { exact: false }).click();
    await page.waitForURL(/\/map-maker\/[a-f0-9]+/, { timeout: 15000 });
    const mapId = page.url().split("/map-maker/")[1];

    await page.waitForTimeout(800);
    const headerButtons = await page.locator("button").elementHandles();
    await headerButtons[3].click();
    await page.waitForTimeout(400);
    await page.getByText("Import JSON file", { exact: true }).click();
    await page.waitForTimeout(400);
    await page.locator("input[type=file]").first().setInputFiles(jsonPath);
    await page.waitForTimeout(1800);

    const bodyText = await page.locator("body").innerText();
    const importedMatch = bodyText.match(/Added:\s*(\d+)\s*locations?/i);
    const importedCount = importedMatch ? Number(importedMatch[1]) : null;

    // Re-navigate to clear the "Import successful!" modal — it otherwise
    // intercepts the Publish click below.
    await page.goto(`https://www.geoguessr.com/map-maker/${mapId}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);

    await page.getByText("Publish locations", { exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByText(/yes,\s*publish/i).click();
    await page.waitForTimeout(1800);

    const url = `https://www.geoguessr.com/maps/${mapId}`;
    console.log(`[ok] ${name}: ${importedCount} locations -> ${url}`);
    results.push({ name, file, mapId, url, importedCount, status: "published" });
  } catch (err) {
    console.error(`[fail] ${name}: ${err.message}`);
    results.push({ name, file, status: "error", error: err.message });
  }

  await context.storageState({ path: storageStatePath });
}

await browser.close();

fs.writeFileSync(
  path.resolve(import.meta.dirname, "batch-results.json"),
  JSON.stringify(results, null, 2)
);
console.log("\nSaved batch-results.json");
console.log(JSON.stringify(results, null, 2));
