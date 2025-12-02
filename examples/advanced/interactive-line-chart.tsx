 'use client';

import { useMemo, useState } from 'react';
import { D3LineChart, ChartStyle } from '@vizzy/charts';

const defaultData = [
	{ name: 'Jan', primary: 42, secondary: 25, tertiary: 18 },
	{ name: 'Feb', primary: 51, secondary: 32, tertiary: 24 },
	{ name: 'Mar', primary: 63, secondary: 41, tertiary: 31 },
	{ name: 'Apr', primary: 58, secondary: 44, tertiary: 29 },
	{ name: 'May', primary: 72, secondary: 53, tertiary: 36 },
	{ name: 'Jun', primary: 78, secondary: 61, tertiary: 43 },
	{ name: 'Jul', primary: 83, secondary: 58, tertiary: 47 },
];

const vibes: ChartStyle[] = ['rainforest', 'sunset', 'ocean', 'midnight', 'dunes'];

export default function InteractiveLineChartExample() {
	const [themeColor, setThemeColor] = useState('#22C55E');
	const [currentVibe, setCurrentVibe] = useState<ChartStyle>('rainforest');
	const [showLegend, setShowLegend] = useState(true);
	const [showTooltips, setShowTooltips] = useState(true);
	const [showGrid, setShowGrid] = useState(true);

	const datasets = useMemo(() => ['primary', 'secondary', 'tertiary'], []);

	return (
		<div
			style={{
				borderRadius: 24,
				background: 'rgba(15,15,15,0.65)',
				border: '1px solid rgba(255,255,255,0.08)',
				padding: '1.5rem',
				display: 'grid',
				gap: '1.5rem',
			}}
		>
			<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<div>
					<p style={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: 12, opacity: 0.7 }}>Advanced Example</p>
					<h2 style={{ fontSize: '1.4rem', fontWeight: 600 }}>Interactive Product Metrics</h2>
				</div>
				<input
					type="color"
					value={themeColor}
					onChange={(event) => setThemeColor(event.target.value)}
					style={{ width: 48, height: 48, border: 'none', background: 'transparent' }}
					aria-label="Theme color"
				/>
			</header>

			<div style={{ width: '100%', height: 360 }}>
				<D3LineChart
					data={defaultData}
					datasets={datasets}
					themeColor={themeColor}
					vibe={currentVibe}
					showLegend={showLegend}
					showTooltips={showTooltips}
					showGrid={showGrid}
					showTitle
					title="Revenue, Sessions & Retention"
				/>
			</div>

			<section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
				<div>
					<label style={{ display: 'block', fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Animation vibe</label>
					<select
						value={currentVibe}
						onChange={(event) => setCurrentVibe(event.target.value as ChartStyle)}
						style={{
							width: '100%',
							background: 'rgba(255,255,255,0.05)',
							border: '1px solid rgba(255,255,255,0.1)',
							color: 'white',
							padding: '0.5rem',
							borderRadius: 10,
						}}
					>
						{vibes.map((vibe) => (
							<option key={vibe} value={vibe}>
								{vibe}
							</option>
						))}
					</select>
				</div>
				<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<input type="checkbox" checked={showLegend} onChange={(event) => setShowLegend(event.target.checked)} />
					Show legend
				</label>
				<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<input type="checkbox" checked={showTooltips} onChange={(event) => setShowTooltips(event.target.checked)} />
					Show tooltips
				</label>
				<label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} />
					Show grid
				</label>
			</section>
		</div>
	);
}