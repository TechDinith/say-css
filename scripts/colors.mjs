// scripts/colors.mjs
// Shared color system for Say CSS (OKLCH-based, Tailwind-like hues).

export const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

export const hueMap = {
  slate:   { h: 215, c: 0.018 },
  gray:    { h: 220, c: 0.012 },
  zinc:    { h: 220, c: 0.008 },
  neutral: { h: 0,   c: 0 },
  stone:   { h: 30,  c: 0.012 },
  red:     { h: 25,  c: 0.20 },
  orange:  { h: 45,  c: 0.18 },
  amber:   { h: 75,  c: 0.16 },
  yellow:  { h: 95,  c: 0.16 },
  lime:    { h: 120, c: 0.16 },
  green:   { h: 145, c: 0.17 },
  emerald: { h: 160, c: 0.16 },
  teal:    { h: 180, c: 0.14 },
  cyan:    { h: 200, c: 0.14 },
  sky:     { h: 220, c: 0.14 },
  blue:    { h: 260, c: 0.22 },
  indigo:  { h: 275, c: 0.20 },
  violet:  { h: 290, c: 0.20 },
  purple:  { h: 305, c: 0.20 },
  fuchsia: { h: 320, c: 0.22 },
  pink:    { h: 350, c: 0.20 },
  rose:    { h: 15,  c: 0.18 },
};

export const hues = Object.keys(hueMap);

const L = { 50:0.985,100:0.965,200:0.92,300:0.86,400:0.7,500:0.55,600:0.45,700:0.37,800:0.28,900:0.2,950:0.13 };
const CF = { 50:0.15,100:0.25,200:0.4,300:0.6,400:0.85,500:1,600:0.95,700:0.85,800:0.7,900:0.5,950:0.35 };

export function oklch(hueName, shade) {
  const { h, c } = hueMap[hueName];
  const l = L[shade];
  const cc = c * CF[shade];
  if (c === 0) return `oklch(${l} 0 0)`;
  return `oklch(${l} ${cc.toFixed(4)} ${h})`;
}

// Semantic aliases
export const primaryHue = "blue";
export const neutralHue = "slate";
