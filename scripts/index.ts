const args = process.argv.slice(2);
const command = args[0];
const param = args[1];

if (!command || !param) {
  console.error("Uso: bun run generate <comando> <nome>");
  process.exit(1);
}

switch (command) {
  case "component":
    import("./generate/component.ts").then((mod) =>
      mod.generateComponent(param)
    );
    break;
  default:
    console.error(`Comando desconhecido: ${command}`);
    process.exit(1);
}
