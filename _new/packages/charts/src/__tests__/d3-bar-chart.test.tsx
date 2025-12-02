import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { D3BarChart } from '@canopy/charts';

const sampleData = [
	{ label: 'A', value: 10 },
	{ label: 'B', value: 20 },
	{ label: 'C', value: 30 },
];

describe('D3BarChart', () => {
	it('renders bars for each data point', async () => {
		const { container, getByRole } = render(
			<div style={{ width: 600, height: 400 }}>
				<D3BarChart data={sampleData} showLegend showTooltips />
			</div>
		);

		await waitFor(() => {
			const figure = getByRole('figure', { name: /bar chart/i });
			expect(figure).toBeInTheDocument();
		});

		await waitFor(() => {
			const bars = container.querySelectorAll('.bar');
			expect(bars.length).toBe(sampleData.length);
		});
	});

	it('shows tooltip when hovering a bar', async () => {
		const { container, findByRole } = render(
			<div style={{ width: 600, height: 400 }}>
				<D3BarChart data={sampleData} showTooltips />
			</div>
		);

		const bar = await waitFor(() => container.querySelector('.bar'));
		expect(bar).not.toBeNull();

		fireEvent.mouseEnter(bar!);
		fireEvent.mouseMove(bar!, { clientX: 200, clientY: 150 });

		const tooltip = await findByRole('tooltip');
		expect(tooltip).toHaveTextContent('A');
	});
});

