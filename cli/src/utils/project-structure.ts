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
      name: "app/canopy",
      value: "app/canopy",
      short: "app/canopy",
    });

    if (await fs.pathExists(path.join(projectPath, "app/components"))) {
      paths.push({
        name: "app/components/canopy",
        value: "app/components/canopy",
        short: "app/components/canopy",
      });
    }
  }

  if (await fs.pathExists(path.join(projectPath, "pages"))) {
    if (await fs.pathExists(path.join(projectPath, "components"))) {
      paths.push({
        name: "components/canopy",
        value: "components/canopy",
        short: "components/canopy",
      });
    }
  }

  if (await fs.pathExists(path.join(projectPath, "src"))) {
    paths.push({
      name: "src/canopy",
      value: "src/canopy",
      short: "src/canopy",
    });

    if (await fs.pathExists(path.join(projectPath, "src/components"))) {
      paths.push({
        name: "src/components/canopy",
        value: "src/components/canopy",
        short: "src/components/canopy",
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


