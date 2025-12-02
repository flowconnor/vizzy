import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { ChartType } from './constants';

const CHARTS_TEMPLATE_DIR = path.join(__dirname, '..', '..', 'templates', 'charts');
const CHART_INDEX_TEMPLATE = path.join(CHARTS_TEMPLATE_DIR, 'index.tsx');

const CHART_EXPORT_MAP: Record<ChartType, { component: string; props: string }> = {
    'bar-chart': { component: 'BarChart', props: 'BarChartProps' },
    'line-chart': { component: 'LineChart', props: 'LineChartProps' },
    'donut-chart': { component: 'DonutChart', props: 'DonutChartProps' },
    'stacked-bar-chart': { component: 'StackedBarChart', props: 'StackedBarChartProps' },
    'stream-chart': { component: 'StreamChart', props: 'StreamChartProps' },
    'tree-map': { component: 'TreeMap', props: 'TreeMapProps' },
};

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
    installedCharts: ChartType[];
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

    async initialize(framework: string, isTypescript: boolean, installedCharts: ChartType[] = [], targetPath: string = 'app/vizzy') {
        this.stats.framework = framework;
        this.stats.typescript = isTypescript;
        this.stats.installedCharts = installedCharts;
        this.stats.bundleSize = this.calculateBundleSize(installedCharts);
        this.stats.targetPath = targetPath;

        // Ensure target directory exists
        const targetDir = path.join(this.projectPath, targetPath);
        fs.mkdirSync(targetDir, { recursive: true });

        await this.ensureChartIndexFile(targetDir, true);

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

    async addChart(chartName: ChartType, config: { overwrite?: boolean } & Record<string, any>) {
        if (!config.overwrite && this.stats.installedCharts.includes(chartName)) {
            throw new Error(`Chart '${chartName}' is already installed`);
        }

        const chartConfig = CHART_EXPORT_MAP[chartName];

        if (!chartConfig) {
            throw new Error(`Chart template '${chartName}' is not supported`);
        }

        const targetDir = path.join(this.projectPath, this.stats.targetPath);
        const targetFile = path.join(targetDir, `d3-${chartName}.tsx`);

        await this.ensureChartIndexFile(targetDir, config.overwrite);

        // Create target directory if it doesn't exist
        fs.mkdirSync(path.dirname(targetFile), { recursive: true });

        const fileContents = [
            `export { ${chartConfig.component} as default } from './index';`,
            `export type { ${chartConfig.props} } from './index';`,
            '',
        ].join('\n');

        await fs.writeFile(targetFile, fileContents, { encoding: 'utf-8' });

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

    private async ensureChartIndexFile(targetDir: string, overwrite?: boolean) {
        const targetIndex = path.join(targetDir, 'index.tsx');
        const shouldCopy = overwrite || !fs.existsSync(targetIndex);

        if (!shouldCopy) {
            return;
        }

        fs.mkdirSync(targetDir, { recursive: true });
        await fs.copyFile(CHART_INDEX_TEMPLATE, targetIndex);
    }
}
