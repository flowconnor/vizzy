import inquirer, { ListQuestion } from 'inquirer';

interface ChartConfigAnswers {
  title: string;
  description: string;
  width: string;
  height: string;
}

export async function promptForChartConfig(chartName: string) {
  const questions = [
    {
      type: 'input',
      name: 'title',
      message: 'Chart title:',
      default: `My ${chartName}`
    },
    {
      type: 'input',
      name: 'description',
      message: 'Chart description:',
      default: `A beautiful ${chartName} created with Vizzy`
    },
    {
      type: 'input',
      name: 'width',
      message: 'Chart width:',
      default: '100%'
    },
    {
      type: 'input',
      name: 'height',
      message: 'Chart height:',
      default: '400'
    }
  ];

  return inquirer.prompt<ChartConfigAnswers>(questions);
}

interface FrameworkAnswers {
  framework: string;
}

export async function promptForFramework(yes?: boolean) {
  if (yes) {
    return { framework: 'next' };
  }

  const question: ListQuestion = {
    type: 'list',
    name: 'framework',
    message: 'Which framework are you using?',
    choices: [
      { name: 'Next.js', value: 'next' },
      { name: 'React', value: 'react' },
      { name: 'Vue', value: 'vue' }
    ]
  };

  return inquirer.prompt<FrameworkAnswers>(question);
}
