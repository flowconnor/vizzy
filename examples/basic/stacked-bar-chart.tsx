'use client';

import React from 'react';
import { D3StackedBarChart } from '@canopy/charts';

const data = [
	{ category: 'Q1', newUsers: 12, returningUsers: 18 },
	{ category: 'Q2', newUsers: 16, returningUsers: 20 },
	{ category: 'Q3', newUsers: 21, returningUsers: 25 },
	{ category: 'Q4', newUsers: 19, returningUsers: 23 },
];

export default function StackedBarChartExample() {
	return (
		<div style={{ width: 640, height: 360 }}>
			<D3StackedBarChart
				data={data}
				showLegend
				showTitle
				title="New vs Returning Customers"
				themeColor="#0EA5E9"
			/>
		</div>
	);
}


