// scripts/gen-utilities.mjs
// Generates src/utilities.css from utility definitions.
// Run: node scripts/gen-utilities.mjs

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, "..");

const MODE = process.env.MODE || "normal";
const OUT_FILE = process.env.OUT || "src/utilities.css";

function esc(s) {
  return s.split("").map((c, i) => {
    if (i === 0 && /[0-9-]/.test(c)) return "\\" + c;
    return /[a-zA-Z0-9_-]/.test(c) ? c : "\\" + c;
  }).join("");
}

const rules = [];
const variantRules = [];
const bps = [["sm", 640], ["md", 768], ["lg", 1024], ["xl", 1280], ["2xl", 1536]];

function base(name, decls, opts = {}) {
  if (MODE === "container") {
    const cbps = [["sm", 320], ["md", 480], ["lg", 640], ["xl", 800], ["2xl", 960]];
    for (const [bp, px] of cbps) {
      rules.push(`@container (min-width:${px}px){ .\\@${bp}\\:${esc(name)} { ${decls} } }`);
    }
    return;
  }
  const e = esc(name);
  rules.push(`.${e} { ${decls} }`);
  if (opts.responsive !== false) {
    for (const [bp, px] of bps) {
      variantRules.push(`@media (min-width:${px}px){ .\\${bp}\\:${e} { ${decls} } }`);
    }
  }
  if (opts.hover) variantRules.push(`.${esc("hover:" + name)}:hover { ${decls} }`);
  if (opts.focus) variantRules.push(`.${esc("focus:" + name)}:focus { ${decls} }`);
  if (opts.active) variantRules.push(`.${esc("active:" + name)}:active { ${decls} }`);
  if (opts.disabled) variantRules.push(`.${esc("disabled:" + name)}:disabled { ${decls} }`);
  if (opts.dark) variantRules.push(`.dark .${esc("dark:" + name)}, [data-theme="dark"] .${esc("dark:" + name)} { ${decls} }`);
}

const spaceKeys = ["0","px","0.5","1","1.5","2","2.5","3","3.5","4","5","6","7","8","9","10","11","12","14","16","20","24","28","32","36","40","44","48","52","56","60","64","72","80","96"];
function sp(k) {
  if (k === "px") return "1px";
  const n = parseFloat(k);
  if (k === "0") return "0";
  return (n * 0.25) + "rem";
}
// map key -> css value using tokens
function spv(k) { return `var(--say-space-${k.replace(".", "-")})`; }
// token names use 0-5 etc with hyphen for dot: 0.5 -> 0-5? Our tokens use 0-5. Yes.
function spaceToken(k) { return `var(--say-space-${k.replace(".", "-")})`; }

import { hues, shades } from "./colors.mjs";

// ---------- Display ----------
for (const [n,d] of [["block","block"],["inline-block","inline-block"],["inline","inline"],["flex","flex"],["inline-flex","inline-flex"],["grid","grid"],["inline-grid","inline-grid"],["hidden","none"],["contents","contents"],["table","table"],["table-row","table-row"],["table-cell","table-cell"],["flow-root","flow-root"]]) base(n, `display:${d};`, { dark: true });

// ---------- Position ----------
for (const p of ["static","fixed","absolute","relative","sticky"]) base(p, `position:${p};`);

// ---------- Inset ----------
base("inset-0", "top:0;right:0;bottom:0;left:0;");
base("inset-x-0", "left:0;right:0;");
base("inset-y-0", "top:0;bottom:0;");
for (const k of spaceKeys) {
  base(`top-${k}`, `top:${spaceToken(k)};`);
  base(`right-${k}`, `right:${spaceToken(k)};`);
  base(`bottom-${k}`, `bottom:${spaceToken(k)};`);
  base(`left-${k}`, `left:${spaceToken(k)};`);
}
// negative
for (const k of spaceKeys) {
  if (k === "0" || k === "px") continue;
  base(`-top-${k}`, `top:-${sp(k)};`, { responsive: true });
  base(`-right-${k}`, `right:-${sp(k)};`, { responsive: true });
  base(`-bottom-${k}`, `bottom:-${sp(k)};`, { responsive: true });
  base(`-left-${k}`, `left:-${sp(k)};`, { responsive: true });
}

