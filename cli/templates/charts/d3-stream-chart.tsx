import React from 'react';
import { D3StreamChart } from '@canopy/charts';

const sampleData = Array.from({ length: 8 }, (_, index) => ({
	date: new Date(2024, index, 1),
	alpha: 20 + Math.random() * 10,
	beta: 12 + Math.random() * 8,
	gamma: 8 + Math.random() * 6,
}));

export type StreamChartProps = React.ComponentProps<typeof D3StreamChart>;

export default function StreamChart(props: StreamChartProps) {
	const { data = sampleData, themeColor = '#A855F7', ...rest } = props;

	return (
		<D3StreamChart
			data={data}
			themeColor={themeColor}
			{...rest}
		/>
	);
}


