import React from 'react';
import { D3BarChart } from '@canopy/charts';

const sampleData = [
	{ label: 'North', value: 30 },
	{ label: 'South', value: 22 },
	{ label: 'East', value: 27 },
	{ label: 'West', value: 18 },
];

export type BarChartProps = React.ComponentProps<typeof D3BarChart>;

export default function BarChart(props: BarChartProps) {
	const { data = sampleData, themeColor = '#22C55E', ...rest } = props;

	return (
		<D3BarChart
			data={data}
			themeColor={themeColor}
			{...rest}
		/>
	);
}


