import React from 'react';
import {
  D3BarChart,
  D3DonutChart,
  D3LineChart,
  D3StackedBarChart,
  D3StreamChart,
  D3TreeMap,
} from '@vizzy/charts';

const barSampleData = [
  { label: 'North', value: 30 },
  { label: 'South', value: 22 },
  { label: 'East', value: 27 },
  { label: 'West', value: 18 },
];

const lineSampleData = [
  { name: 'Jan', primary: 24, secondary: 18 },
  { name: 'Feb', primary: 32, secondary: 25 },
  { name: 'Mar', primary: 40, secondary: 28 },
  { name: 'Apr', primary: 36, secondary: 30 },
  { name: 'May', primary: 48, secondary: 34 },
];

const stackedSampleData = [
  { category: 'Q1', newUsers: 18, returningUsers: 12 },
  { category: 'Q2', newUsers: 24, returningUsers: 14 },
  { category: 'Q3', newUsers: 30, returningUsers: 18 },
  { category: 'Q4', newUsers: 28, returningUsers: 22 },
];

const donutSampleData = [
  { label: 'Product', value: 40 },
  { label: 'Services', value: 35 },
  { label: 'Support', value: 15 },
  { label: 'Other', value: 10 },
];

const streamSampleData = Array.from({ length: 8 }, (_, index) => ({
  date: new Date(2024, index, 1),
  alpha: 20 + Math.random() * 10,
  beta: 12 + Math.random() * 8,
  gamma: 8 + Math.random() * 6,
}));

const treeMapSampleData = {
  name: 'Portfolio',
  value: 0,
  children: [
    { name: 'Advertising', value: 32 },
    { name: 'SaaS', value: 24 },
    { name: 'Commerce', value: 18 },
    { name: 'Services', value: 12 },
  ],
};

const lineDatasets = ['primary', 'secondary'];

export type BarChartProps = React.ComponentProps<typeof D3BarChart>;
export function BarChart(props: BarChartProps) {
  const { data = barSampleData, themeColor = '#22C55E', ...rest } = props;
  return <D3BarChart data={data} themeColor={themeColor} {...rest} />;
}

export type LineChartProps = React.ComponentProps<typeof D3LineChart>;
export function LineChart(props: LineChartProps) {
  const { data = lineSampleData, datasets = lineDatasets, ...rest } = props;
  return <D3LineChart data={data} datasets={datasets} {...rest} />;
}

export type DonutChartProps = React.ComponentProps<typeof D3DonutChart>;
export function DonutChart(props: DonutChartProps) {
  const { data = donutSampleData, themeColor = '#FB923C', ...rest } = props;
  return <D3DonutChart data={data} themeColor={themeColor} {...rest} />;
}

export type StackedBarChartProps = React.ComponentProps<typeof D3StackedBarChart>;
export function StackedBarChart(props: StackedBarChartProps) {
  const { data = stackedSampleData, themeColor = '#0EA5E9', ...rest } = props;
  return <D3StackedBarChart data={data} themeColor={themeColor} {...rest} />;
}

export type StreamChartProps = React.ComponentProps<typeof D3StreamChart>;
export function StreamChart(props: StreamChartProps) {
  const { data = streamSampleData, themeColor = '#A855F7', ...rest } = props;
  return <D3StreamChart data={data} themeColor={themeColor} {...rest} />;
}

export type TreeMapProps = React.ComponentProps<typeof D3TreeMap>;
export function TreeMap(props: TreeMapProps) {
  const { data = treeMapSampleData, themeColor = '#F97316', ...rest } = props;
  return <D3TreeMap data={data} themeColor={themeColor} {...rest} />;
}


