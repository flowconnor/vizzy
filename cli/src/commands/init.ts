import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import path from "path";
import fs from "fs-extra";
import { FrameworkValidator, satisfiesVersion } from "../utils/framework-validator";
import { Dashboard } from "../utils/dashboard";
import { CHART_REGISTRY, REQUIRED_DEPENDENCIES } from "../utils/constants";
import { execSync } from "child_process";
import { detectProjectStructure } from "../utils/project-structure";

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function displayTitle() {
  const logo = `
   ______                               
  / ____/___ _____  ____  ____  __  __ 
 / /   / __ \`/ __ \\/ __ \\/ __ \\/ / / / 
/ /___/ /_/ / / / / /_/ / /_/ / /_/ /  
\\____/\\__,_/_/ /_/\\____/ .___/\\__, /   
                      /_/    /____/     
`;
  
  // Type the logo character by character
  for (const char of logo) {
    process.stdout.write(chalk.hex("#34D399").bold(char));
    if (char !== ' ' && char !== '\n') await sleep(5); // Faster for the logo
  }
  
  await typeText('Beautiful D3 charts for modern web apps', chalk.gray);
  console.log('\n');
}

async function typeText(text: string, color?: (text: string) => string, speed: number = 10) {
  for (let i = 0; i < text.length; i++) {
    process.stdout.write(color ? color(text[i]) : text[i]);
    await sleep(speed);
  }
  console.log();
}

async function installDependencies(packageManager: 'npm' | 'yarn' | 'pnpm') {
  const spinner = ora({
    text: 'Installing required dependencies...',
    color: 'green'
  }).start();

  try {
    const installCmd = {
      'npm': 'npm install --save',
      'yarn': 'yarn add',
      'pnpm': 'pnpm add'
    }[packageManager];

    const deps = Object.entries(REQUIRED_DEPENDENCIES)
      .map(([dep, version]) => `${dep}@${version}`)
      .join(' ');

    execSync(`${installCmd} ${deps}`, { stdio: 'ignore' });
    spinner.succeed('Dependencies installed');
  } catch (error) {
    spinner.fail('Failed to install dependencies');
    throw error;
  }
}

async function detectPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'> {
  const lockFiles = {
    'package-lock.json': 'npm',
    'yarn.lock': 'yarn',
    'pnpm-lock.yaml': 'pnpm'
  };

  for (const [file, manager] of Object.entries(lockFiles)) {
    if (await fs.pathExists(path.join(process.cwd(), file))) {
      return manager as 'npm' | 'yarn' | 'pnpm';
    }
  }

  return 'npm';
}

async function animateCompletionMessage() {
  const frames = [
    "⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"
  ];
  
  // Clear space for animation
  console.log('\n\n');
  
  // Animate dots
  for (let i = 0; i < 3; i++) {
    for (const frame of frames) {
      process.stdout.write(`\x1B[2A\x1B[0G${chalk.hex("#34D399").bold(frame)} ${chalk.hex("#34D399").dim('Loading magic...')}`);
      await sleep(50);
    }
  }
  
  // Clear animation
  process.stdout.write('\x1B[2A\x1B[0G' + ' '.repeat(50) + '\n' + ' '.repeat(50));
  
  // Show final message
  console.log('\x1B[2A\x1B[0G' + chalk.hex("#34D399").bold('Thanks for using Vizzy! ⭐'));
  console.log(chalk.hex("#34D399").dim('Happy charting ✨\n'));
}

