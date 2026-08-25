import fs from "node:fs";
import path from "node:path";
import { findPanoramaNear } from "./pano-meta.mjs";

// Usage:
//   node gather-candidates.mjs <outFile.json> [--per-file=N] [--glob="pattern1,pattern2"]
//
// Builds a pool of { lat, lon, panoId, headingDeg, date, source } candidates for the
// Gen1-4 / hood-color labeling tool, by resolving lat/lng points from Vali's own
// `*-locations.json` outputs (and any manually-added seed points below) to real
// Street View panoramas via the free findPanoramaNear lookup. No API key needed.
//
// Kept deliberately broad/diverse: the AR/MX location pool alone is almost certainly
// homogeneous in camera generation (same rural regions, similar capture eras), so a
// handful of manually chosen international points are mixed in to have a chance of
// covering Gen4 (recently-refreshed urban corridors) and older/rural Gen1-2 coverage.

const REPO_ROOT = path.resolve(import.meta.dirname, "../..");

const DEFAULT_GLOBS = [
  "argentina-provinces/*-locations.json",
  "mexico-states/*-locations.json",
];

// Manually curated seed points to broaden generation coverage beyond AR/MX.
// lat, lon, label (just for the operator's own reference, not sent anywhere)
const SEED_POINTS = [
  [40.758896, -73.98513, "NYC Times Square (candidate Gen4)"],
  [35.659518, 139.700575, "Tokyo Shibuya (candidate Gen4)"],
  [37.497913, 127.027596, "Seoul Gangnam (candidate Gen4)"],
  [-23.561414, -46.655881, "Sao Paulo Av. Paulista (candidate Gen4)"],
  [48.869814, 2.305188, "Paris Champs-Elysees (candidate Gen4)"],
  [51.507359, -0.127603, "London (candidate Gen4)"],
  [37.773972, -122.431297, "San Francisco (candidate Gen4)"],
  [55.755825, 37.617298, "Moscow (candidate mixed gen)"],
  [-33.868820, 151.209290, "Sydney (candidate mixed gen)"],
  [64.845742, -147.722603, "Fairbanks AK (candidate older coverage)"],
  [-1.286389, 36.817223, "Nairobi (candidate older coverage)"],
  [27.700769, 85.300140, "Kathmandu (candidate older coverage)"],
];

function globSync(pattern) {
  const dir = path.dirname(pattern);
  const base = path.basename(pattern);
  const re = new RegExp("^" + base.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
  const full = path.join(REPO_ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => re.test(f)).map((f) => path.join(full, f));
}

function loadLatLngFromLocationsFile(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const coords = Array.isArray(data) ? data : data.customCoordinates ?? [];
  return coords.map((c) => ({ lat: c.lat, lon: c.lng, sourceFile: path.basename(file) }));
}

const args = process.argv.slice(2);
const outFile = args.find((a) => !a.startsWith("--"));
const perFileArg = args.find((a) => a.startsWith("--per-file="));
const perFile = perFileArg ? parseInt(perFileArg.split("=")[1], 10) : 6;

if (!outFile) {
  console.error('Usage: node gather-candidates.mjs <outFile.json> [--per-file=N]');
  process.exit(1);
}

const files = DEFAULT_GLOBS.flatMap(globSync);
console.log(`found ${files.length} source location files`);

let pool = [];
for (const file of files) {
  const points = loadLatLngFromLocationsFile(file);
  // Spread the sample across the file rather than clustering at the start.
  const step = Math.max(1, Math.floor(points.length / perFile));
  for (let i = 0; i < points.length && pool.length < 100000; i += step) {
    pool.push(points[i]);
  }
}
for (const [lat, lon, label] of SEED_POINTS) {
  pool.push({ lat, lon, sourceFile: `seed: ${label}` });
}

console.log(`resolving ${pool.length} candidate points to panoramas...`);

const candidates = [];
let i = 0;
for (const p of pool) {
  i++;
  try {
    const meta = await findPanoramaNear(p.lat, p.lon);
    if (!meta) {
      console.log(`[${i}/${pool.length}] no panorama near ${p.lat},${p.lon} (${p.sourceFile})`);
      continue;
    }
    candidates.push({
      panoId: meta.id,
      lat: meta.lat,
      lon: meta.lon,
      headingDeg: meta.headingDeg,
      rollDeg: meta.rollDeg,
      date: meta.date,
      copyright: meta.copyright,
      sourceFile: p.sourceFile,
    });
    console.log(`[${i}/${pool.length}] ${meta.id} (${meta.date}, ${p.sourceFile})`);
  } catch (e) {
    console.log(`[${i}/${pool.length}] FAILED ${p.lat},${p.lon}: ${e.message}`);
  }
}

// De-dupe by panoId (adjacent samples can resolve to the same pano).
const seen = new Set();
const deduped = candidates.filter((c) => (seen.has(c.panoId) ? false : (seen.add(c.panoId), true)));

fs.writeFileSync(outFile, JSON.stringify(deduped, null, 2));
console.log(`\nWrote ${deduped.length} unique candidates to ${outFile}`);
