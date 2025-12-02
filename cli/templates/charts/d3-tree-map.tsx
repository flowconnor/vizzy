import React from 'react';
import { D3TreeMap } from '@canopy/charts';

const sampleData = {
	name: 'Portfolio',
	value: 0,
	children: [
		{ name: 'Advertising', value: 32 },
		{ name: 'SaaS', value: 24 },
		{ name: 'Commerce', value: 18 },
		{ name: 'Services', value: 12 },
	],
};

export type TreeMapProps = React.ComponentProps<typeof D3TreeMap>;

export default function TreeMap(props: TreeMapProps) {
	const { data = sampleData, themeColor = '#F97316', ...rest } = props;

	return (
		<D3TreeMap
			data={data}
			themeColor={themeColor}
			{...rest}
		/>
	);
}


