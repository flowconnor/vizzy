"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { defaultThemeColor, generateColorVariations } from '../utils/colors';
import { ChartStyle, ChartOptions } from '../types';
import { withLoading } from '../utils/with-loading';

interface DataPoint {
	category: string;
	[key: string]: string | number;
}

interface StackedDataPoint {
	[key: string]: string | number;
	category: string;
}

type SeriesPoint = d3.SeriesPoint<StackedDataPoint>;

interface Series extends d3.Series<StackedDataPoint, string> {
	key: string;
	index: number;
}

interface D3StackedBarChartProps extends ChartOptions {
	width?: number;
	height?: number;
	data?: DataPoint[];
	title?: string;
	themeColor?: string;
	vibe?: ChartStyle;
}

const D3StackedBarChart = ({
	width = 500,
	height = 200,
	data = [
		{ category: 'A', value1: 30, value2: 20, value3: 10 },
		{ category: 'B', value1: 40, value2: 15, value3: 25 },
		{ category: 'C', value1: 20, value2: 30, value3: 15 },
		{ category: 'D', value1: 35, value2: 25, value3: 20 },
	],
	title,
	themeColor = defaultThemeColor,
	showLegend = true,
	showTooltips = true,
	showTitle = false,
}: D3StackedBarChartProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const legendKeys = data.length ? Object.keys(data[0]).filter((key) => key !== 'category') : [];

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const updateChart = () => {
			const containerRect = container.getBoundingClientRect();
			const width = containerRect.width;
			const height = containerRect.height;

			d3.select(svgRef.current).selectAll('*').remove();

			const margin = {
				top: Math.max(20, height * 0.05),
				right: Math.max(20, width * 0.05),
				bottom: Math.max(30, height * 0.1),
				left: Math.max(60, width * 0.1),
			};
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			const svg = d3
				.select(svgRef.current)
				.attr('width', width)
				.attr('height', height)
				.style('overflow', 'hidden')
				.style('display', 'block');

			const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

			const keys = Object.keys(data[0]).filter((key) => key !== 'category');

			const colors = generateColorVariations(themeColor, keys.length);
			const colorScale = d3.scaleOrdinal(colors);

			const stack = d3.stack<any>().keys(keys);
			const series = stack(data);

			const yScale = d3
				.scaleBand()
				.domain(data.map((d) => d.category))
				.range([0, innerHeight])
				.padding(0.2);

			const xScale = d3
				.scaleLinear()
				.domain([0, d3.max(series, (layer) => d3.max(layer, (d) => d[1])) || 0])
				.range([0, innerWidth])
				.nice();

			g.append('g')
				.attr('transform', `translate(0,${innerHeight})`)
				.call(d3.axisBottom(xScale))
				.selectAll('text')
				.style('font-size', `${Math.max(10, Math.min(12, width * 0.02))}px`);

			g.append('g')
				.call(d3.axisLeft(yScale))
				.selectAll('text')
				.style('font-size', `${Math.max(10, Math.min(12, width * 0.02))}px`);

			const tooltip = d3.select(tooltipRef.current);
			if (showTooltips) {
				tooltip
					.style('position', 'absolute')
					.style('visibility', 'hidden')
					.style('background-color', 'rgba(0, 0, 0, 0.8)')
					.style('color', 'white')
					.style('padding', '8px')
					.style('border-radius', '4px')
					.style('font-size', `${Math.max(10, Math.min(12, width * 0.02))}px`)
					.style('pointer-events', 'none')
					.style('z-index', '100');
			}

			g.selectAll('g.layer')
				.data(series)
				.join('g')
				.attr('class', 'layer')
				.attr('fill', (_, i) => colorScale(i.toString()))
				.selectAll('rect')
				.data((d) => d)
				.join('rect')
				.attr('y', (d) => yScale(d.data.category) || 0)
				.attr('height', yScale.bandwidth())
				.attr('x', (d) => xScale(d[0]))
				.attr('width', (d) => xScale(d[1]) - xScale(d[0]))
				.on('mouseover', function (event, d: SeriesPoint) {
					if (!showTooltips) return;
					const target = event.currentTarget as SVGRectElement | null;
					const node = target?.parentNode;
					if (!(node instanceof SVGGElement)) return;

					const parent = d3.select(node).datum() as Series;
					const key = parent.key;
					const value = d[1] - d[0];

					tooltip.style('visibility', 'visible').html(`${key}: ${value}`);

					const [x, y] = d3.pointer(event, container);
					const tooltipWidth = (tooltip.node() as HTMLElement).offsetWidth;
					const tooltipHeight = (tooltip.node() as HTMLElement).offsetHeight;

					tooltip
						.style('left', `${Math.min(x, width - tooltipWidth)}px`)
						.style('top', `${Math.max(0, y - tooltipHeight)}px`);
				})
				.on('mousemove', function (event) {
					if (!showTooltips) return;
					const [x, y] = d3.pointer(event, container);
					const tooltipWidth = (tooltip.node() as HTMLElement).offsetWidth;
					const tooltipHeight = (tooltip.node() as HTMLElement).offsetHeight;

					tooltip
						.style('left', `${Math.min(x, width - tooltipWidth)}px`)
						.style('top', `${Math.max(0, y - tooltipHeight)}px`);
				})
				.on('mouseout', function () {
					if (!showTooltips) return;
					tooltip.style('visibility', 'hidden');
				});
		};

		updateChart();

		return () => {
			if (container) {
				d3.select(container).selectAll('*').remove();
			}
		};
	}, [data, showTooltips, themeColor]);

	const legendColors = generateColorVariations(themeColor, legendKeys.length || 1);

	return (
		<div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
			{showTitle && title && (
				<div
					style={{
						position: 'absolute',
						top: 8,
						left: 16,
						fontWeight: 600,
						fontSize: '0.9rem',
						color: 'rgba(255,255,255,0.9)',
						zIndex: 1,
					}}
				>
					{title}
				</div>
			)}
			{showLegend && legendKeys.length > 0 && (
				<div
					style={{
						position: 'absolute',
						right: 12,
						top: 12,
						background: 'rgba(0,0,0,0.35)',
						padding: '6px 10px',
						borderRadius: 8,
						color: 'rgba(255,255,255,0.85)',
						fontSize: 12,
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
					}}
				>
					{legendKeys.map((key, index) => (
						<div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							<span
								style={{
									width: 10,
									height: 10,
									borderRadius: 2,
									backgroundColor: legendColors[index],
								}}
							/>
							<span>{key}</span>
						</div>
					))}
				</div>
			)}
			<svg
				ref={svgRef}
				style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }}
				viewBox="0 0 500 200"
			/>
			<div ref={tooltipRef} />
		</div>
	);
};

export default withLoading(D3StackedBarChart);

