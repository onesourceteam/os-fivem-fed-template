const { basename, join } = require("path");
const { mkdirSync, writeFileSync, existsSync } = require("fs");

function toPascalCase(str) {
  return str.replace(/(^\w|[-_/]\w)/g, (match) =>
    match.replace(/[-_/]/, "").toUpperCase()
  );
}

function generateProvider(input) {
  const cleanedInput = input.replace(/\/$/, "");
  const fileName = basename(cleanedInput);
  const providerName = `${toPascalCase(fileName)}Provider`;

  const folderPath = join(process.cwd(), "src", "integrations", "providers");

  const outputFile = join(folderPath, `${fileName}.provider.tsx`);

  const template = `export function ${providerName}({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`;

  try {
    mkdirSync(folderPath, { recursive: true });

    if (existsSync(outputFile)) {
      console.error(`⚠️ Arquivo já existe: ${outputFile}`);
      process.exit(1);
    }

    writeFileSync(outputFile, template);
    console.log(`✅ Provider criado com sucesso em: ${outputFile}`);
  } catch (err) {
    console.error("Erro ao gerar provider:", err);
    process.exit(1);
  }
}

module.exports = { generateProvider };