// ---------- Z-index ----------
for (const z of [["0","0"],["10","10"],["20","20"],["30","30"],["40","40"],["50","50"],["auto","auto"]]) base(`z-${z[0]}`, `z-index:${z[1]};`);

// ---------- Overflow ----------
for (const o of ["auto","hidden","clip","visible","scroll"]) {
  base(`overflow-${o}`, `overflow:${o};`);
  base(`overflow-x-${o}`, `overflow-x:${o};`);
  base(`overflow-y-${o}`, `overflow-y:${o};`);
}

// ---------- Visibility ----------
base("visible", "visibility:visible;");
base("invisible", "visibility:hidden;");
base("collapse", "visibility:collapse;");

// ---------- Flex ----------
base("flex-row", "flex-direction:row;");
base("flex-row-reverse", "flex-direction:row-reverse;");
base("flex-col", "flex-direction:column;");
base("flex-col-reverse", "flex-direction:column-reverse;");
base("flex-wrap", "flex-wrap:wrap;");
base("flex-wrap-reverse", "flex-wrap:wrap-reverse;");
base("flex-nowrap", "flex-wrap:nowrap;");
base("flex-1", "flex:1 1 0%;");
base("flex-auto", "flex:1 1 auto;");
base("flex-initial", "flex:0 1 auto;");
base("flex-none", "flex:none;");
// grow/shrink
base("grow", "flex-grow:1;");
base("grow-0", "flex-grow:0;");
base("shrink", "flex-shrink:1;");
base("shrink-0", "flex-shrink:0;");
// basis
for (const k of spaceKeys) base(`basis-${k}`, `flex-basis:${spaceToken(k)};`);
base("basis-auto", "flex-basis:auto;");
base("basis-full", "flex-basis:100%;");
// gap
for (const k of spaceKeys) {
  base(`gap-${k}`, `gap:${spaceToken(k)};`);
  base(`gap-x-${k}`, `column-gap:${spaceToken(k)};`);
  base(`gap-y-${k}`, `row-gap:${spaceToken(k)};`);
}

// ---------- Grid ----------
for (let i = 1; i <= 12; i++) base(`grid-cols-${i}`, `grid-template-columns:repeat(${i},minmax(0,1fr));`);
base("grid-cols-none", "grid-template-columns:none;");
for (let i = 1; i <= 6; i++) base(`grid-rows-${i}`, `grid-template-rows:repeat(${i},minmax(0,1fr));`);
base("grid-rows-none", "grid-template-rows:none;");
base("grid-flow-row", "grid-auto-flow:row;");
base("grid-flow-col", "grid-auto-flow:column;");
base("grid-flow-dense", "grid-auto-flow:dense;");
base("grid-flow-row-dense", "grid-auto-flow:row dense;");
base("grid-flow-col-dense", "grid-auto-flow:column dense;");
// col/row span
for (let i = 1; i <= 12; i++) base(`col-span-${i}`, `grid-column:span ${i} / span ${i};`);
base("col-span-full", "grid-column:1 / -1;");
base("col-auto", "grid-column:auto;");
for (let i = 1; i <= 6; i++) base(`row-span-${i}`, `grid-row:span ${i} / span ${i};`);
base("row-span-full", "grid-row:1 / -1;");
base("row-auto", "grid-row:auto;");
// col/row start/end (subset)
for (let i = 1; i <= 7; i++) {
  base(`col-start-${i}`, `grid-column-start:${i};`);
  base(`col-end-${i}`, `grid-column-end:${i};`);
  base(`row-start-${i}`, `grid-row-start:${i};`);
  base(`row-end-${i}`, `grid-row-end:${i};`);
}
base("col-start-auto", "grid-column-start:auto;");
base("col-end-auto", "grid-column-end:auto;");

