import fs from "node:fs";
import path from "node:path";
import { renderLocationBundle } from "../render-pano.mjs";
import { mapConcurrent } from "../concurrency.mjs";

// Usage: node capture-for-labeling.mjs <candidates.json> <outDir> [--concurrency=N]
//
// For each candidate { panoId, headingDeg, date, lat, lon, sourceFile }, renders into
// outDir/images/<panoId>/: front.jpg/back.jpg (perspective crops at yaw 0°/180° — PRIMARY,
// the car reads as a normal recognizable hood shape here) and ground.jpg (a full-360° nadir
// band, kept only as a fallback for the rare case neither front nor back shows the car).
//
// front/back use yaw=0/180, NOT headingDeg — see renderCarViews in render-pano.mjs for why
// headingDeg is descriptive metadata (what compass bearing yaw=0 happens to face), not a
// rotation to apply; using it as a yaw input double-rotates the view away from forward. It's
// still recorded per item below because the labeling UI's embedded Street View iframe needs
// it (Google's own `heading` URL param is a true compass bearing, unlike our yaw).
//
// A full-360° band alone (no front/back) was tried first so no yaw ever needs guessing, but
// two problems showed up: the equirectangular warp turns the car into a hard-to-read curved
// streak rather than a normal hood shape, and older/lower-quality panoramas can have
// genuinely blank imagery at the deepest nadir (not a bug — Google just never captured it),
// which shows up as a black gap right where the car would be. front/back read far better, so
// those are primary.
//
// renderLocationBundle stitches each panorama's tiles once (in parallel) and derives all
// crops from that single fetch; candidates are also processed with bounded concurrency
// (default 8) instead of one at a time, since this otherwise dominates wall-clock time when
// building a large labeling batch.
//
// Writes outDir/items.json for the labeling server to serve.

const args = process.argv.slice(2);
const [candidatesPath, outDir] = args.filter((a) => !a.startsWith("--"));
const concurrencyArg = args.find((a) => a.startsWith("--concurrency="));
const concurrency = concurrencyArg ? parseInt(concurrencyArg.split("=")[1], 10) : 8;

if (!candidatesPath || !outDir) {
  console.error("Usage: node capture-for-labeling.mjs <candidates.json> <outDir> [--concurrency=N]");
  process.exit(1);
}

const candidates = JSON.parse(fs.readFileSync(candidatesPath, "utf8"));
const imagesDir = path.join(outDir, "images");
fs.mkdirSync(imagesDir, { recursive: true });

const started = Date.now();
const results = await mapConcurrent(candidates, concurrency, async (c, i) => {
  const dir = path.join(imagesDir, c.panoId);
  fs.mkdirSync(dir, { recursive: true });
  try {
    const { front, back, ground } = await renderLocationBundle(c.panoId, { zoom: 3 });
    await Promise.all([
      front.toFile(path.join(dir, "front.jpg")),
      back.toFile(path.join(dir, "back.jpg")),
      ground.toFile(path.join(dir, "ground.jpg")),
    ]);
    console.log(`[${i + 1}/${candidates.length}] ${c.panoId} done`);
    return {
      panoId: c.panoId,
      lat: c.lat,
      lon: c.lon,
      headingDeg: c.headingDeg,
      date: c.date,
      copyright: c.copyright,
      sourceFile: c.sourceFile,
      images: {
        front: `images/${c.panoId}/front.jpg`,
        back: `images/${c.panoId}/back.jpg`,
        ground: `images/${c.panoId}/ground.jpg`,
      },
    };
  } catch (e) {
    console.log(`[${i + 1}/${candidates.length}] ${c.panoId} FAILED: ${e.message}`);
    return null;
  }
});

const items = results.filter(Boolean);
fs.writeFileSync(path.join(outDir, "items.json"), JSON.stringify(items, null, 2));
const elapsed = ((Date.now() - started) / 1000).toFixed(1);
console.log(`\nWrote ${items.length} items to ${outDir}/items.json in ${elapsed}s`);
