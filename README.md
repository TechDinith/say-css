# Say CSS

**Say CSS** is a utility-first CSS library for modern web apps (React, Next, Vite, Vue, Svelte, plain HTML).

- **Zero config:** drop in one file or install via npm and it just works.
- **Modern CSS:** cascade layers, nesting, `:has()`, container queries, OKLCH colors.
- **Highly customizable:** override CSS variables anywhere (`--say-color-primary`).
- **Dark mode built in:** system + manual toggle.
- **Backward compatible:** small fallback layer you can delete when ready.
- **Editor DX:** VS Code autocomplete + TS types.

## Why

Existing CSS libraries (Tailwind, Bootstrap) often require build steps, long class chains, specificity fights, and heavy docs. Say CSS aims to be simpler, faster, and more advanced by leaning on modern CSS features that now have universal browser support.

## Install (Phase 1 — in progress)

Drop-in:
```html
<link rel="stylesheet" href="say.css" />
```

npm:
```bash
npm install @say-css/core
```
```js
import "@say-css/core";
```

## Docs

Full documentation is being written during Phase 1. See `progress.md` for current status.
