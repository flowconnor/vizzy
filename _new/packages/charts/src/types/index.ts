/**
 * Available visual styles for charts
 */
export type ChartStyle =
	| 'evergreen'
	| 'rainforest'
	| 'ocean'
	| 'sunset'
	| 'midnight'
	| 'savanna'
	| 'tundra'
	| 'coral'
	| 'volcanic'
	| 'dunes';

/**
 * Common chart dimensions configuration
 */
export interface ChartDimensions {
	width: number;
	height: number;
	margin: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
	boundedWidth: number;
	boundedHeight: number;
}

/**
 * Common chart axis configuration
 */
export interface AxisConfig {
	showLabels?: boolean;
	labelSize?: number;
	className?: {
		text: string;
		line: string;
	};
}

export interface ChartTheme {
	primary: string;
	secondary: string;
	accent: string;
	background: string;
	text: string;
}

export interface DataPoint {
	name: string;
	[key: string]: string | number;
}

export interface ChartOptions {
	showAxes?: boolean;
	showGrid?: boolean;
	showLabels?: boolean;
	labelSize?: number;
	showTitle?: boolean;
	showLegend?: boolean;
	legendPosition?: 'left' | 'right';
	showTooltips?: boolean;
	title?: string;
	xAxisLabel?: string;
	yAxisLabel?: string;
	enableZoom?: boolean;
	enablePan?: boolean;
	gridStyle?: 'solid' | 'dashed';
	gridOpacity?: number;
}

export interface WithThemeColor {
	themeColor?: string;
}

export interface BarChartDataPoint {
	label: string;
	value: number;
}

export interface BarChartProps extends ChartOptions {
	width?: number;
	height?: number;
	data?: BarChartDataPoint[];
	themeColor?: string;
	vibe?: ChartStyle;
}
