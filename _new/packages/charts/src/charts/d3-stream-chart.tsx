"use client";

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { defaultThemeColor, generateColorVariations } from '../utils/colors';
import { ChartStyle, ChartOptions } from '../types';
import { withLoading } from '../utils/with-loading';

interface DataPoint {
	date: Date;
	[key: string]: Date | number;
}

interface D3StreamChartProps extends ChartOptions {
	width?: number;
	height?: number;
	data?: DataPoint[];
	title?: string;
	themeColor?: string;
	vibe?: ChartStyle;
}

const D3StreamChart = ({
	width = 500,
	height = 200,
	data = Array.from({ length: 20 }, (_, i) => ({
		date: new Date(2024, 0, i + 1),
		A: Math.random() * 50,
		B: Math.random() * 40,
		C: Math.random() * 30,
		D: Math.random() * 20,
	})),
	title,
	themeColor = defaultThemeColor,
	showLegend = true,
	showTooltips = true,
	showTitle = false,
}: D3StreamChartProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const streamKeys = data.length ? Object.keys(data[0]).filter((key) => key !== 'date') : [];

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const updateChart = () => {
			const containerRect = container.getBoundingClientRect();
			const width = containerRect.width;
			const height = containerRect.height;

			d3.select(svgRef.current).selectAll('*').remove();

			const margin = { top: 20, right: 20, bottom: 30, left: 40 };
			const innerWidth = width - margin.left - margin.right;
			const innerHeight = height - margin.top - margin.bottom;

			const svg = d3
				.select(svgRef.current)
				.attr('width', width)
				.attr('height', height)
				.attr('viewBox', [0, 0, width, height] as any)
				.style('overflow', 'visible')
				.style('display', 'block');

			const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

			const keys = Object.keys(data[0]).filter((key) => key !== 'date');

			const colors = generateColorVariations(themeColor, keys.length);
			const colorScale = d3.scaleOrdinal(colors);

			const xScale = d3.scaleTime().domain(d3.extent(data, (d) => d.date) as [Date, Date]).range([0, innerWidth]);

			const yScale = d3
				.scaleLinear()
				.domain([
					d3.min(data, (d) => d3.min(keys, (key) => d[key] as number)) || 0,
					d3.max(data, (d) => d3.max(keys, (key) => d[key] as number)) || 0,
				])
				.range([innerHeight, 0]);

			const stack = d3.stack<any>().keys(keys).offset(d3.stackOffsetWiggle).order(d3.stackOrderNone);

			const series = stack(data);

			const area = d3
				.area<any>()
				.x((d) => xScale(d.data.date))
				.y0((d) => yScale(d[0]))
				.y1((d) => yScale(d[1]))
				.curve(d3.curveBasis);

			const tooltip = d3.select(tooltipRef.current);
			if (showTooltips) {
				tooltip
					.style('position', 'absolute')
					.style('visibility', 'hidden')
					.style('background-color', 'rgba(0, 0, 0, 0.8)')
					.style('color', 'white')
					.style('padding', '8px')
					.style('border-radius', '4px')
					.style('font-size', '12px')
					.style('pointer-events', 'none');
			}

			g.selectAll('path')
				.data(series)
				.join('path')
				.attr('fill', (_, i) => colorScale(i.toString()))
				.attr('opacity', 0.8)
				.attr('d', area)
				.attr('cursor', 'pointer')
				.on('mouseover', function () {
					d3.select(this)
						.transition()
						.duration(200)
						.attr('opacity', 1)
						.attr('transform', 'scale(1.02)');
				})
				.on('mousemove', function (event, d) {
					if (!showTooltips) return;
					const [mouseX, mouseY] = d3.pointer(event);
					const date = xScale.invert(mouseX);
					const bisect = d3.bisector((datum: any) => datum.date).left;
					const index = bisect(data, date);
					const dataPoint = data[index];

					if (dataPoint) {
						const key = d.key;
						const value = dataPoint[key];
						tooltip
							.style('visibility', 'visible')
							.style('left', `${event.pageX + 10}px`)
							.style('top', `${event.pageY - 10}px`)
							.html(
								`<div>
									<strong>${key}</strong><br/>
									Date: ${dataPoint.date.toLocaleDateString()}<br/>
									Value: ${Math.round(value as number)}
								</div>`
							);
					}
				})
				.on('mouseout', function () {
					d3.select(this)
						.transition()
						.duration(200)
						.attr('opacity', 0.8)
						.attr('transform', 'scale(1)');
					if (showTooltips) {
						tooltip.style('visibility', 'hidden');
					}
				})
				.transition()
				.duration(1000)
				.attr('opacity', 0.8);

			const xAxis = g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(xScale).ticks(5));

			xAxis.transition().duration(1000).attr('opacity', 1);

			g.selectAll('.domain').attr('stroke', '#666');
			g.selectAll('.tick line').attr('stroke', '#666');
			g.selectAll('.tick text').attr('fill', '#666');

			const verticalLine = g
				.append('line')
				.attr('stroke', '#666')
				.attr('stroke-width', 1)
				.attr('stroke-dasharray', '5,5')
				.style('opacity', 0);

			svg.on('mousemove', function (event) {
				const [mouseX] = d3.pointer(event);
				verticalLine.attr('x1', mouseX).attr('x2', mouseX).attr('y1', 0).attr('y2', innerHeight).style('opacity', 1);
			}).on('mouseout', function () {
				verticalLine.style('opacity', 0);
			});
		};

		updateChart();

		return () => {
			if (container) {
				d3.select(container).selectAll('*').remove();
			}
		};
	}, [data, showTooltips, themeColor]);

	return (
		<div ref={containerRef} className="relative w-full h-full overflow-hidden">
			{showTitle && title && (
				<div
					style={{
						position: 'absolute',
						top: 12,
						left: 16,
						zIndex: 1,
						fontWeight: 600,
						fontSize: '0.95rem',
						color: 'rgba(255,255,255,0.9)',
					}}
				>
					{title}
				</div>
			)}
			{showLegend && streamKeys.length > 0 && (
				<div
					style={{
						position: 'absolute',
						right: 12,
						top: 12,
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
						background: 'rgba(0,0,0,0.35)',
						padding: '6px 10px',
						borderRadius: 8,
						color: 'rgba(255,255,255,0.85)',
						fontSize: 12,
					}}
				>
					{streamKeys.map((key, index) => (
						<div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							<span
								style={{
									width: 10,
									height: 10,
									borderRadius: 999,
									backgroundColor: generateColorVariations(themeColor, streamKeys.length)[index],
								}}
							/>
							<span>{key}</span>
						</div>
					))}
				</div>
			)}
			<svg ref={svgRef} className="absolute inset-0" />
			<div ref={tooltipRef} />
		</div>
	);
};

export default withLoading(D3StreamChart);

