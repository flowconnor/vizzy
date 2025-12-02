import React from 'react';
import { D3StackedBarChart } from '@canopy/charts';

const sampleData = [
	{ category: 'Q1', newUsers: 18, returningUsers: 12 },
	{ category: 'Q2', newUsers: 24, returningUsers: 14 },
	{ category: 'Q3', newUsers: 30, returningUsers: 18 },
	{ category: 'Q4', newUsers: 28, returningUsers: 22 },
];

export type StackedBarChartProps = React.ComponentProps<typeof D3StackedBarChart>;

export default function StackedBarChart(props: StackedBarChartProps) {
	const { data = sampleData, themeColor = '#0EA5E9', ...rest } = props;

	return (
		<D3StackedBarChart
			data={data}
			themeColor={themeColor}
			{...rest}
		/>
	);
}


