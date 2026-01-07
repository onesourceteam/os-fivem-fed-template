const { join } = require("path");
const { mkdirSync, writeFileSync, existsSync } = require("fs");

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function toPascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toUpperCase());
}

function toCamelCase(str) {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function safeWrite(filePath, content) {
  if (existsSync(filePath)) {
    console.error(`⚠️ Arquivo já existe: ${filePath}`);
    process.exit(1);
  }
  writeFileSync(filePath, content);
}

function isValidPrimitive(type) {
  return ["string", "number", "boolean"].includes(type);
}

function defaultValueFor(type) {
  if (type === "string") return `"0, 0, 0"`;
  if (type === "number") return `0`;
  if (type === "boolean") return `false`;
  return "undefined";
}

function generateStore(name, options = {}) {
  const { withTypes = false, primitiveType = null } = options;

  const kebabName = toKebabCase(name); // kebab-case
  const camelName = toCamelCase(name); // camelCase
  const pascalName = toPascalCase(name); // PascalCase

  const storeConst = `${camelName}Store`;
  const interfaceName = `${pascalName}Interface`;

  const baseDir = join(process.cwd(), "src", "stores");

  if (!withTypes) {
    const filePath = join(baseDir, `${kebabName}.store.ts`);

    const type =
      primitiveType && isValidPrimitive(primitiveType) ? primitiveType : null;

    const value = type ? defaultValueFor(type) : "undefined";

    const generic = type ? `<${type}>` : "";

    const content = `import { Store } from "@tanstack/react-store";

export const ${storeConst} = new Store${generic}(${value});
`;

    mkdirSync(baseDir, { recursive: true });
    safeWrite(filePath, content);

    console.log(`✅ Store criada com sucesso em: ${filePath}`);
    return;
  }

  const folderPath = join(baseDir, kebabName);
  const indexFile = join(folderPath, "index.ts");
  const interfacesFile = join(folderPath, `${kebabName}.interfaces.ts`);
  const storeFile = join(folderPath, `${kebabName}.store.ts`);

  mkdirSync(folderPath, { recursive: true });

  const interfacesContent = `export type ${interfaceName} = unknown;
`;

  const storeContent = `import { Store } from "@tanstack/react-store";
import type { ${interfaceName} } from "./${kebabName}.interfaces";

export const ${storeConst} = new Store<${interfaceName}>(undefined);
`;

  const indexContent = `export * from "./${kebabName}.interfaces";
export * from "./${kebabName}.store";
`;

  safeWrite(interfacesFile, interfacesContent);
  safeWrite(storeFile, storeContent);
  safeWrite(indexFile, indexContent);

  console.log(`✅ Store criada com sucesso em: ${folderPath}`);
}

module.exports = { generateStore };
