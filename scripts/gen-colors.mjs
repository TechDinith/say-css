// scripts/gen-colors.mjs
// Generates src/colors.css with full OKLCH color palette.
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { hues, shades, oklch } from "./colors.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let css = "/* Say CSS — generated color palette (OKLCH). Regenerate: node scripts/gen-colors.mjs */\n";
css += "@layer say.tokens {\n";
css += "  :root {\n";
for (const hue of hues) {
  for (const sh of shades) {
    css += `    --say-color-${hue}-${sh}: ${oklch(hue, sh)};\n`;
  }
}
// semantic aliases
css += `    --say-color-primary-50: var(--say-color-blue-50);\n`;
// (primary maps to blue; keep --say-color-primary-* as aliases to blue)
for (const sh of shades) {
  css += `    --say-color-primary-${sh}: var(--say-color-blue-${sh});\n`;
}
css += `    --say-color-neutral-50: var(--say-color-slate-50);\n`;
for (const sh of shades) {
  css += `    --say-color-neutral-${sh}: var(--say-color-slate-${sh});\n`;
}
// semantic single colors
css += `    --say-color-success: var(--say-color-green-500);\n`;
css += `    --say-color-warning: var(--say-color-amber-500);\n`;
css += `    --say-color-danger: var(--say-color-red-500);\n`;
css += `    --say-color-info: var(--say-color-sky-500);\n`;
css += "  }\n";
css += "}\n";

writeFileSync(join(ROOT, "src", "colors.css"), css);
console.log("Generated color palette -> src/colors.css");