// ---------- Align / Justify ----------
for (const [n,v] of [["items-start","flex-start"],["items-end","flex-end"],["items-center","center"],["items-baseline","baseline"],["items-stretch","stretch"]]) base(n, `align-items:${v};`);
for (const [n,v] of [["justify-start","flex-start"],["justify-end","flex-end"],["justify-center","center"],["justify-between","space-between"],["justify-around","space-around"],["justify-evenly","space-evenly"]]) base(n, `justify-content:${v};`);
base("justify-items-start", "justify-items:start;");
base("justify-items-end", "justify-items:end;");
base("justify-items-center", "justify-items:center;");
base("justify-items-stretch", "justify-items:stretch;");
base("content-start", "align-content:flex-start;");
base("content-end", "align-content:flex-end;");
base("content-center", "align-content:center;");
base("content-between", "align-content:space-between;");
base("content-around", "align-content:space-around;");
base("content-evenly", "align-content:space-evenly;");
base("content-stretch", "align-content:stretch;");
base("self-auto", "align-self:auto;");
base("self-start", "align-self:flex-start;");
base("self-end", "align-self:flex-end;");
base("self-center", "align-self:center;");
base("self-stretch", "align-self:stretch;");
base("self-baseline", "align-self:baseline;");
base("justify-self-auto", "justify-self:auto;");
base("justify-self-start", "justify-self:start;");
base("justify-self-end", "justify-self:end;");
base("justify-self-center", "justify-self:center;");
base("justify-self-stretch", "justify-self:stretch;");

// ---------- Spacing (margin/padding) ----------
for (const k of spaceKeys) {
  base(`m-${k}`, `margin:${spaceToken(k)};`);
  base(`mx-${k}`, `margin-left:${spaceToken(k)};margin-right:${spaceToken(k)};`);
  base(`my-${k}`, `margin-top:${spaceToken(k)};margin-bottom:${spaceToken(k)};`);
  base(`mt-${k}`, `margin-top:${spaceToken(k)};`);
  base(`mr-${k}`, `margin-right:${spaceToken(k)};`);
  base(`mb-${k}`, `margin-bottom:${spaceToken(k)};`);
  base(`ml-${k}`, `margin-left:${spaceToken(k)};`);
  base(`p-${k}`, `padding:${spaceToken(k)};`);
  base(`px-${k}`, `padding-left:${spaceToken(k)};padding-right:${spaceToken(k)};`);
  base(`py-${k}`, `padding-top:${spaceToken(k)};padding-bottom:${spaceToken(k)};`);
  base(`pt-${k}`, `padding-top:${spaceToken(k)};`);
  base(`pr-${k}`, `padding-right:${spaceToken(k)};`);
  base(`pb-${k}`, `padding-bottom:${spaceToken(k)};`);
  base(`pl-${k}`, `padding-left:${spaceToken(k)};`);
}
base("m-auto", "margin:auto;");
base("mx-auto", "margin-left:auto;margin-right:auto;");
base("my-auto", "margin-top:auto;margin-bottom:auto;");
base("mt-auto", "margin-top:auto;");
base("mr-auto", "margin-right:auto;");
base("mb-auto", "margin-bottom:auto;");
base("ml-auto", "margin-left:auto;");
// negative margins
for (const k of spaceKeys) {
  if (k === "0") continue;
  const v = sp(k);
  base(`-m-${k}`, `margin:-${v};`, { responsive: true });
  base(`-mx-${k}`, `margin-left:-${v};margin-right:-${v};`, { responsive: true });
  base(`-my-${k}`, `margin-top:-${v};margin-bottom:-${v};`, { responsive: true });
  base(`-mt-${k}`, `margin-top:-${v};`, { responsive: true });
  base(`-mr-${k}`, `margin-right:-${v};`, { responsive: true });
  base(`-mb-${k}`, `margin-bottom:-${v};`, { responsive: true });
  base(`-ml-${k}`, `margin-left:-${v};`, { responsive: true });
}