export async function init() {
  await displayTitle();

  const projectPath = process.cwd();
  const packageJsonPath = path.join(projectPath, 'package.json');
  
  // Check if package.json exists
  if (!await fs.pathExists(packageJsonPath)) {
    await typeText('No package.json found. Creating a new project...', chalk.yellow);
    console.log();
    
    // Create basic package.json
    const packageJson = {
      name: path.basename(projectPath),
      version: '0.1.0',
      private: true,
      dependencies: {},
      devDependencies: {}
    };
    
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    await typeText('✔ Created package.json', chalk.green);
    console.log();
  }

  const validator = new FrameworkValidator(process.cwd());
  const result = await validator.validateDependencies(REQUIRED_DEPENDENCIES);

  if (result.framework) {
    await typeText(`✔ Found ${result.framework} project`, chalk.green);
    console.log();
  }

  // Show detected dependencies one by one
  await typeText('Scanning Project Dependencies:', chalk.cyan.bold);
  await sleep(300);
  for (const [dep, version] of Object.entries(result.versions || {})) {
    // Type the package name in gray
    process.stdout.write(chalk.gray(`  ${dep}: `));
    // Type the version in yellow
    await typeText(version, chalk.yellow, 10);
  }
  console.log();

  // Show required dependencies one by one
  await typeText('Vizzy Requirements:', chalk.cyan.bold);
  await sleep(300);
  let missingDeps = false;
  for (const [dep, version] of Object.entries(REQUIRED_DEPENDENCIES)) {
    const installed = result.versions?.[dep];
    let status = '';
    if (!installed) {
      status = chalk.red('(not installed)');
      missingDeps = true;
    } else if (!satisfiesVersion(installed, version)) {
      status = chalk.yellow(`(found ${installed})`);
      missingDeps = true;
    } else {
      status = chalk.green('✓');
    }
    await typeText(`  ${dep}@${version} ${status}`);
    await sleep(100);
  }
  console.log();

  if (missingDeps) {
    const { install } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'install',
        message: 'Would you like to install missing dependencies?',
        default: true
      }
    ]);

    if (install) {
      const packageManager = await detectPackageManager();
      await installDependencies(packageManager);
    }
  }

  // Check for TypeScript configuration
  const tsconfigPath = path.join(projectPath, 'tsconfig.json');
  if (!await fs.pathExists(tsconfigPath)) {
    await typeText('\nNo tsconfig.json found. Creating TypeScript configuration...', chalk.yellow);
    
    const tsconfig = {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
      },
      include: ["**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"]
    };
    
    await fs.writeJSON(tsconfigPath, tsconfig, { spaces: 2 });
    await typeText('✔ Created tsconfig.json', chalk.green);
    console.log();
  }

  // Check for Tailwind configuration
  const tailwindConfigPath = path.join(projectPath, 'tailwind.config.ts');
  if (!await fs.pathExists(tailwindConfigPath)) {
    await typeText('\nNo tailwind.config.ts found. Creating Tailwind configuration...', chalk.yellow);
    
    const tailwindConfig = `import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config`;
    
    await fs.writeFile(tailwindConfigPath, tailwindConfig);
    await typeText('✔ Created tailwind.config.ts', chalk.green);
    console.log();

    // Create CSS file with Tailwind directives if it doesn't exist
    const cssPath = path.join(projectPath, 'src/styles/globals.css');
    if (!await fs.pathExists(cssPath)) {
      await fs.ensureDir(path.dirname(cssPath));
      const cssContent = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
      await fs.writeFile(cssPath, cssContent);
      await typeText('✔ Created globals.css with Tailwind directives', chalk.green);
      console.log();
    }
  }

  const projectPaths = await detectProjectStructure(process.cwd());
  
  const { folderLocation } = await inquirer.prompt([
    {
      type: 'list',
      name: 'folderLocation',
      message: 'Where would you like to install Vizzy?',
      choices: projectPaths,
      default: projectPaths[0]?.value || 'app/vizzy'
    }
  ]);

  let targetPath = folderLocation;
  if (folderLocation === 'custom') {
    const { customPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customPath',
        message: 'Enter the path where you want to install Vizzy:',
        default: 'src/vizzy',
        validate: (input: string) => {
          if (!input) return 'Path cannot be empty';
          if (input.includes('..')) return 'Path cannot contain ..';
          if (path.isAbsolute(input)) return 'Please provide a relative path';
          return true;
        }
      }
    ]);
    targetPath = customPath;
  }

  interface ChartSelectionAnswers {
    selectedCharts: string[];
  }

  const answers = await inquirer.prompt<ChartSelectionAnswers>({
    type: 'checkbox',
    name: 'selectedCharts',
    message: 'Which beautiful D3 charts would you like to start with?',
    choices: Object.entries(CHART_REGISTRY).map(([key, chart]) => ({
      name: `${chalk.cyan(key)}: ${chart.description}`,
      value: key,
      short: key
    })),
    validate: (input: any) => {
      const selections = Array.isArray(input) ? input : [];
      return selections.length > 0 ? true : 'Please select at least one chart';
    }
  });

  const { selectedCharts } = answers;

  const spinner2 = ora({
    text: 'Setting up Vizzy...',
    color: 'green'
  }).start();

  const dashboard = new Dashboard(process.cwd());
  await dashboard.initialize(result.framework || 'next.js', true, selectedCharts, targetPath);
  spinner2.succeed("Setup complete!");
  
  // Add extra spacing
  console.log('\n\n');
  
  // Show next steps with better formatting
  await typeText("Next Steps:", chalk.cyan.bold);
  await sleep(300);
  
  await typeText("• Add more charts:");
  await typeText(`  ${chalk.cyan(`vizzy add <chart>`)}`);
  await sleep(200);
  
  await typeText("• View your charts:");
  await typeText(`  ${chalk.gray(`cd`)} ${chalk.cyan(targetPath)}`);
  await sleep(200);
  
  await typeText("• Read the docs:");
  await typeText(`  ${chalk.cyan(`docs.vizzy.com`)}`);
  
  // Add lots of spacing before final message
  console.log('\n\n\n');
  
  // Final message with typing animation
  await typeText('Thanks for using Vizzy!', chalk.hex("#34D399").bold);
  await typeText('Give us a ⭐ on GitHub: ' + chalk.cyan('https://github.com/cbarrett3/vizzy').toString());
  await typeText('See you around!', chalk.hex("#34D399").dim);
  
  // Final spacing
  console.log('\n');
}
