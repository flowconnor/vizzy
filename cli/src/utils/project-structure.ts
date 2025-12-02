import path from "path";
import fs from "fs-extra";

export interface ProjectPathChoice {
  name: string;
  value: string;
  short: string;
}

export async function detectProjectStructure(projectPath: string): Promise<ProjectPathChoice[]> {
  const paths: ProjectPathChoice[] = [];

  if (await fs.pathExists(path.join(projectPath, "app"))) {
    paths.push({
      name: "app/vizzy",
      value: "app/vizzy",
      short: "app/vizzy",
    });

    if (await fs.pathExists(path.join(projectPath, "app/components"))) {
      paths.push({
        name: "app/components/vizzy",
        value: "app/components/vizzy",
        short: "app/components/vizzy",
      });
    }
  }

  if (await fs.pathExists(path.join(projectPath, "pages"))) {
    if (await fs.pathExists(path.join(projectPath, "components"))) {
      paths.push({
        name: "components/vizzy",
        value: "components/vizzy",
        short: "components/vizzy",
      });
    }
  }

  if (await fs.pathExists(path.join(projectPath, "src"))) {
    paths.push({
      name: "src/vizzy",
      value: "src/vizzy",
      short: "src/vizzy",
    });

    if (await fs.pathExists(path.join(projectPath, "src/components"))) {
      paths.push({
        name: "src/components/vizzy",
        value: "src/components/vizzy",
        short: "src/components/vizzy",
      });
    }
  }

  paths.push({
    name: "Custom location...",
    value: "custom",
    short: "custom",
  });

  return paths;
}