// ---------- Sizing ----------
const sizeKeys = ["0","px","0.5","1","1.5","2","2.5","3","3.5","4","5","6","7","8","9","10","11","12","14","16","20","24","28","32","36","40","44","48","52","56","60","64","72","80","96","auto","full","screen","min","max","fit"];
function sizeVal(k) {
  if (k === "auto") return "auto";
  if (k === "full") return "100%";
  if (k === "screen") return "100vw";
  if (k === "min") return "min-content";
  if (k === "max") return "max-content";
  if (k === "fit") return "fit-content";
  return spaceToken(k);
}
for (const k of sizeKeys) {
  base(`w-${k}`, `width:${sizeVal(k)};`);
  base(`h-${k}`, `height:${sizeVal(k)};`);
}
// min/max width/height
for (const k of ["0","full","min","max","fit"]) {
  const v = k === "0" ? "0" : sizeVal(k);
  base(`min-w-${k}`, `min-width:${v};`);
  base(`max-w-${k}`, `max-width:${v};`);
  base(`min-h-${k}`, `min-height:${v};`);
  base(`max-h-${k}`, `max-height:${v};`);
}
// fractional widths
for (const f of [["1/2","50%"],["1/3","33.333333%"],["2/3","66.666667%"],["1/4","25%"],["3/4","75%"],["1/5","20%"],["2/5","40%"],["3/5","60%"],["4/5","80%"],["1/6","16.666667%"],["5/6","83.333333%"],["1/12","8.333333%"],["5/12","41.666667%"],["7/12","58.333333%"],["11/12","91.666667%"]]) {
  base(`w-${f[0]}`, `width:${f[1]};`);
}
base("w-screen", "width:100vw;");
base("h-screen", "height:100vh;");

// ---------- Typography ----------
const textSizes = ["xs","sm","base","lg","xl","2xl","3xl","4xl","5xl","6xl","7xl","8xl","9xl"];
for (const t of textSizes) base(`text-${t}`, `font-size:var(--say-text-${t});line-height:var(--say-leading-${t === "xs" || t === "sm" ? "tight" : "normal"});`, { hover: false });
// line-height overrides
for (const [n,v] of [["leading-none","1"],["leading-tight","1.25"],["leading-snug","1.375"],["leading-normal","1.5"],["leading-relaxed","1.625"],["leading-loose","2"]]) base(n, `line-height:${v};`);
// font weight
const weights = ["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"];
for (const w of weights) base(`font-${w}`, `font-weight:var(--say-font-weight-${w});`);
// font family
base("font-sans", "font-family:var(--say-font-sans);");
base("font-serif", "font-family:var(--say-font-serif);");
base("font-mono", "font-family:var(--say-font-mono);");
// text align
for (const a of ["left","center","right","justify","start","end"]) base(`text-${a}`, `text-align:${a};`);
// text transform
base("uppercase", "text-transform:uppercase;");
base("lowercase", "text-transform:lowercase;");
base("capitalize", "text-transform:capitalize;");
base("normal-case", "text-transform:none;");
// text decoration
base("underline", "text-decoration-line:underline;");
base("overline", "text-decoration-line:overline;");
base("line-through", "text-decoration-line:line-through;");
base("no-underline", "text-decoration-line:none;");
// text overflow / truncate
base("truncate", "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;");
base("text-ellipsis", "text-overflow:ellipsis;");
base("text-clip", "text-overflow:clip;");
base("whitespace-normal", "white-space:normal;");
base("whitespace-nowrap", "white-space:nowrap;");
base("whitespace-pre", "white-space:pre;");
base("whitespace-pre-line", "white-space:pre-line;");
base("whitespace-pre-wrap", "white-space:pre-wrap;");
base("break-normal", "overflow-wrap:normal;word-break:normal;");
base("break-words", "overflow-wrap:break-word;");
base("break-all", "word-break:break-all;");
base("break-keep", "word-break:keep-all;");
// tracking
const trackings = ["tighter","tight","normal","wide","wider","widest"];
for (const t of trackings) base(`tracking-${t}`, `letter-spacing:var(--say-tracking-${t});`);
// italic
base("italic", "font-style:italic;");
base("not-italic", "font-style:normal;");

// ---------- Colors ----------
function colorDecl(prop, val) { return `${prop}:${val};`; }
// text color
for (const hue of hues) {
  for (const sh of shades) {
    base(`text-${hue}-${sh}`, `color:var(--say-color-${hue}-${sh});`, { hover: true, focus: true, dark: true });
  }
}
for (const c of ["success","warning","danger","info"]) {
  base(`text-${c}`, `color:var(--say-color-${c});`, { hover: true, focus: true, dark: true });
}
base("text-inherit", "color:inherit;");
base("text-current", "color:currentColor;");
base("text-transparent", "color:transparent;");

