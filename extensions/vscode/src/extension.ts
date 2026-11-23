import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

let classNames: string[] = [];

function loadClasses(context: vscode.ExtensionContext) {
  try {
    const dataPath = path.join(context.extensionPath, "data", "classes.json");
    const raw = fs.readFileSync(dataPath, "utf8");
    classNames = JSON.parse(raw);
  } catch (e) {
    classNames = [];
  }
}

export function activate(context: vscode.ExtensionContext) {
  loadClasses(context);

  const provider = vscode.languages.registerCompletionItemProvider(
    ["html", "javascript", "javascriptreact", "typescript", "typescriptreact", "vue", "svelte"],
    {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position).text;
        const before = line.slice(0, position.character);
        // trigger inside class="..." or className="..."
        if (!/(class|className)\s*=\s*["'`][^"'`]*$/.test(before)) return undefined;
        return classNames.map((c) => {
          const item = new vscode.CompletionItem(c, vscode.CompletionItemKind.Value);
          item.insertText = c;
          return item;
        });
      },
    },
    " ", "-", ":", "["
  );

  context.subscriptions.push(provider);
}

export function deactivate() {}
