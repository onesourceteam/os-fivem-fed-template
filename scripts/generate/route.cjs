const { join, dirname } = require("path");
const { mkdirSync, writeFileSync, existsSync, renameSync } = require("fs");

function toPascalCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_/]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function normalizeRoutePath(input) {
  let route = input.startsWith("/") ? input : `/${input}`;
  if (route.length > 1) route = route.replace(/\/$/, "");
  return route;
}

function routeComponentName(route) {
  if (route === "/") return "IndexRoute";
  const parts = route.replace(/^\//, "").split("/").filter(Boolean);
  return `${toPascalCase(parts.join("-"))}Route`;
}

function safeWrite(filePath, content) {
  if (existsSync(filePath)) return false;
  writeFileSync(filePath, content);
  return true;
}

function routeToFile(route) {
  if (route === "/") return "index.tsx";
  return `${route.replace(/^\//, "")}.tsx`;
}

function routeToFolderIndex(route) {
  if (route === "/") return "index.tsx";
  return join(route.replace(/^\//, ""), "index.tsx");
}

function routeHasParent(route) {
  return route.replace(/^\//, "").split("/").filter(Boolean).length > 1;
}

function promoteToIndex(route, routesDir) {
  const fileRel = routeToFile(route);
  const indexRel = routeToFolderIndex(route);

  const filePath = join(routesDir, fileRel);
  const indexPath = join(routesDir, indexRel);

  if (!existsSync(filePath)) return;
  if (existsSync(indexPath)) return;

  mkdirSync(dirname(indexPath), { recursive: true });
  renameSync(filePath, indexPath);

  console.log(`✅ Arquivo promovido para index.tsx: ${indexPath}`);
}

function ensureParentIndex(route, routesDir) {
  const parts = route.replace(/^\//, "").split("/").filter(Boolean);
  if (parts.length <= 1) return;

  const parentRoute = `/${parts[0]}`;

  const parentFile = join(routesDir, `${parts[0]}.tsx`);
  const parentIndex = join(routesDir, parts[0], "index.tsx");

  if (existsSync(parentIndex)) return;

  if (existsSync(parentFile)) {
    mkdirSync(join(routesDir, parts[0]), { recursive: true });
    renameSync(parentFile, parentIndex);
    console.log(`✅ Arquivo promovido para index.tsx: ${parentIndex}`);
    return;
  }

  const parentComponent = routeComponentName(parentRoute);

  const content = `import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("${parentRoute}")({
  component: ${parentComponent},
});

function ${parentComponent}() {
  return <Outlet />;
}
`;

  mkdirSync(join(routesDir, parts[0]), { recursive: true });
  safeWrite(parentIndex, content);
  console.log(`✅ Parent route criada com Outlet em: ${parentIndex}`);
}

function generateRoute(input) {
  const route = normalizeRoutePath(input);
  const routesDir = join(process.cwd(), "src", "routes");

  if (routeHasParent(route)) {
    ensureParentIndex(route, routesDir);
  }

  const parts = route.replace(/^\//, "").split("/").filter(Boolean);

  for (let i = 1; i < parts.length; i++) {
    const parent = `/${parts.slice(0, i).join("/")}`;
    promoteToIndex(parent, routesDir);
  }

  const relFile = routeHasParent(route)
    ? join(parts[0], `${parts.slice(1).join("/")}.tsx`)
    : routeToFile(route);

  const outputFile = join(routesDir, relFile);

  mkdirSync(dirname(outputFile), { recursive: true });

  if (existsSync(outputFile)) {
    console.error(`⚠️ Arquivo já existe: ${outputFile}`);
    process.exit(1);
  }

  const componentName = routeComponentName(route);

  const content = `import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("${route}")({
  component: ${componentName},
});

function ${componentName}() {
  return <></>;
}
`;

  writeFileSync(outputFile, content);
  console.log(`✅ Rota criada com sucesso em: ${outputFile}`);
}

module.exports = { generateRoute };
