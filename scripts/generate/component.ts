import { basename, dirname, join } from "path";
import { mkdirSync, writeFileSync } from "fs";

export function generateComponent(name: string) {
  const relativePath = name;
  const fullPath = join(process.cwd(), "src", relativePath);

  const folderPath = dirname(join("src/components", fullPath));
  const fileName = basename(relativePath);

  const componentName = fileName.charAt(0).toUpperCase() + fileName.slice(1);

  const outputFile = join(folderPath, `${fileName}.component.tsx`);

  const componentTemplate = (
    componentName: string
  ) => `type ${componentName}PropsType = {
  // Defina suas props aqui
}

export const ${componentName}Component = ({}: ${componentName}PropsType) => {
  return (
    <div data-testid="${componentName}">
      ${componentName}
    </div>
  );
};
`;

  try {
    mkdirSync(folderPath, { recursive: true });
  } catch (err) {
    console.error(`Erro ao criar o diretório ${folderPath}:`, err);
    process.exit(1);
  }

  try {
    writeFileSync(outputFile, componentTemplate(componentName));
    console.log(`✅ Componente criado com sucesso em: ${outputFile}`);
  } catch (err) {
    console.error(`Erro ao escrever no arquivo ${outputFile}:`, err);
    process.exit(1);
  }
}
