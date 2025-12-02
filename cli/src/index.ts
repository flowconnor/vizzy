#!/usr/bin/env node
import { Command } from "commander"
import { add } from "./commands/add"
import { init } from "./commands/init"
import chalk from "chalk"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  const program = new Command()
    .name("vizzy")
    .description("Vizzy CLI for opinionated React + D3 charts")
    .version("1.0.0")

  program
    .command("init")
    .description("Initialize Vizzy in your project")
    .option("-y, --yes", "Skip confirmation prompt")
    .action(init)

  program
    .command("add <chart>")
    .description("Add a chart to your project")
    .option("-y, --yes", "Skip confirmation prompt")
    .option("-o, --overwrite", "Overwrite existing files")
    .action(add)

  program.addHelpText("afterAll", `
${chalk.bold("Examples:")}

  ${chalk.dim("$")} npx vizzy@latest init
  ${chalk.dim("$")} npx vizzy@latest add line-chart
  ${chalk.dim("$")} npx vizzy@latest add bar-chart --overwrite
`)

  await program.parseAsync(process.argv)
}

main().catch((error) => {
  console.error(chalk.red("Error:"), error.message)
  process.exit(1)
})
