const { basename, dirname, join } = require("path");
const { mkdirSync, writeFileSync, existsSync } = require("fs");

function toPascalCase(str) {
  return str.replace(/(^\w|[-_/]\w)/g, (match) =>
    match.replace(/[-_/]/, "").toUpperCase()
  );
}

function generateComponent(input) {
  const isFolder = input.endsWith("/");

  // remove a "/" do final caso exista
  const cleanedInput = input.replace(/\/$/, "");

  const fileName = basename(cleanedInput); // ex: button
  const componentName = toPascalCase(fileName); // Button

  const baseDir = join(process.cwd(), "src", "components");

  let folderPath;
  let outputFile;

  if (isFolder) {
    // src/components/ui/button/index.tsx
    folderPath = join(baseDir, cleanedInput);
    outputFile = join(folderPath, "index.tsx");
  } else {
    // src/components/ui/button.component.jsx
    folderPath = join(baseDir, dirname(cleanedInput));
    outputFile = join(folderPath, `${fileName}.component.jsx`);
  }

  const templateTSX = `type ${componentName}PropsType = {
  // Defina suas props aqui
};

export function ${componentName}Component({}: ${componentName}PropsType) {
  return (
    <div data-testid="${componentName}">
      ${componentName}
    </div>
  );
}
`;

  const templateJSX = `export function ${componentName}Component() {
  return (
    <div data-testid="${componentName}">
      ${componentName}
    </div>
  );
}
`;

  const template = isFolder ? templateTSX : templateJSX;

  try {
    mkdirSync(folderPath, { recursive: true });

    if (existsSync(outputFile)) {
      console.error(`⚠️ Arquivo já existe: ${outputFile}`);
      process.exit(1);
    }

    writeFileSync(outputFile, template);
    console.log(`✅ Componente criado com sucesso em: ${outputFile}`);
  } catch (err) {
    console.error("Erro ao gerar componente:", err);
    process.exit(1);
  }
}

module.exports = { generateComponent };
