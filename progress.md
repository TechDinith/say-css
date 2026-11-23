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
Step 3 — Layout utilities (TODO, awaiting go-ahead)

## Phase 1 steps

| # | Step | Status |
|---|------|--------|
| 1 | Scaffold repo structure, package.json, LICENSE, README, progress | DONE |
| 2 | Core architecture: @layer order, tokens (CSS vars), base reset | DONE |
| 3 | Layout utilities (display, flex, grid, position, sizing, overflow) | TODO |
| 4 | Spacing utilities (margin, padding, gap) + responsive prefixes | TODO |
| 5 | Typography utilities (size, weight, align, color, line-height) | TODO |
| 6 | Color & background & border utilities | TODO |
| 7 | Effects utilities (shadow, radius, opacity, transform, transition, animation) | TODO |
| 8 | Forms & interactive utilities (cursor, pointer, select, scroll) | TODO |
| 9 | Variant engine (hover/focus/active/disabled/dark/responsive/container) | TODO |
| 10 | Dark mode (system + manual toggle, light-dark()) | TODO |
| 11 | Container queries (@container) | TODO |
| 12 | Arbitrary values support (p-[13px]) | TODO |
| 13 | Build pipeline (LightningCSS) + drop-in bundle + npm publish config | TODO |
| 14 | Backward-compat fallback layer (older browsers) | TODO |
| 15 | Editor DX (VS Code extension + TS types for class names) | TODO |
| 16 | Examples + docs + finalize README | TODO |

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
