import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { D3LineChart } from '@canopy/charts';

const lineData = [
	{ name: 'Jan', primary: 12, secondary: 20 },
	{ name: 'Feb', primary: 18, secondary: 24 },
	{ name: 'Mar', primary: 25, secondary: 28 },
];

describe('D3LineChart', () => {
	it('renders datasets and legend entries', async () => {
		const { container } = render(
			<div style={{ width: 640, height: 360 }}>
				<D3LineChart data={lineData} datasets={['primary', 'secondary']} showLegend />
			</div>
		);

		await waitFor(() => {
			const lines = container.querySelectorAll('path.line');
			expect(lines.length).toBe(2);
		});

		await waitFor(() => {
			const legendItems = container.querySelectorAll('[style*="flex-direction: column"] span');
			expect(legendItems.length).toBeGreaterThan(0);
		});
	});

	it('displays tooltips for line points', async () => {
		const { container, findByText } = render(
			<div style={{ width: 640, height: 360 }}>
				<D3LineChart data={lineData} datasets={['primary', 'secondary']} showTooltips />
			</div>
		);

		const point = await waitFor(() => container.querySelector('circle.dot-primary'));
		expect(point).not.toBeNull();

		fireEvent.mouseEnter(point!, { clientX: 180, clientY: 150 });
		expect(await findByText(/primary.*12/i)).toBeInTheDocument();
	});
});

