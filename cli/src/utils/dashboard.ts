import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

interface Performance {
    renderTime?: string;
    memoryUsage?: string;
    fps?: number;
}

interface DevTools {
    enabled: boolean;
    features: string[];
}

interface DashboardStats {
    installedCharts: string[];
    framework: string;
    typescript: boolean;
    bundleSize: string;
    performance: Performance;
    devTools: DevTools;
    targetPath: string;
}

export class Dashboard {
    protected projectPath: string;
    private stats: DashboardStats;

    constructor(projectPath: string) {
        this.projectPath = projectPath;
        this.stats = {
            installedCharts: [],
            framework: '',
            typescript: false,
            bundleSize: '0kb',
            performance: {},
            devTools: {
                enabled: false,
                features: []
            },
            targetPath: ''
        };
    }

    async initialize(framework: string, isTypescript: boolean, installedCharts: string[] = [], targetPath: string = 'app/canopy') {
        this.stats.framework = framework;
        this.stats.typescript = isTypescript;
        this.stats.installedCharts = installedCharts;
        this.stats.bundleSize = this.calculateBundleSize(installedCharts);
        this.stats.targetPath = targetPath;

        // Ensure target directory exists
        const targetDir = path.join(this.projectPath, targetPath);
        fs.mkdirSync(targetDir, { recursive: true });

        // Copy selected chart files and update their imports
        for (const chartName of installedCharts) {
            await this.addChart(chartName, { overwrite: true });
        }
    }

    addDevToolsInfo(devTools: DevTools) {
        this.stats.devTools = devTools;
    }

    calculateBundleSize(charts: string[]): string {
        // This is a placeholder calculation
        return `${charts.length * 5}kb`;
    }

    addPerformanceMetrics(metrics: Performance) {
        this.stats.performance = metrics;
    }

    async addChart(chartName: string, config: { overwrite?: boolean } & Record<string, any>) {
        if (!config.overwrite && this.stats.installedCharts.includes(chartName)) {
            throw new Error(`Chart '${chartName}' is already installed`);
        }

        const templateFile = path.join(__dirname, '..', '..', 'templates', 'charts', `d3-${chartName}.tsx`);
        const targetFile = path.join(this.projectPath, this.stats.targetPath, `d3-${chartName}.tsx`);

        if (!fs.existsSync(templateFile)) {
            throw new Error(`Chart template '${chartName}' not found at ${templateFile}`);
        }

        // Create target directory if it doesn't exist
        fs.mkdirSync(path.dirname(targetFile), { recursive: true });

        // Copy template as-is
        await fs.copyFile(templateFile, targetFile);

        // Add or update the chart in installedCharts
        if (!this.stats.installedCharts.includes(chartName)) {
            this.stats.installedCharts.push(chartName);
        }

        // Update bundle size
        this.stats.bundleSize = this.calculateBundleSize(this.stats.installedCharts);
    }

    display() {
        console.log('\n' + chalk.bold('Project Dashboard'));
        console.log('─'.repeat(50));

        // Framework
        console.log(chalk.cyan('Framework:'), this.stats.framework);
        console.log(chalk.cyan('TypeScript:'), this.stats.typescript ? '✓' : '✗');

        // Installed Charts
        console.log('\n' + chalk.bold('Installed Charts:'));
        if (this.stats.installedCharts.length === 0) {
            console.log(chalk.gray('No charts installed'));
        } else {
            this.stats.installedCharts.forEach(chart => {
                console.log(`  ${chalk.green('•')} ${chart}`);
            });
        }

        // Bundle Size
        console.log('\n' + chalk.bold('Bundle Size:'), this.stats.bundleSize);

        // Performance Metrics
        if (Object.keys(this.stats.performance).length > 0) {
            console.log('\n' + chalk.bold('Performance Metrics:'));
            if (this.stats.performance.renderTime) {
                console.log(chalk.cyan('Render Time:'), this.stats.performance.renderTime);
            }
            if (this.stats.performance.memoryUsage) {
                console.log(chalk.cyan('Memory Usage:'), this.stats.performance.memoryUsage);
            }
            if (this.stats.performance.fps) {
                console.log(chalk.cyan('FPS:'), this.stats.performance.fps);
            }
        }

        // DevTools
        if (this.stats.devTools.enabled) {
            console.log('\n' + chalk.bold('DevTools:'), '✓');
            if (this.stats.devTools.features.length > 0) {
                console.log(chalk.cyan('Enabled Features:'));
                this.stats.devTools.features.forEach(feature => {
                    console.log(`  ${chalk.green('•')} ${feature}`);
                });
            }
        }

        console.log('─'.repeat(50) + '\n');
    }
}
