import React from 'react';
import { D3LineChart } from '@canopy/charts';

const sampleData = [
	{ name: 'Jan', primary: 24, secondary: 18 },
	{ name: 'Feb', primary: 32, secondary: 25 },
	{ name: 'Mar', primary: 40, secondary: 28 },
	{ name: 'Apr', primary: 36, secondary: 30 },
	{ name: 'May', primary: 48, secondary: 34 },
];

const sampleDatasets = ['primary', 'secondary'];

export type LineChartProps = React.ComponentProps<typeof D3LineChart>;

export default function LineChart(props: LineChartProps) {
	const { data = sampleData, datasets = sampleDatasets, ...rest } = props;

	return (
		<D3LineChart
			data={data}
			datasets={datasets}
			{...rest}
		/>
	);
}


