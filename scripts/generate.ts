import { basename, dirname, join } from "path";
import { mkdirSync, writeFileSync } from "fs";

const componentTemplate = (
  componentName: string
) => `type ${componentName}PropsType = {
  // Defina suas props aqui
}

export const ${componentName}Component = ({}: ${componentName}Props) => {
  return (
    <div data-testid="${componentName}">
      ${componentName}
    </div>
  );
};
`;

function main() {
  const args = process.argv.slice(2);
  const entityType = args[0];
  const relativePath = args[1];

  if (entityType !== "component" || !relativePath) {
    console.error("Uso: bun run generate component <caminho/nome_do_arquivo>");
    console.error("Exemplo: bun run generate component components/Botao");
    process.exit(1);
  }

  const fullPath = join(process.cwd(), "src", relativePath);

  const folderPath = dirname(fullPath);
  const fileName = basename(relativePath);

  const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  const outputFile = join(folderPath, `${fileName}.component.tsx`);

  try {
    mkdirSync(folderPath, { recursive: true });
  } catch (err) {
    console.error(`Erro ao criar o diretório ${folderPath}:`, err);
    process.exit(1);
  }

  const content = componentTemplate(componentName);
  try {
    writeFileSync(outputFile, content);
    console.log(`✅ Componente criado com sucesso em: ${outputFile}`);
  } catch (err) {
    console.error(`Erro ao escrever no arquivo ${outputFile}:`, err);
    process.exit(1);
  }
}

main();
