import React from 'react';
import { D3DonutChart } from '@canopy/charts';

const sampleData = [
	{ label: 'Product', value: 40 },
	{ label: 'Services', value: 35 },
	{ label: 'Support', value: 15 },
	{ label: 'Other', value: 10 },
];

export type DonutChartProps = React.ComponentProps<typeof D3DonutChart>;

export default function DonutChart(props: DonutChartProps) {
	const { data = sampleData, themeColor = '#FB923C', ...rest } = props;

	return (
		<D3DonutChart
			data={data}
			themeColor={themeColor}
			{...rest}
		/>
	);
}