// bg color
for (const hue of hues) {
  for (const sh of shades) {
    base(`bg-${hue}-${sh}`, `background-color:var(--say-color-${hue}-${sh});`, { hover: true, focus: true, dark: true });
  }
}
for (const c of ["success","warning","danger","info"]) {
  base(`bg-${c}`, `background-color:var(--say-color-${c});`, { hover: true, focus: true, dark: true });
}
base("bg-inherit", "background-color:inherit;");
base("bg-current", "background-color:currentColor;");
base("bg-transparent", "background-color:transparent;");

// border color
for (const hue of hues) {
  for (const sh of shades) {
    base(`border-${hue}-${sh}`, `border-color:var(--say-color-${hue}-${sh});`, { hover: true, focus: true, dark: true });
  }
}
for (const c of ["success","warning","danger","info"]) {
  base(`border-${c}`, `border-color:var(--say-color-${c});`, { hover: true, focus: true, dark: true });
}
base("border-inherit", "border-color:inherit;");
base("border-current", "border-color:currentColor;");
base("border-transparent", "border-color:transparent;");

// ---------- Borders ----------
base("border", "border-width:1px;border-style:solid;");
base("border-0", "border-width:0;");
base("border-2", "border-width:2px;");
base("border-4", "border-width:4px;");
base("border-8", "border-width:8px;");
for (const side of ["t","r","b","l"]) {
  base(`border-${side}`, `border-${side === "t" ? "top" : side === "r" ? "right" : side === "b" ? "bottom" : "left"}-width:1px;border-style:solid;`);
  base(`border-${side}-0`, `border-${side === "t" ? "top" : side === "r" ? "right" : side === "b" ? "bottom" : "left"}-width:0;`);
}
base("border-solid", "border-style:solid;");
base("border-dashed", "border-style:dashed;");
base("border-dotted", "border-style:dotted;");
base("border-double", "border-style:double;");
base("border-none", "border-style:none;");
// radius
const radii = ["none","sm","md","lg","xl","2xl","3xl","full"];
for (const r of radii) base(`rounded-${r}`, `border-radius:var(--say-radius-${r});`);
base("rounded", "border-radius:var(--say-radius-md);");
for (const side of ["t","r","b","l","tl","tr","br","bl"]) {
  const map = { t: "top", r: "right", b: "bottom", l: "left", tl: "top-left", tr: "top-right", br: "bottom-right", bl: "bottom-left" };
  for (const r of radii) base(`rounded-${side}-${r}`, `border-${map[side]}-radius:var(--say-radius-${r});`);
}
// divide
base("divide-y", "> * + * { border-top-width:1px; }".replace("> * + *", "& > * + *"));
// simpler: use child combinator via nested? CSS nesting supported. Use &.
base("divide-y", "& > * + * { border-top-width:1px; }");
base("divide-x", "& > * + * { border-left-width:1px; }");
base("divide-y-0", "& > * + * { border-top-width:0; }");
base("divide-x-0", "& > * + * { border-left-width:0; }");

// ---------- Gradients ----------
const gradDirs = { t: "to top", tr: "to top right", r: "to right", br: "to bottom right", b: "to bottom", bl: "to bottom left", l: "to left", tl: "to top left" };
for (const [d, v] of Object.entries(gradDirs)) {
  base(`bg-gradient-to-${d}`, `background-image: linear-gradient(${v}, var(--say-g-from, transparent), var(--say-g-to, transparent));`);
}
for (const hue of hues) {
  for (const sh of shades) {
    base(`from-${hue}-${sh}`, `--say-g-from: var(--say-color-${hue}-${sh});`);
    base(`to-${hue}-${sh}`, `--say-g-to: var(--say-color-${hue}-${sh});`);
  }
}
for (const c of ["success","warning","danger","info","primary"]) {
  base(`from-${c}`, `--say-g-from: var(--say-color-${c});`);
  base(`to-${c}`, `--say-g-to: var(--say-color-${c});`);
}
base("bg-clip-text", "-webkit-background-clip: text; background-clip: text; color: transparent;");

