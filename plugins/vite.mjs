// plugins/vite.mjs
// Vite plugin for Say CSS: auto-generates JIT CSS for arbitrary values.
// Usage in vite.config.js:
//   import sayCss from "@say-css/core/vite";
//   export default defineConfig({ plugins: [sayCss()] });

import { scanClasses, generateCss } from "../scripts/jit.mjs";

const VIRTUAL_ID = "virtual:say-css-jit";
const RESOLVED_ID = "\0" + VIRTUAL_ID;

export default function sayCss(options = {}) {
  const root = options.root || process.cwd();
  let css = "/* Say CSS JIT: no arbitrary classes yet */\n";
  let server = null;

  function regenerate() {
    try {
      const classes = scanClasses(root);
      css = generateCss(classes);
      if (server) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      }
    } catch (e) {
      // ignore
    }
  }

  return {
    name: "say-css",
    enforce: "pre",
    configResolved() {
      regenerate();
    },
    buildStart() {
      regenerate();
    },
    configureServer(srv) {
      server = srv;
      // watch source files
      srv.watcher.on("change", (file) => {
        if (/\.(html|jsx|tsx|vue|svelte|js|ts)$/.test(file)) regenerate();
      });
      srv.watcher.on("add", (file) => {
        if (/\.(html|jsx|tsx|vue|svelte|js|ts)$/.test(file)) regenerate();
      });
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id === RESOLVED_ID) return css;
    },
    transform(code, id) {
      if (/[\\/]main\.(jsx|tsx|js|ts)$/.test(id)) {
        // Inject base CSS import only; JIT is inlined via transformIndexHtml
        return `import "@say-css/core";\n` + code;
      }
      return null;
    },
    transformIndexHtml(html) {
      return html.replace("</head>", `<style id="say-css-jit">${css}</style></head>`);
    },
  };
}
