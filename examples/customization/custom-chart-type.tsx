import React from 'react';
import { D3LineChart } from '@vizzy/charts';

const data = [
	{ name: 'Week 1', newUsers: 120, returning: 80 },
	{ name: 'Week 2', newUsers: 140, returning: 96 },
	{ name: 'Week 3', newUsers: 180, returning: 110 },
	{ name: 'Week 4', newUsers: 210, returning: 122 },
];

export default function CustomChartType() {
	return (
		<div style={{ width: '100%', maxWidth: 720, height: 360 }}>
			<D3LineChart
				data={data}
				datasets={['newUsers', 'returning']}
				themeColor="#0EA5E9"
				showLegend
				showTooltips
				showTitle
				title="Weekly Acquisition"
			/>
		</div>
	);
}