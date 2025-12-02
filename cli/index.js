#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const chalk = require('chalk');
const ora = require('ora');
const { exec } = require('child_process');
const FrameworkValidator = require('./utils/framework-validator');
const { SUPPORTED_VERSIONS, getVersionWarning } = require('./utils/versions');
const Dashboard = require('./utils/dashboard');

const separator = chalk.hex('#34D399')('·'.repeat(50));
const VIZZY_SOURCE = path.join(__dirname, '..', 'app', '_components');

async function init() {
  console.clear();
  console.log(chalk.hex('#34D399').bold('Vizzy'));
  console.log(chalk.gray('Beautiful D3 charts for modern web apps\n'));

  // Step 1: Project Analysis & Validation
  console.log(chalk.white.bold('Step 1: Project Analysis'));
  const spinner = ora('Analyzing project structure...').start();

  try {
    const projectPath = process.cwd();
    const validator = new FrameworkValidator(projectPath);

    // Load package.json
    const packageJson = require(path.join(projectPath, 'package.json'));
    const { dependencies = {}, devDependencies = {} } = packageJson;

    // Validate dependencies
    const depResults = await validator.validateDependencies(dependencies, devDependencies);
    
    if (!depResults.isValid) {
      spinner.fail('Project analysis failed');
      console.log(validator.formatResults(depResults));
      process.exit(1);
    }

    // Validate framework configuration
    const configResults = await validator.validateFrameworkConfig(depResults.framework);
    
    if (!configResults.isValid) {
      spinner.fail('Framework configuration validation failed');
      console.log(validator.formatResults(configResults));
      process.exit(1);
    }

    // Validate project structure
    const structureResults = await validator.validateProjectStructure(depResults.framework);
    
    if (!structureResults.isValid) {
      spinner.fail('Project structure validation failed');
      console.log(validator.formatResults(structureResults));
      process.exit(1);
    }

    // Validate TypeScript if used
    const tsResults = await validator.validateTypeScript(dependencies, devDependencies);
    
    if (!tsResults.isValid) {
      spinner.warn('TypeScript setup is incomplete');
      console.log(validator.formatResults(tsResults));
      // Don't exit, just warn
    }

    spinner.succeed('Project validation complete');

    // Show framework information
    console.log(chalk.gray('\nFramework Details:'));
    console.log(`• Type: ${chalk.hex('#34D399')(depResults.framework)}`);
    console.log(`• React: ${chalk.hex('#34D399')(depResults.versions.react)}`);
    
    if (depResults.framework !== 'react') {
      console.log(`• ${depResults.framework}: ${chalk.hex('#34D399')(depResults.versions[depResults.framework.replace('.js', '')])}`);
    }

    console.log(`• TypeScript: ${chalk.hex('#34D399')(tsResults.isValid ? 'Yes' : 'No')}`);

    // Detect existing dev tools
    const existingDevTools = await validator.detectDevTools(process.cwd());
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('\nPress Enter to continue...');
    await prompts({ type: 'text', name: 'continue', message: '' });

    // Step 2: Chart Selection
    console.clear();
    console.log(chalk.white.bold('Step 2: Chart Selection'));
    console.log(chalk.gray('Choose which charts you\'d like to add to your project.\n'));

    const questions = [
      {
        type: 'multiselect',
        name: 'charts',
        message: chalk.white('Select charts to install'),
        hint: chalk.gray('Space to select. Enter to confirm'),
        instructions: false,
        choices: [
          { 
            title: chalk.white('Line Chart'),
            description: chalk.gray('Time series, trends, continuous data'),
            value: 'line',
            selected: true
          },
          { 
            title: chalk.white('Bar Chart'),
            description: chalk.gray('Comparisons, categorical data'),
            value: 'bar'
          },
          { 
            title: chalk.white('Donut Chart'),
            description: chalk.gray('Parts of a whole, proportions'),
            value: 'donut'
          },
          { 
            title: chalk.white('Stacked Bar Chart'),
            description: chalk.gray('Nested comparisons, grouped data'),
            value: 'stacked'
          },
          { 
            title: chalk.white('Stream Chart'),
            description: chalk.gray('Flow visualization, temporal patterns'),
            value: 'stream'
          },
          { 
            title: chalk.white('Tree Map'),
            description: chalk.gray('Hierarchical data, nested structures'),
            value: 'treemap'
          }
        ]
      }
    ];

    const { charts } = await prompts(questions[0], {
      onCancel: () => {
        console.log(chalk.yellow('\nSetup cancelled'));
        process.exit(0);
      }
    });
    
    if (!charts || charts.length === 0) {
      console.log(chalk.yellow('\nNo charts selected'));
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('\nPress Enter to continue...');
    await prompts({ type: 'text', name: 'continue', message: '' });

    // Step 3: Installation Location
    console.clear();
    console.log(chalk.white.bold('Step 3: Installation Location'));
    console.log(chalk.gray('Choose where you\'d like to install the charts.\n'));

    const locationQuestions = [
      {
        type: 'select',
        name: 'directoryChoice',
        message: chalk.white('Where would you like to install the charts?'),
        choices: [
          {
            title: chalk.hex('#34D399')('Default location'),
            description: chalk.gray('(Recommended based on your project structure)'),
            value: path.join(depResults.defaultDir, 'vizzy')
          },
          {
            title: chalk.hex('#34D399')('Custom location'),
            description: chalk.gray('Specify a different directory'),
            value: 'custom'
          }
        ]
      },
      {
        type: prev => prev.directoryChoice === 'custom' ? 'text' : null,
        name: 'customDirectory',
        message: chalk.white('Enter custom directory path:'),
        initial: path.join(depResults.defaultDir, 'vizzy'),
        hint: chalk.gray('e.g., src/components/vizzy'),
        validate: value => {
          if (!value) return 'Directory path is required';
          if (value.includes('..')) return 'Please use a path within your project';
          return true;
        }
      }
    ];

    const { directoryChoice, customDirectory } = await prompts(locationQuestions, {
      onCancel: () => {
        console.log(chalk.yellow('\nSetup cancelled'));
        process.exit(0);
      }
    });

    // Determine final installation directory
    const installDir = directoryChoice === 'custom' ? customDirectory : directoryChoice;
    const targetDir = path.resolve(process.cwd(), installDir);

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('\nPress Enter to review your choices...');
    await prompts({ type: 'text', name: 'continue', message: '' });

    // Step 4: Review and Confirm
    console.clear();
    console.log(chalk.white.bold('Step 4: Review and Confirm'));
    console.log(chalk.gray('Please review your choices before we proceed.\n'));
    
    console.log(chalk.white.bold('Selected Charts:'));
    charts.forEach(chart => {
      console.log(`• ${chalk.white(chart.charAt(0).toUpperCase() + chart.slice(1))} Chart`);
    });

    console.log(chalk.white.bold('\nInstallation Location:'));
    const relativePath = path.relative(process.cwd(), targetDir);
    console.log(`• ${chalk.white(relativePath)}/`);
    console.log(chalk.gray(`  ├── charts/     Chart components`));
    console.log(chalk.gray(`  ├── helpers/    Shared components (axis, grid, tooltip)`));
    console.log(chalk.gray(`  ├── hooks/      React hooks`));
    console.log(chalk.gray(`  └── utils/      Utility functions`));

    // Confirm installation
    const { confirm } = await prompts({
      type: 'confirm',
      name: 'confirm',
      message: 'Everything looks good?',
      initial: true
    });

    if (!confirm) {
      console.log(chalk.yellow('\nInstallation cancelled'));
      return;
    }

    // Step 5: Installation
    console.clear();
    console.log(chalk.white.bold('Step 5: Installation'));
    console.log(chalk.gray('Installing your selected charts...\n'));

    // Create vizzy directory structure
    const dirs = [
      targetDir,
      path.join(targetDir, 'charts'),
      path.join(targetDir, 'helpers'),
      path.join(targetDir, 'hooks'),
      path.join(targetDir, 'utils')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Copy selected chart components and their dependencies
    for (const chart of charts) {
      await copyChartFiles(chart, targetDir, tsResults.isValid);
    }

    // Copy common utilities and helpers
    await copyCommonFiles(targetDir, tsResults.isValid);

    // Initialize and display dashboard
    const dashboard = new Dashboard();
    await dashboard.initialize(depResults.framework, tsResults.isValid, charts);
    await dashboard.analyzePerformance();
    
    // Add dev tools info to dashboard
    dashboard.addDevToolsInfo(existingDevTools);

    // Final Step: Success
    console.clear();
    console.log(chalk.white.bold('Installation Complete! 🎉'));
    console.log(chalk.gray('\nHere\'s a summary of what we\'ve installed:\n'));
    
    dashboard.render();

    console.log(chalk.gray('\nNeed help getting started?'));
    console.log(`• Documentation: ${chalk.white('vizzy.dev/docs')}`);
    console.log(`• Examples: ${chalk.white('vizzy.dev/examples')}`);
    console.log(`• GitHub: ${chalk.white('github.com/cbarrett3/vizzy')}`);
    
    console.log(chalk.hex('#34D399')('\nWelcome to the vizzy 🦊'));
  } catch (error) {
    spinner.fail('Project analysis failed');
    console.error(chalk.red(`\nError: ${error.message}`));
    
    if (error.message.includes('package.json')) {
      console.log(chalk.gray('\nMake sure you\'re in a valid React project directory.'));
    }
    
    process.exit(1);
  }
}

async function copyChartFiles(chartType, targetDir, isTypescript) {
  const spinner = ora({
    text: chalk.white(`Installing ${chartType} chart`),
    color: 'green'
  }).start();

  // Copy chart component
  const chartSource = path.join(VIZZY_SOURCE, 'charts', `d3-${chartType}-chart.tsx`);
  const chartTarget = path.join(targetDir, 'charts', `d3-${chartType}-chart.${isTypescript ? 'tsx' : 'jsx'}`);
  
  if (fs.existsSync(chartSource)) {
    fs.copyFileSync(chartSource, chartTarget);
  }

  // Copy chart-specific hooks if they exist
  const hookSource = path.join(VIZZY_SOURCE, 'charts', 'hooks', `use-${chartType}-chart.ts`);
  const hookTarget = path.join(targetDir, 'hooks', `use-${chartType}-chart.ts`);
  
  if (fs.existsSync(hookSource)) {
    fs.copyFileSync(hookSource, hookTarget);
  }

  spinner.succeed(chalk.gray(`${chartType} chart installed`));
}

async function copyCommonFiles(targetDir, isTypescript) {
  const spinner = ora({
    text: chalk.white('Installing shared utilities'),
    color: 'green'
  }).start();
  
  const ext = isTypescript ? '.tsx' : '.jsx';
  
  // Copy helpers (axis, grid, tooltip)
  const helperFiles = ['axis', 'grid', 'tooltip'].map(helper => ({
    source: path.join(VIZZY_SOURCE, 'charts', 'components', `${helper}${ext}`),
    target: path.join(targetDir, 'helpers', `${helper}${ext}`)
  }));

  // Copy hooks
  const hookFiles = ['dimensions', 'colors'].map(hook => ({
    source: path.join(VIZZY_SOURCE, 'charts', 'hooks', `use-${hook}.ts`),
    target: path.join(targetDir, 'hooks', `use-${hook}.ts`)
  }));

  // Copy utils
  const utilFiles = ['colors'].map(util => ({
    source: path.join(VIZZY_SOURCE, 'charts', 'utils', `${util}.ts`),
    target: path.join(targetDir, 'utils', `${util}.ts`)
  }));

  // Copy all files
  [...helperFiles, ...hookFiles, ...utilFiles].forEach(({source, target}) => {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, target);
    }
  });

  spinner.succeed(chalk.gray('Shared utilities installed'));
}

init().catch((err) => {
  console.error(chalk.red('\nError:'), err);
  process.exit(1);
});
