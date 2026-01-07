#!/usr/bin/env node

const { execSync } = require("child_process");

const { generateComponent } = require("./component.cjs");
const { generateProvider } = require("./provider.cjs");
const { generateStore } = require("./store.cjs");
const { generateRoute } = require("./route.cjs");

const command = process.argv[2];
const param = process.argv[3];
const flags = process.argv.slice(4);

if (!command || !param) {
  console.error(
    "Uso: node scripts/generate/index.cjs <comando> <nome> [flags]"
  );
  process.exit(1);
}

function getFlagValue(flagName) {
  const idx = flags.indexOf(flagName);
  if (idx === -1) return null;
  return flags[idx + 1] || null;
}

switch (command) {
  case "component":
    generateComponent(param);
    break;

  case "provider":
    generateProvider(param);
    break;

  case "store":
    generateStore(param, {
      withTypes: flags.includes("--types"),
      primitiveType: getFlagValue("--type"),
    });
    break;

  case "route":
    generateRoute(param);

    try {
      execSync("npm run generate-routes", { stdio: "inherit" });
    } catch (err) {
      console.error("⚠️ Falhou ao rodar `npm run generate-routes`.");
      process.exit(1);
    }
    break;

  default:
    console.error(`Comando desconhecido: ${command}`);
    process.exit(1);
}
