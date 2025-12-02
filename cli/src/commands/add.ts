import chalk from "chalk";
import inquirer from "inquirer";
import { CHART_REGISTRY, ChartType } from "../utils/constants";
import { Installer } from "../installer";

export async function add(chart?: string) {
  console.clear();
  console.log(chalk.hex("#34D399").bold("Vizzy"));
  console.log(chalk.gray("Beautiful D3 charts for modern web apps\n"));

  let selectedChart: ChartType;

  // Validate chart if provided
  if (chart) {
    if (!Object.keys(CHART_REGISTRY).includes(chart)) {
      console.error(chalk.red(`Error: Invalid chart type '${chart}'`));
      console.log("\nAvailable chart types:");
      Object.entries(CHART_REGISTRY).forEach(([key, chart]) => {
        console.log(`  ${chalk.cyan(key)}: ${chart.description}`);
      });
      process.exit(1);
    }
    selectedChart = chart as ChartType;
  } else {
    // Prompt for chart type
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "chart",
        message: "Which chart would you like to add?",
        choices: Object.entries(CHART_REGISTRY).map(([key, chart]) => ({
          name: `${chart.name} - ${chart.description}`,
          value: key,
          short: chart.name
        }))
      }
    ]);
    selectedChart = answer.chart;
  }

  // Install the chart
  const installer = new Installer();
  await installer.install(selectedChart);
}
