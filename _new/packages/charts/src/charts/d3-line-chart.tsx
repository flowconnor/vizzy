"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { defaultThemeColor } from '../utils/colors';
import { useChartDimensions } from '../hooks/use-chart-dimensions';
import { ChartStyle } from '../types';
import { withLoading } from '../utils/with-loading';

interface DataPoint {
	name: string;
	[key: string]: string | number;
}

interface D3LineChartProps {
	data?: DataPoint[];
	datasets?: string[];
	themeColor?: string;
	vibe?: ChartStyle;
	showAxes?: boolean;
	showGrid?: boolean;
	showLabels?: boolean;
	labelSize?: number;
	showTitle?: boolean;
	showLegend?: boolean;
	showTooltips?: boolean;
	title?: string;
}

const D3LineChart: React.FC<D3LineChartProps> = ({
	data = [
		{ name: 'Jan', value: 30 },
		{ name: 'Feb', value: 45 },
		{ name: 'Mar', value: 25 },
		{ name: 'Apr', value: 60 },
		{ name: 'May', value: 35 },
		{ name: 'Jun', value: 50 },
	],
	datasets = ['value'],
	themeColor = defaultThemeColor,
	vibe = 'evergreen',
	showAxes = true,
	showGrid = true,
	showLabels = true,
	labelSize = 12,
	showTitle = true,
	showLegend = true,
	showTooltips = true,
	title,
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const { dimensions, containerRef } = useChartDimensions({
		marginTop: 20,
		marginRight: 20,
		marginBottom: 40,
		marginLeft: 40,
	});
	const [tooltip, setTooltip] = useState<{
		visible: boolean;
		label: string;
		series: string;
		value: number;
		x: number;
		y: number;
		color: string;
	}>({
		visible: false,
		label: '',
		series: '',
		value: 0,
		x: 0,
		y: 0,
		color: themeColor,
	});
	const animationDuration = vibe === 'sunset' ? 900 : vibe === 'midnight' ? 700 : 1000;

	useEffect(() => {
		if (!svgRef.current || !dimensions.width || !dimensions.height) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove();

		const seriesKeys = datasets.filter((key) => key in data[0]);

		const xScale = d3
			.scaleBand()
			.domain(data.map((d) => d.name))
			.range([0, dimensions.boundedWidth])
			.padding(0.3);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => Math.max(...seriesKeys.map((key) => Number(d[key])))) || 0])
			.range([dimensions.boundedHeight, 0])
			.nice();

		const g = svg
			.attr('width', dimensions.width)
			.attr('height', dimensions.height)
			.append('g')
			.attr('transform', `translate(${dimensions.margin.left},${dimensions.margin.top})`);

		if (showGrid) {
			g.append('g')
				.attr('class', 'grid')
				.call(d3.axisLeft(yScale).tickSize(-dimensions.boundedWidth).tickFormat(() => '') as any)
				.style('stroke', 'rgba(255,255,255,0.1)')
				.style('stroke-dasharray', '2,2');
		}

		const line = d3
			.line<any>()
			.x((d) => (xScale(d.name) || 0) + xScale.bandwidth() / 2)
			.y((d) => yScale(d.value))
			.curve(d3.curveCardinal.tension(0.4));

		seriesKeys.forEach((key, i) => {
			const seriesData = data.map((d) => ({
				name: d.name,
				value: Number(d[key]),
			}));

			const strokeColor = i === 0 ? themeColor : `${themeColor}${Math.max(20, 80 - i * 20).toString(16)}`;

			const path = g
				.append('path')
				.datum(seriesData)
				.attr('class', 'line')
				.attr('fill', 'none')
				.attr('stroke', strokeColor)
				.attr('stroke-width', 2)
				.attr('d', line);

			const svgPath = path.node();
			const pathLength = typeof svgPath?.getTotalLength === 'function' ? svgPath.getTotalLength() : 0;
			path
				.attr('stroke-dasharray', `${pathLength} ${pathLength}`)
				.attr('stroke-dashoffset', pathLength)
				.transition()
				.duration(animationDuration)
				.ease(d3.easeQuadOut)
				.attr('stroke-dashoffset', 0);

			g.selectAll(`.dot-${key}`)
				.data(seriesData)
				.join('circle')
				.attr('class', `dot-${key}`)
				.attr('cx', (d) => (xScale(d.name) || 0) + xScale.bandwidth() / 2)
				.attr('cy', (d) => yScale(d.value))
				.attr('r', 0)
				.attr('fill', strokeColor)
				.on('mouseenter', (event, d) => {
					if (!showTooltips) return;
					const bounds = containerRef.current?.getBoundingClientRect();
					if (!bounds) return;
					setTooltip({
						visible: true,
						label: d.name,
						series: key,
						value: d.value,
						x: event.clientX - bounds.left + 12,
						y: event.clientY - bounds.top - 32,
						color: strokeColor,
					});
				})
				.on('mousemove', (event, d) => {
					if (!showTooltips) return;
					const bounds = containerRef.current?.getBoundingClientRect();
					if (!bounds) return;
					setTooltip((prev) => ({
						...prev,
						label: d.name,
						value: d.value,
						x: event.clientX - bounds.left + 12,
						y: event.clientY - bounds.top - 32,
					}));
				})
				.on('mouseleave', () => {
					if (!showTooltips) return;
					setTooltip((prev) => ({ ...prev, visible: false }));
				})
				.transition()
				.delay((_, idx) => idx * 100)
				.duration(500)
				.attr('r', 4);
		});

		if (showAxes) {
			g.append('g')
				.attr('transform', `translate(0,${dimensions.boundedHeight})`)
				.call(d3.axisBottom(xScale))
				.style('color', 'var(--text)')
				.style('font-size', `${labelSize}px`);

			g.append('g')
				.call(d3.axisLeft(yScale))
				.style('color', 'var(--text)')
				.style('font-size', `${labelSize}px`);
		}
	}, [
		animationDuration,
		containerRef,
		data,
		datasets,
		dimensions,
		labelSize,
		showAxes,
		showGrid,
		showLabels,
		showTooltips,
		themeColor,
		vibe,
	]);

	return (
		<div ref={containerRef} className="w-full h-full min-h-[300px]" style={{ position: 'relative' }}>
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
			<svg ref={svgRef} className="w-full h-full" />
			{showLegend && datasets.length > 1 && (
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
						color: 'rgba(255,255,255,0.85)',
						fontSize: 12,
					}}
				>
					{datasets.map((dataset, index) => {
						const color = index === 0 ? themeColor : `${themeColor}${Math.max(20, 80 - index * 20).toString(16)}`;
						return (
							<div key={dataset} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
								<span
									style={{
										width: 10,
										height: 2,
										backgroundColor: color,
										display: 'inline-block',
									}}
								/>
								<span>{dataset}</span>
							</div>
						);
					})}
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
						border: `1px solid ${tooltip.color}`,
					}}
				>
					<div style={{ fontWeight: 600 }}>{tooltip.label}</div>
					<div>
						{tooltip.series}: {tooltip.value}
					</div>
				</div>
			)}
		</div>
	);
};

export default withLoading(D3LineChart);

