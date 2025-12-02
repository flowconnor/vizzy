# Vizzy

A world-class, extensible charting library built with D3.js and React. Designed for modern web applications with a focus on performance, accessibility, and developer experience.

## Features

- 📊 Multiple chart types (Bar, Line, with more coming soon)
- 🎨 Consistent design language across all chart types
- 📱 Responsive and mobile-friendly with touch support
- 🔍 Interactive zoom and pan capabilities
- 🌓 Light and dark mode support
- 🎭 Multiple animation styles ("vibes")
- 🧩 Highly customizable through a consistent configuration API
- ♿ Accessible by default with proper ARIA attributes
- 🚀 Optimized for performance with efficient rendering

## Installation

```bash
npm install @vizzy/charts
# or
yarn add @vizzy/charts
```

## Quick Start

```tsx
import {
	D3BarChart,
	D3LineChart,
	ChartStyle,
	ChartOptions
} from '@vizzy/charts';

const sampleBarData = [
	{ label: 'North', value: 18 },
	{ label: 'South', value: 22 },
	{ label: 'East', value: 30 },
	{ label: 'West', value: 26 },
];

export function BarExample() {
	return (
		<D3BarChart
			data={sampleBarData}
			showLegend
			showTitle
			title="Regional Revenue"
			themeColor="#22C55E"
			vibe={'rainforest' satisfies ChartStyle}
		/>
	);
}

const sampleLineData = [
	{ name: 'Jan', primary: 24, secondary: 14 },
	{ name: 'Feb', primary: 30, secondary: 18 },
	{ name: 'Mar', primary: 42, secondary: 21 },
];

export function LineExample() {
	return (
		<D3LineChart
			data={sampleLineData}
			datasets={['primary', 'secondary']}
			showLegend
			showTooltips
			themeColor="#0EA5E9"
			title="Monthly Sessions"
			showTitle
		/>
	);
}
```

## Chart Types

Each D3 component accepts `ChartOptions` (axes, grid, tooltip, legend, title, vibes) plus chart-specific props:

| Component              | Required props                     | Notes                                                            |
| ---------------------- | ---------------------------------- | ---------------------------------------------------------------- |
| `D3BarChart`           | `data: { label: string; value }[]` | `showLegend`, `showTitle`, `themeColor`, `vibe`                  |
| `D3LineChart`          | `data`, `datasets: string[]`       | Supports multiple series; `showPoints`, `lineCurve`, `title`     |
| `D3DonutChart`         | `data: { label: string; value }[]` | Legend + tooltip position automatically; `themeColor` as accent  |
| `D3StackedBarChart`    | `data: Record<string, number>`     | Accepts multiple keys per row; legend lists each dataset         |
| `D3StreamChart`        | `data: { date: Date; series… }[]`  | Uses streamgraph layout; `themeColor` sets the palette seed      |
| `D3TreeMap`            | `data: { name; value; children? }` | Displays hierarchies; `showLegend`, `showTooltips`, `vibe`       |

Each chart ships fully typed so you can hover-autocomplete props in TypeScript or copy/paste the examples above as a starting point.

## Configuration

All chart types share a consistent configuration API through the `config` prop. Here are the common configuration options:

### Common Options

| Option              | Type                | Default     | Description                       |
| ------------------- | ------------------- | ----------- | --------------------------------- |
| `showXAxis`         | boolean             | `true`      | Show/hide the X axis              |
| `showYAxis`         | boolean             | `true`      | Show/hide the Y axis              |
| `showXGrid`         | boolean             | `true`      | Show/hide the X grid lines        |
| `showYGrid`         | boolean             | `true`      | Show/hide the Y grid lines        |
| `showAxisLabels`    | boolean             | `true`      | Show/hide axis labels             |
| `showTooltip`       | boolean             | `true`      | Show/hide tooltips on hover       |
| `showLegend`        | boolean             | `true`      | Show/hide the legend              |
| `legendPosition`    | 'left' \| 'right'   | `'right'`   | Position of the legend            |
| `labelSize`         | number              | `12`        | Font size for axis labels         |
| `gridStyle`         | 'solid' \| 'dashed' | `'dashed'`  | Style of grid lines               |
| `gridOpacity`       | number              | `0.08`      | Opacity of grid lines             |
| `axisOpacity`       | number              | `0.5`       | Opacity of axis lines             |
| `chartTitle`        | string              | `undefined` | Title of the chart                |
| `enableZoom`        | boolean             | `false`     | Enable zoom and pan functionality |
| `animationDuration` | number              | `750`       | Duration of animations in ms      |

### Bar Chart Specific Options

| Option         | Type   | Default | Description                |
| -------------- | ------ | ------- | -------------------------- |
| `barPadding`   | number | `0.2`   | Padding between bars (0-1) |
| `cornerRadius` | number | `4`     | Radius for bar corners     |

### Line Chart Specific Options

| Option         | Type                                 | Default      | Description                 |
| -------------- | ------------------------------------ | ------------ | --------------------------- |
| `lineWidth`    | number                               | `2`          | Width of the line           |
| `lineCurve`    | 'linear' \| 'cardinal' \| 'monotone' | `'cardinal'` | Type of curve interpolation |
| `lineOpacity`  | number                               | `0.8`        | Opacity of the line         |
| `showPoints`   | boolean                              | `true`       | Show/hide data points       |
| `pointSize`    | number                               | `4`          | Size of data points         |
| `pointOpacity` | number                               | `0.8`        | Opacity of data points      |

## Animation Vibes

The library supports different animation styles through the `vibe` prop:

- `rainforest` - Organic, lush feel with gentle swaying
- `savanna` - Warm, expansive with radiant movements
- `tundra` - Crisp, cool with crystalline transitions
- `coral` - Fluid, flowing with wave-like motions
- `volcanic` - Intense, dynamic with rising effects
- `dunes` - Subtle, smooth transitions

## Accessibility

All charts include proper ARIA attributes and keyboard navigation support. The library follows best practices for creating accessible data visualizations.

## Browser Support

The library supports all modern browsers including:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT © Vizzy