// ---------- Effects ----------
base("shadow-sm", "box-shadow:var(--say-shadow-sm);");
base("shadow", "box-shadow:var(--say-shadow-md);");
base("shadow-md", "box-shadow:var(--say-shadow-md);");
base("shadow-lg", "box-shadow:var(--say-shadow-lg);");
base("shadow-xl", "box-shadow:var(--say-shadow-xl);");
base("shadow-2xl", "box-shadow:var(--say-shadow-2xl);");
base("shadow-inner", "box-shadow:var(--say-shadow-inner);");
base("shadow-none", "box-shadow:var(--say-shadow-none);");
// opacity
for (const o of [0,5,10,20,25,30,40,50,60,70,75,80,90,95,100]) base(`opacity-${o}`, `opacity:${o / 100};`, { hover: true, focus: true, disabled: true, dark: false });
// blur
base("blur-none", "filter:blur(0);");
base("blur-sm", "filter:blur(4px);");
base("blur", "filter:blur(8px);");
base("blur-md", "filter:blur(12px);");
base("blur-lg", "filter:blur(16px);");
base("blur-xl", "filter:blur(24px);");
base("blur-2xl", "filter:blur(40px);");
base("blur-3xl", "filter:blur(64px);");
// backdrop blur
base("backdrop-blur-none", "backdrop-filter:blur(0);");
base("backdrop-blur-sm", "backdrop-filter:blur(4px);");
base("backdrop-blur", "backdrop-filter:blur(8px);");
base("backdrop-blur-md", "backdrop-filter:blur(12px);");
base("backdrop-blur-lg", "backdrop-filter:blur(16px);");
base("backdrop-blur-xl", "backdrop-filter:blur(24px);");
// mix blend
base("mix-blend-normal", "mix-blend-mode:normal;");
base("mix-blend-multiply", "mix-blend-mode:multiply;");
base("mix-blend-screen", "mix-blend-mode:screen;");
base("mix-blend-overlay", "mix-blend-mode:overlay;");
base("mix-blend-darken", "mix-blend-mode:darken;");
base("mix-blend-lighten", "mix-blend-mode:lighten;");
base("mix-blend-color-dodge", "mix-blend-mode:color-dodge;");
base("mix-blend-color-burn", "mix-blend-mode:color-burn;");
base("mix-blend-hard-light", "mix-blend-mode:hard-light;");
base("mix-blend-soft-light", "mix-blend-mode:soft-light;");
base("mix-blend-difference", "mix-blend-mode:difference;");
base("mix-blend-exclusion", "mix-blend-mode:exclusion;");
base("mix-blend-hue", "mix-blend-mode:hue;");
base("mix-blend-saturation", "mix-blend-mode:saturation;");
base("mix-blend-color", "mix-blend-mode:color;");
base("mix-blend-luminosity", "mix-blend-mode:luminosity;");

// ---------- Transforms ----------
base("transform", "transform:translate(var(--say-tw-translate-x,0),var(--say-tw-translate-y,0)) rotate(var(--say-tw-rotate,0)) skewX(var(--say-tw-skew-x,0)) skewY(var(--say-tw-skew-y,0)) scaleX(var(--say-tw-scale-x,1)) scaleY(var(--say-tw-scale-y,1));");
base("transform-gpu", "transform:translate3d(var(--say-tw-translate-x,0),var(--say-tw-translate-y,0),0) rotate(var(--say-tw-rotate,0)) skewX(var(--say-tw-skew-x,0)) skewY(var(--say-tw-skew-y,0)) scaleX(var(--say-tw-scale-x,1)) scaleY(var(--say-tw-scale-y,1));");
base("transform-none", "transform:none;");
// scale
for (const s of [0,50,75,90,95,100,105,110,125,150]) base(`scale-${s}`, `--say-tw-scale-x:${s/100};--say-tw-scale-y:${s/100};transform:scale(${s/100});`);
base("scale-x-0", "--say-tw-scale-x:0;transform:scaleX(0);");
base("scale-y-0", "--say-tw-scale-y:0;transform:scaleY(0);");
// rotate
for (const r of [0,1,2,3,6,12,45,90,180]) base(`rotate-${r}`, `transform:rotate(${r}deg);`);
base("rotate-0", "transform:rotate(0deg);");
// translate
for (const k of spaceKeys) {
  base(`translate-x-${k}`, `transform:translateX(${spaceToken(k)});`);
  base(`translate-y-${k}`, `transform:translateY(${spaceToken(k)});`);
}
for (const k of spaceKeys) {
  if (k === "0") continue;
  const v = sp(k);
  base(`-translate-x-${k}`, `transform:translateX(-${v});`);
  base(`-translate-y-${k}`, `transform:translateY(-${v});`);
}
base("translate-x-1/2", "transform:translateX(50%);");
base("translate-x-full", "transform:translateX(100%);");
base("translate-y-1/2", "transform:translateY(50%);");
base("translate-y-full", "transform:translateY(100%);");
// skew
for (const r of [0,1,2,3,6,12]) {
  base(`skew-x-${r}`, `transform:skewX(${r}deg);`);
  base(`skew-y-${r}`, `transform:skewY(${r}deg);`);
}
// origin
for (const o of ["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left"]) base(`origin-${o}`, `transform-origin:${o.replace("-", " ")};`);

