// scripts/build.mjs
// Inlines @import and writes dist/say.css (minified-ish).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");
const SRC = join(ROOT, "src");
const DIST = join(ROOT, "dist");

let lcTransform = null;
try {
  const lc = await import("lightningcss");
  lcTransform = lc.transform;
} catch (e) {
  lcTransform = null;
}

function inlineImports(filePath, seen = new Set()) {
  const abs = resolve(filePath);
  if (seen.has(abs)) return "";
  seen.add(abs);
  const text = readFileSync(abs, "utf8");
  const dir = dirname(abs);
  // handle @import "./x.css" layer(...); and @import "url"
  return text.replace(/@import\s+["']([^"']+)["']([^;]*);/g, (m, rel, layer) => {
    const imported = resolve(dir, rel);
    const inlined = inlineImports(imported, seen);
    // preserve layer wrapper by keeping @layer? We'll wrap in @layer if layer present
    const layerMatch = layer.match(/layer\(([^)]+)\)/);
    if (layerMatch) {
      return `@layer ${layerMatch[1]} { ${inlined} }`;
    }
    return inlined;
  });
}

mkdirSync(DIST, { recursive: true });
const full = inlineImports(join(SRC, "index.css"));

// minify with LightningCSS if available, else basic
function minify(css) {
  if (lcTransform) {
    try {
      const res = lcTransform({ code: Buffer.from(css), minify: true, sourceMap: false });
      return res.code.toString();
    } catch (e) {
      console.warn("LightningCSS failed, falling back:", e.message);
    }
  }
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

writeFileSync(join(DIST, "say.css"), full);
writeFileSync(join(DIST, "say.min.css"), minify(full));
console.log("Built dist/say.css and dist/say.min.css");
console.log("unminified bytes:", full.length, "minified bytes:", minify(full).length);
