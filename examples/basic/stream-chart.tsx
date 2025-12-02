'use client';

import React from 'react';
import { D3StreamChart } from '@canopy/charts';

const data = Array.from({ length: 12 }, (_, index) => ({
	date: new Date(2024, index, 1),
	alpha: 12 + Math.random() * 8,
	beta: 8 + Math.random() * 6,
	gamma: 5 + Math.random() * 4,
}));

export default function StreamChartExample() {
	return (
		<div style={{ width: 720, height: 360 }}>
			<D3StreamChart
				data={data}
				showLegend
				showTitle
				title="Engagement by Segment"
				themeColor="#A855F7"
			/>
		</div>
	);
}


