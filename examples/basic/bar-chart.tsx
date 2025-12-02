import React from 'react';
import { D3BarChart } from '@vizzy/charts';

const data = [
	{ label: 'Q1', value: 18 },
	{ label: 'Q2', value: 24 },
	{ label: 'Q3', value: 32 },
	{ label: 'Q4', value: 28 },
];

export default function BasicBarChart() {
	return (
		<div style={{ width: 600, height: 320 }}>
			<D3BarChart
				data={data}
				showLegend
				showTitle
				title="Quarterly Revenue"
				themeColor="#22C55E"
			/>
		</div>
	);
}