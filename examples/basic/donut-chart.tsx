'use client';

import React from 'react';
import { D3DonutChart } from '@vizzy/charts';

const data = [
	{ label: 'Product', value: 42 },
	{ label: 'Services', value: 28 },
	{ label: 'Support', value: 18 },
	{ label: 'Other', value: 12 },
];

export default function DonutChartExample() {
	return (
		<div style={{ width: 480, height: 320 }}>
			<D3DonutChart
				data={data}
				showLegend
				showTitle
				title="Revenue Mix"
				themeColor="#F97316"
			/>
		</div>
	);
}


