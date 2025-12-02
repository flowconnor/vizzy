'use client';

import React from 'react';
import { D3TreeMap } from '@vizzy/charts';

const data = {
	name: 'Company',
	value: 0,
	children: [
		{ name: 'Marketing', value: 28 },
		{ name: 'Product', value: 42 },
		{ name: 'Sales', value: 22 },
		{ name: 'Support', value: 18 },
	],
};

export default function TreeMapExample() {
	return (
		<div style={{ width: 640, height: 360 }}>
			<D3TreeMap
				data={data}
				showLegend
				showTitle
				title="Budget Allocation"
				themeColor="#EF4444"
			/>
		</div>
	);
}