// ---------- Transitions / Animation ----------
base("transition-none", "transition-property:none;");
base("transition-all", "transition-property:all;transition-timing-function:var(--say-ease-in-out);transition-duration:150ms;");
base("transition", "transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:var(--say-ease-in-out);transition-duration:150ms;");
base("transition-colors", "transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:var(--say-ease-in-out);transition-duration:150ms;");
base("transition-opacity", "transition-property:opacity;transition-timing-function:var(--say-ease-in-out);transition-duration:150ms;");
base("transition-shadow", "transition-property:box-shadow;transition-timing-function:var(--say-ease-in-out);transition-duration:150ms;");
base("transition-transform", "transition-property:transform;transition-timing-function:var(--say-ease-in-out);transition-duration:150ms;");
for (const d of [75,100,150,200,300,500,700,1000]) base(`duration-${d}`, `transition-duration:${d}ms;`);
for (const e of ["linear","in","out","in-out"]) base(`ease-${e}`, `transition-timing-function:var(--say-ease-${e});`);
for (const d of [75,100,150,200,300,500,700,1000]) base(`delay-${d}`, `transition-delay:${d}ms;`);
// animate
base("animate-none", "animation:none;");
base("animate-spin", "animation:say-spin 1s linear infinite;");
base("animate-ping", "animation:say-ping 1s cubic-bezier(0,0,0.2,1) infinite;");
base("animate-pulse", "animation:say-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite;");
base("animate-bounce", "animation:say-bounce 1s infinite;");

// ---------- Interactivity ----------
for (const c of ["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out"]) base(`cursor-${c}`, `cursor:${c};`);
base("pointer-events-none", "pointer-events:none;");
base("pointer-events-auto", "pointer-events:auto;");
base("select-none", "user-select:none;");
base("select-text", "user-select:text;");
base("select-all", "user-select:all;");
base("select-auto", "user-select:auto;");
base("resize-none", "resize:none;");
base("resize", "resize:both;");
base("resize-y", "resize:vertical;");
base("resize-x", "resize:horizontal;");
base("scroll-smooth", "scroll-behavior:smooth;");
base("scroll-auto", "scroll-behavior:auto;");
// snap
base("snap-start", "scroll-snap-align:start;");
base("snap-end", "scroll-snap-align:end;");
base("snap-center", "scroll-snap-align:center;");
base("snap-align-none", "scroll-snap-align:none;");
base("snap-x", "scroll-snap-type:x var(--say-tw-scroll-snap-strictness,mandatory);");
base("snap-y", "scroll-snap-type:y var(--say-tw-scroll-snap-strictness,mandatory);");
base("snap-both", "scroll-snap-type:both var(--say-tw-scroll-snap-strictness,mandatory);");
base("snap-mandatory", "--say-tw-scroll-snap-strictness:mandatory;");
base("snap-proximity", "--say-tw-scroll-snap-strictness:proximity;");
// touch
base("touch-auto", "touch-action:auto;");
base("touch-none", "touch-action:none;");
base("touch-pan-x", "touch-action:pan-x;");
base("touch-pan-y", "touch-action:pan-y;");
base("touch-pan-left", "touch-action:pan-left;");
base("touch-pan-right", "touch-action:pan-right;");
base("touch-pan-up", "touch-action:pan-up;");
base("touch-pan-down", "touch-action:pan-down;");
base("touch-pinch-zoom", "touch-action:pinch-zoom;");
base("touch-manipulation", "touch-action:manipulation;");

