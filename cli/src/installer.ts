import { SupportedFramework } from './framework-detection';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { ChartType, CHART_REGISTRY } from "./utils/constants";
import { Dashboard } from "./utils/dashboard";
import { getConfig } from "./utils/config";

interface InstallationOptions {
    framework: SupportedFramework;
    projectPath: string;
    chartTypes: string[];
}

export async function installOptimizations({ framework, projectPath, chartTypes }: InstallationOptions): Promise<void> {
    const spinner = ora('Installing Vizzy optimizations...').start();

    try {
        // Create optimizations directory if it doesn't exist
        const optimizationsDir = path.join(projectPath, 'vizzy-optimizations');
        if (!fs.existsSync(optimizationsDir)) {
            fs.mkdirSync(optimizationsDir, { recursive: true });
        }

        // Copy only the framework-specific optimizations
        const frameworkOptimizations = getFrameworkOptimizations(framework, chartTypes);
        for (const [filename, content] of Object.entries(frameworkOptimizations)) {
            const filePath = path.join(optimizationsDir, filename);
            fs.writeFileSync(filePath, content);
        }

        // Update package.json with necessary dependencies
        await updatePackageJson(projectPath, framework);

        spinner.succeed(chalk.green('Successfully installed Vizzy optimizations!'));
        console.log('\nOptimizations installed for:');
        console.log(chalk.blue(`Framework: ${framework}`));
        console.log(chalk.blue(`Chart Types: ${chartTypes.join(', ')}`));
        
        // Framework-specific instructions
        console.log('\n' + getFrameworkInstructions(framework));
    } catch (error) {
        spinner.fail(chalk.red('Failed to install optimizations'));
        console.error(error);
        throw error;
    }
}

function getFrameworkOptimizations(framework: SupportedFramework, _chartTypes: string[]): Record<string, string> {
    // This would contain the actual optimizations code for each framework
    // For now, we'll return a placeholder
    const optimizations: Record<string, string> = {};
    
    switch (framework) {
        case 'next.js':
            optimizations['next.config.js'] = `
// Vizzy Next.js configuration
module.exports = {
    // Add framework-specific optimizations
};`;
            break;
        // Add other frameworks as needed
    }

    return optimizations;
}

async function updatePackageJson(projectPath: string, framework: SupportedFramework): Promise<void> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Add framework-specific dependencies
    const dependencies = getFrameworkDependencies(framework);
    packageJson.dependencies = {
        ...packageJson.dependencies,
        ...dependencies,
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function getFrameworkDependencies(framework: SupportedFramework): Record<string, string> {
    // Define framework-specific dependencies
    const commonDeps = {
        'd3': '^7.0.0',
        'react': '^18.0.0',
        'react-dom': '^18.0.0',
        '@types/react': '^18.0.0',
        '@types/react-dom': '^18.0.0',
        '@types/d3': '^7.0.0',
        'typescript': '^5.0.0',
    };

    switch (framework) {
        case 'next.js':
            return {
                ...commonDeps,
                '@vizzy/next': '^1.0.0',
            };
        case 'react':
            return {
                ...commonDeps,
                '@vizzy/react': '^1.0.0',
            };
        // Add other frameworks as needed
        default:
            return commonDeps;
    }
}

function getFrameworkInstructions(framework: SupportedFramework): string {
    switch (framework) {
        case 'next.js':
            return chalk.yellow(`
Next steps:
1. Run 'npm install' to install new dependencies
2. Import your charts from '@vizzy/next'
3. Your charts are now optimized for Next.js with SSR and automatic code-splitting!`);
        // Add other frameworks as needed
        default:
            return '';
    }
}

export class Installer {
    async install(chartType: ChartType) {
        const spinner = ora(`Adding ${chartType}...`).start();
        try {
            const config = await getConfig();
            if (!config) {
                spinner.fail('No configuration found. Please run init first.');
                return;
            }

            const dashboard = new Dashboard(process.cwd());
            await dashboard.addChart(chartType, { overwrite: false });
            
            spinner.succeed(`Successfully added ${chartType}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            spinner.fail(`Failed to add ${chartType}: ${errorMessage}`);
        }
    }
}
