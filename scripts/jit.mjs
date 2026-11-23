// scripts/jit.mjs
// Generates src/jit.css from arbitrary-value utility classes found in source files.
// Usage: node scripts/jit.mjs [dir]
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, extname, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_EXT = new Set([".html", ".htm", ".jsx", ".tsx", ".vue", ".svelte", ".js", ".ts", ".astro", ".mdx"]);
const IGNORE = new Set(["node_modules", "dist", ".git", "types"]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (IGNORE.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (SCAN_EXT.has(extname(name))) out.push(p);
  }
  return out;
}

function extractClasses(text) {
  const found = new Set();
  const re = /(?:class|className)\s*=\s*(?:"([^"]*)"|'([^']*)'|{`([^`]*)`})/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const val = m[1] || m[2] || m[3] || "";
    for (const tok of val.split(/\s+/)) if (tok) found.add(tok);
  }
  return found;
}

function splitVariants(token) {
  const parts = [];
  let depth = 0, cur = "";
  for (const ch of token) {
    if (ch === "[") depth++;
    else if (ch === "]") depth--;
    if (ch === ":" && depth === 0) { parts.push(cur); cur = ""; }
    else cur += ch;
  }
  if (cur) parts.push(cur);
  return parts;
}

function isColor(v) { return /^#|^rgb|^rgba|^hsl|^hsla|^oklch|^oklab|^color\(/i.test(v.trim()); }

const handlers = {
  p: v => `padding:${v};`,
  px: v => `padding-left:${v};padding-right:${v};`,
  py: v => `padding-top:${v};padding-bottom:${v};`,
  pt: v => `padding-top:${v};`,
  pr: v => `padding-right:${v};`,
  pb: v => `padding-bottom:${v};`,
  pl: v => `padding-left:${v};`,
  m: v => `margin:${v};`,
  mx: v => `margin-left:${v};margin-right:${v};`,
  my: v => `margin-top:${v};margin-bottom:${v};`,
  mt: v => `margin-top:${v};`,
  mr: v => `margin-right:${v};`,
  mb: v => `margin-bottom:${v};`,
  ml: v => `margin-left:${v};`,
  gap: v => `gap:${v};`,
  "gap-x": v => `column-gap:${v};`,
  "gap-y": v => `row-gap:${v};`,
  w: v => `width:${v};`,
  h: v => `height:${v};`,
  "min-w": v => `min-width:${v};`,
  "max-w": v => `max-width:${v};`,
  "min-h": v => `min-height:${v};`,
  "max-h": v => `max-height:${v};`,
  top: v => `top:${v};`,
  right: v => `right:${v};`,
  bottom: v => `bottom:${v};`,
  left: v => `left:${v};`,
  "basis": v => `flex-basis:${v};`,
  "z": v => `z-index:${v};`,
  "rounded": v => `border-radius:${v};`,
  "opacity": v => `opacity:${v};`,
  "leading": v => `line-height:${v};`,
  "tracking": v => `letter-spacing:${v};`,
  "aspect": v => `aspect-ratio:${v};`,
  "blur": v => `filter:blur(${v});`,
  "backdrop-blur": v => `backdrop-filter:blur(${v});`,
  "cursor": v => `cursor:${v};`,
  "duration": v => `transition-duration:${v};`,
  "delay": v => `transition-delay:${v};`,
  "order": v => `order:${v};`,
  "grow": v => `flex-grow:${v};`,
  "shrink": v => `flex-shrink:${v};`,
  "text": v => (isColor(v) ? `color:${v};` : `font-size:${v};`),
  "bg": v => (isColor(v) ? `background-color:${v};` : (v.startsWith("url") ? `background-image:${v};` : `background:${v};`)),
  "border": v => (isColor(v) ? `border-color:${v};` : `border-width:${v};`),
  "rounded-tl": v => `border-top-left-radius:${v};`,
  "rounded-tr": v => `border-top-right-radius:${v};`,
  "rounded-br": v => `border-bottom-right-radius:${v};`,
  "rounded-bl": v => `border-bottom-left-radius:${v};`,
};

function esc(s) {
  return s.split("").map((c, i) => {
    if (i === 0 && /[0-9-]/.test(c)) return "\\" + c;
    return /[a-zA-Z0-9_-]/.test(c) ? c : "\\" + c;
  }).join("");
}

const responsiveMap = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

function emit(token) {
  const parts = splitVariants(token);
  const base = parts[parts.length - 1];
  const variants = parts.slice(0, -1);
  const m = base.match(/^(.*)\[([^\]]+)\]$/);
  if (!m) return null;
  const prefix = m[1].replace(/-$/, "");
  const value = m[2];
  const handler = handlers[prefix];
  if (!handler) return null;
  let decls;
  try { decls = handler(value); } catch { return null; }
  if (!decls) return null;

  let media = null, pseudo = "", dark = false;
  for (const v of variants) {
    if (responsiveMap[v]) media = v;
    else if (v === "hover") pseudo = ":hover";
    else if (v === "focus") pseudo = ":focus";
    else if (v === "active") pseudo = ":active";
    else if (v === "disabled") pseudo = ":disabled";
    else if (v === "dark") dark = true;
  }

  const sel = "." + esc(token) + pseudo;
  let rule = `${sel} { ${decls} }`;
  if (dark) rule = `.dark ${sel}, [data-theme="dark"] ${sel} { ${decls} }`;
  if (media) rule = `@media (min-width:${responsiveMap[media]}px){ ${rule} }`;
  return rule;
}

const scanDir = resolve(process.argv[2] || ".");
const files = walk(scanDir);
const allClasses = new Set();
for (const f of files) {
  try { for (const c of extractClasses(readFileSync(f, "utf8"))) allClasses.add(c); }
  catch {}
}

const rules = [];
const seen = new Set();
for (const cls of allClasses) {
  const r = emit(cls);
  if (r && !seen.has(cls)) { seen.add(cls); rules.push(r); }
}

const header = "/* Say CSS - generated JIT (arbitrary values). Regenerate: node scripts/jit.mjs */\n";
const css = header + rules.join("\n") + "\n";
writeFileSync(join(ROOT, "src", "jit.css"), css);
console.log(`Scanned ${files.length} files, found ${allClasses.size} classes, generated ${rules.length} JIT rules -> src/jit.css`);
