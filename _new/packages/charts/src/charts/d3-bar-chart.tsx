'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { defaultThemeColor } from '../utils/colors';
import { useChartDimensions } from '../hooks/use-chart-dimensions';
import { ChartStyle, ChartOptions } from '../types';
import { withLoading } from '../utils/with-loading';

interface DataPoint {
	label: string;
	value: number;
}

interface D3BarChartProps extends ChartOptions {
	width?: number;
	height?: number;
	data?: DataPoint[];
	themeColor?: string;
	vibe?: ChartStyle;
}

interface TooltipState {
	visible: boolean;
	label: string;
	value: number;
	x: number;
	y: number;
}

const vibeConfigs: Partial<Record<ChartStyle, { animationDuration: number; hoverScale: number }>> = {
	rainforest: { animationDuration: 900, hoverScale: 1.03 },
	ocean: { animationDuration: 800, hoverScale: 1.025 },
	sunset: { animationDuration: 700, hoverScale: 1.04 },
	midnight: { animationDuration: 600, hoverScale: 1.015 },
	dunes: { animationDuration: 750, hoverScale: 1.02 },
	savanna: { animationDuration: 820, hoverScale: 1.03 },
};

const D3BarChart: React.FC<D3BarChartProps> = ({
	data = [
		{ label: 'A', value: 30 },
		{ label: 'B', value: 45 },
		{ label: 'C', value: 25 },
		{ label: 'D', value: 60 },
		{ label: 'E', value: 35 },
	],
	themeColor = defaultThemeColor,
	vibe = 'evergreen',
	showAxes = true,
	showGrid = true,
	showLabels = true,
	labelSize = 12,
	showLegend = false,
	showTooltips = true,
	showTitle = false,
	title,
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const { dimensions, containerRef } = useChartDimensions({
		marginTop: 20,
		marginRight: 20,
		marginBottom: 40,
		marginLeft: 40,
	});
	const [tooltip, setTooltip] = useState<TooltipState>({
		visible: false,
		label: '',
		value: 0,
		x: 0,
		y: 0,
	});
	const vibeAnimation = vibeConfigs[vibe] || { animationDuration: 750, hoverScale: 1.02 };
	const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';

	useEffect(() => {
		if (!svgRef.current || !dimensions.width || !dimensions.height) return;

		// Clear previous content
		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove();

		// Set up scales
		const xScale = d3
			.scaleBand()
			.domain(data.map((d) => d.label))
			.range([0, dimensions.boundedWidth])
			.padding(0.3);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value) || 0])
			.range([dimensions.boundedHeight, 0])
			.nice();

		// Create the SVG group with margins
		const g = svg
			.attr('width', dimensions.width)
			.attr('height', dimensions.height)
			.append('g')
			.attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

		// Add grid lines if enabled
		if (showGrid) {
			const yAxis = d3.axisLeft(yScale).tickSize(-dimensions.boundedWidth).tickFormat(null);

			g.append('g')
				.attr('class', 'grid')
				.call(yAxis as any)
				.style('stroke', 'rgba(255,255,255,0.1)')
				.style('stroke-dasharray', '2,2');
		}

		// Draw bars
		const bars = g
			.selectAll('.bar')
			.data(data)
			.join('rect')
			.attr('class', 'bar')
			.attr('x', (d) => xScale(d.label) || 0)
			.attr('y', (d) => yScale(d.value))
			.attr('width', xScale.bandwidth())
			.attr('height', (d) => dimensions.boundedHeight - yScale(d.value))
			.attr('fill', themeColor)
			.attr('rx', 4)
			.attr('ry', 4)
			.style('opacity', isTestEnv ? 1 : 0)
			.on('mousemove', (event, d) => {
				if (!showTooltips) return;
				const bounds = containerRef.current?.getBoundingClientRect();
				if (!bounds) return;
				setTooltip({
					visible: true,
					label: d.label,
					value: d.value,
					x: event.clientX - bounds.left + 12,
					y: event.clientY - bounds.top - 32,
				});
			})
			.on('mouseleave', () => {
				if (!showTooltips) return;
				setTooltip((prev) => ({ ...prev, visible: false }));
			})
			.on('mouseenter', function () {
				const selection = d3.select(this);
				if (isTestEnv) {
					selection.style('transform', `scale(${vibeAnimation.hoverScale})`).style('transform-origin', 'bottom center');
					return;
				}

				selection
					.transition()
					.duration(150)
					.style('transform', `scale(${vibeAnimation.hoverScale})`)
					.style('transform-origin', 'bottom center');
			})
			.on('mouseout', function () {
				const selection = d3.select(this);
				if (isTestEnv) {
					selection.style('transform', 'scale(1)');
					return;
				}

				selection.transition().duration(150).style('transform', 'scale(1)');
			})
			;

		if (!isTestEnv) {
			bars
				.transition()
				.duration(vibeAnimation.animationDuration)
				.style('opacity', 1);
		}

		// Add axes if enabled
		if (showAxes) {
			// X Axis
			const xAxis = g
				.append('g')
				.attr('class', 'x-axis')
				.attr('transform', `translate(0,${dimensions.boundedHeight})`)
				.call(d3.axisBottom(xScale));

			if (showLabels) {
				xAxis
					.selectAll('text')
					.style('font-size', `${labelSize}px`)
					.style('fill', 'rgba(255,255,255,0.8)');
			}

			// Y Axis
			const yAxis = g.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale));

			if (showLabels) {
				yAxis
					.selectAll('text')
					.style('font-size', `${labelSize}px`)
					.style('fill', 'rgba(255,255,255,0.8)');
			}

			// Style axis lines
			g.selectAll('.domain, .tick line').style('stroke', 'rgba(255,255,255,0.2)');
		}
	}, [
		containerRef,
		data,
		dimensions,
		labelSize,
		showAxes,
		showGrid,
		showLabels,
		showTooltips,
		themeColor,
		vibe,
		vibeAnimation.animationDuration,
	]);

	return (
		<div
			ref={containerRef}
			style={{ width: '100%', height: '100%', position: 'relative' }}
			role="figure"
			aria-label="Bar chart visualization"
		>
			{showTitle && title && (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						textAlign: 'center',
						fontWeight: 600,
						fontSize: '0.95rem',
						color: 'rgba(255,255,255,0.9)',
						pointerEvents: 'none',
					}}
				>
					{title}
				</div>
			)}
			<svg ref={svgRef} style={{ width: '100%', height: '100%', overflow: 'visible' }} />
			{showLegend && (
				<div
					style={{
						position: 'absolute',
						right: 8,
						top: 8,
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
						background: 'rgba(0,0,0,0.4)',
						padding: '6px 10px',
						borderRadius: 8,
						backdropFilter: 'blur(6px)',
						color: 'rgba(255,255,255,0.85)',
						fontSize: 12,
					}}
				>
					{data.map((d) => (
						<div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							<span
								style={{
									width: 8,
									height: 8,
									borderRadius: 2,
									backgroundColor: themeColor,
									opacity: 0.8,
								}}
							/>
							<span>{d.label}</span>
						</div>
					))}
				</div>
			)}
			{showTooltips && tooltip.visible && (
				<div
					role="tooltip"
					style={{
						position: 'absolute',
						top: tooltip.y,
						left: tooltip.x,
						transform: 'translate(-50%, -100%)',
						background: 'rgba(0,0,0,0.8)',
						color: 'white',
						padding: '6px 10px',
						borderRadius: 8,
						fontSize: 12,
						pointerEvents: 'none',
						whiteSpace: 'nowrap',
						boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
					}}
				>
					<div style={{ fontWeight: 600 }}>{tooltip.label}</div>
					<div>{tooltip.value}</div>
				</div>
			)}
		</div>
	);
};

export default withLoading(D3BarChart);

