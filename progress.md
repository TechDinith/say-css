# Say CSS — Progress Tracker

This file tracks Phase 1 (utility classes, Tailwind-like) build progress.
Update it after every step. If work is interrupted, resume from the first
step not marked DONE.

## Status legend
- TODO: not started
- IN_PROGRESS: currently working
- DONE: finished and verified
- BLOCKED: needs decision

## Current step
Phase 1 complete — ready for user review / push

## Phase 1 steps

| # | Step | Status |
|---|------|--------|
| 1 | Scaffold repo structure, package.json, LICENSE, README, progress | DONE |
| 2 | Core architecture: @layer order, tokens (CSS vars), base reset | DONE |
| 3 | Layout utilities (display, flex, grid, position, sizing, overflow) | DONE |
| 4 | Spacing utilities (margin, padding, gap) + responsive prefixes | DONE |
| 5 | Typography utilities (size, weight, align, color, line-height) | DONE |
| 6 | Color & background & border utilities | DONE |
| 7 | Effects utilities (shadow, radius, opacity, transform, transition, animation) | DONE |
| 8 | Forms & interactive utilities (cursor, pointer, select, scroll) | DONE |
| 9 | Variant engine (hover/focus/active/disabled/dark/responsive/container) | DONE |
| 10 | Dark mode (system + manual toggle, light-dark()) | DONE |
| 11 | Container queries (@container) | DONE (container-type + optional variants bundle) |
| 12 | Arbitrary values support (p-[13px]) | DONE (JIT compiler: scripts/jit.mjs) |
| 13 | Build pipeline (LightningCSS) + drop-in bundle + npm publish config | DONE (LightningCSS minify + JIT integrated) |
| 14 | Backward-compat fallback layer (older browsers) | DONE |
| 15 | Editor DX (VS Code extension + TS types for class names) | DONE (TS types + VS Code scaffold) |
| 16 | Examples + docs + finalize README | DONE |

## Phase 2 (later, not now)
- Styled reusable components (btn, card, modal, etc.) using data-* variants
- Themes package
- Plugin system

## Notes / decisions
- npm scope: @say-css (core package @say-css/core)
- Class prefix: none (rely on @layer)
- Dark mode: both system + manual
- Customization: CSS vars + optional config
- Browser: modern + compat layer (removable later)
- License: MIT
- Phase 1 scope: utilities only
