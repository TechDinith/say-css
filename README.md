# Say CSS

Utility-first CSS library for modern web apps (React, Next, Vite, Vue, Svelte, plain HTML).

- **Zero config:** drop in one file or `import "@say-css/core"` — works immediately.
- **Modern CSS:** cascade layers, OKLCH colors (full Tailwind-like palette), gradients, nesting, `:has()`, container queries.
- **Customizable:** override `--say-*` CSS variables anywhere (even inline).
- **Dark mode built in:** follows system + manual toggle.
- **Backward compatible:** small fallback layer you can delete when ready.
- **Editor DX:** ships TS types (`SayClass`) for autocomplete.

## Install

**Vite (zero-config):**
```bash
npm install @say-css/core
```
```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sayCss from "@say-css/core/vite";
export default defineConfig({ plugins: [react(), sayCss()] });
```
That's it — base CSS + JIT arbitrary values are injected automatically. No imports needed.

**Drop-in (no build step):**
```html
<link rel="stylesheet" href="say.min.css" />
```

**Other frameworks (Next, CRA, Vue CLI):**
```js
import "@say-css/core";
```

## Usage

```html
<button class="px-4 py-2 bg-primary-500 text-white rounded-lg shadow hover:bg-primary-600 transition-colors">
  Click me
</button>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="p-4 bg-white rounded-xl shadow-sm border border-neutral-200">Card</div>
</div>
```

## Customize

Override tokens in your CSS:
```css
:root {
  --say-color-primary-500: oklch(0.6 0.2 30); /* make primary orange */
  --say-space-4: 1.25rem;
}
```
Or locally:
```html
<section style="--say-color-primary-500: coral;">...</section>
```

## Dark mode

Automatic via `prefers-color-scheme`. Manual toggle:
```html
<html class="dark">   <!-- or data-theme="dark" -->
```

## Responsive & states

Prefixes: `sm:` `md:` `lg:` `xl:` `2xl:` (min-width). States: `hover:` `focus:` `active:` `disabled:` `dark:`.

```html
<div class="text-sm md:text-lg hover:text-primary-600 dark:bg-neutral-900">...</div>
```

## Build (optional, smaller output)

```bash
npm run build        # inlines + minifies -> dist/say.min.css
npm run gen:utilities # regenerate utility classes
```

## Container-query variants (optional)

Import the optional bundle to use `@sm:` `@md:` `@lg:` `@xl:` `@2xl:` prefixes based on the nearest container:
```js
import "@say-css/core/container-variants.css";
```
```html
<div class="container">
  <div class="@md:flex @lg:grid-cols-2">...</div>
</div>
```

## Editor support

A VS Code extension scaffold lives in `extensions/vscode/`. Compile with `npm run compile` (in that folder) after installing deps. TS types (`SayClass`) are in `types/`.

## Vite plugin (auto JIT)

Install and add to `vite.config.js`:
```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sayCss from "@say-css/core/vite";
export default defineConfig({ plugins: [react(), sayCss()] });
```
Arbitrary values are now generated automatically during dev and build — no manual JIT step.

## Modern recipes (copy-paste)

```html
<!-- Primary button -->
<button class="px-5 py-2.5 bg-primary-500 text-white font-medium rounded-lg shadow-md hover:bg-primary-600 hover:shadow-lg focus:ring-2 focus:ring-primary-300 transition-all">
  Get started
</button>

<!-- Glass card -->
<div class="p-6 rounded-2xl bg-white/70 backdrop-blur-lg border border-white/20 shadow-xl">
  <h3 class="text-xl font-semibold text-neutral-900">Glass card</h3>
  <p class="text-neutral-600 mt-2">Modern frosted look.</p>
</div>

<!-- Gradient hero -->
<section class="py-20 px-6 text-center bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-3xl">
  <h1 class="text-5xl font-extrabold tracking-tight">Build faster</h1>
  <p class="mt-4 text-primary-100 text-lg">Utility-first, modern, zero-config.</p>
</section>
```

`src/compat.css` contains fallbacks for older browsers. Delete the import in `src/index.css` once you no longer need them.

## License

MIT