// ---------- Aspect ratio ----------
base("aspect-auto", "aspect-ratio:auto;");
base("aspect-square", "aspect-ratio:1 / 1;");
base("aspect-video", "aspect-ratio:16 / 9;");

// ---------- Container queries ----------
base("container", "container-type:inline-size;");
base("container-inline", "container-type:inline-size;");
base("container-size", "container-type:size;");
base("container-normal", "container-type:normal;");

// ---------- Outline / Ring ----------
base("outline-none", "outline:2px solid transparent;outline-offset:2px;");
base("outline", "outline-style:solid;");
base("outline-dashed", "outline-style:dashed;");
base("outline-dotted", "outline-style:dotted;");
base("outline-double", "outline-style:double;");
base("ring-0", "box-shadow:var(--say-shadow-none);");
base("ring-1", "box-shadow:0 0 0 1px var(--say-color-ring);");
base("ring-2", "box-shadow:0 0 0 2px var(--say-color-ring);");
base("ring-4", "box-shadow:0 0 0 4px var(--say-color-ring);");
base("ring-8", "box-shadow:0 0 0 8px var(--say-color-ring);");
base("ring-inset", "box-shadow:inset 0 0 0 1px var(--say-color-ring);");
for (const hue of hues) {
  for (const sh of shades) {
    base(`ring-${hue}-${sh}`, `--say-color-ring: var(--say-color-${hue}-${sh});`);
  }
}
base("ring-offset-0", "--say-tw-ring-offset-width:0px;");
base("ring-offset-1", "--say-tw-ring-offset-width:1px;");
base("ring-offset-2", "--say-tw-ring-offset-width:2px;");
base("ring-offset-4", "--say-tw-ring-offset-width:4px;");
base("ring-offset-8", "--say-tw-ring-offset-width:8px;");

// ---------- Object fit/position ----------
for (const o of ["contain","cover","fill","none","scale-down"]) base(`object-${o}`, `object-fit:${o};`);
base("object-bottom", "object-position:bottom;");
base("object-center", "object-position:center;");
base("object-left", "object-position:left;");
base("object-left-bottom", "object-position:left bottom;");
base("object-left-top", "object-position:left top;");
base("object-right", "object-position:right;");
base("object-right-bottom", "object-position:right bottom;");
base("object-right-top", "object-position:right top;");
base("object-top", "object-position:top;");

// ---------- List ----------
base("list-none", "list-style-type:none;");
base("list-disc", "list-style-type:disc;");
base("list-decimal", "list-style-type:decimal;");
base("list-inside", "list-style-position:inside;");
base("list-outside", "list-style-position:outside;");

// ---------- Table ----------
base("table-auto", "table-layout:auto;");
base("table-fixed", "table-layout:fixed;");
base("border-collapse", "border-collapse:collapse;");
base("border-separate", "border-collapse:separate;");

// ---------- Appearance ----------
base("appearance-none", "appearance:none;");
base("appearance-auto", "appearance:auto;");

// ---------- Will change ----------
base("will-change-auto", "will-change:auto;");
base("will-change-scroll", "will-change:scroll-position;");
base("will-change-contents", "will-change:contents;");
base("will-change-transform", "will-change:transform;");

// ---------- Keyframes (append at end) ----------
const keyframes = `
@keyframes say-spin { to { transform: rotate(360deg); } }
@keyframes say-ping { 75%,100% { transform: scale(2); opacity: 0; } }
@keyframes say-pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }
@keyframes say-bounce { 0%,100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8,0,1,1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0,0,0.2,1); } }
`;

const header = MODE === "container"
  ? "/* Say CSS — generated container-query variants. Regenerate: MODE=container OUT=src/container-variants.css node scripts/gen-utilities.mjs */\n"
  : "/* Say CSS — generated utilities. Do not edit by hand. Regenerate: node scripts/gen-utilities.mjs */\n";
if (MODE !== "container") rules.push(...variantRules);
const css = header + rules.join("\n") + "\n" + (MODE === "container" ? "" : keyframes);
writeFileSync(join(ROOT, OUT_FILE), css);
console.log("Generated", rules.length, "rules ->", OUT_FILE);
