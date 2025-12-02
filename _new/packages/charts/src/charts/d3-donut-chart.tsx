"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { defaultThemeColor, generateColorVariations } from '../utils/colors';
import { ChartStyle, ChartOptions } from '../types';
import { withLoading } from '../utils/with-loading';

interface DataPoint {
	label: string;
	value: number;
}

interface D3DonutChartProps extends ChartOptions {
	width?: number;
	height?: number;
	data?: DataPoint[];
	themeColor?: string;
	vibe?: ChartStyle;
}

const D3DonutChart: React.FC<D3DonutChartProps> = ({
	width = 500,
	height = 275,
	data = [
		{ label: 'A', value: 30 },
		{ label: 'B', value: 20 },
		{ label: 'C', value: 25 },
		{ label: 'D', value: 15 },
		{ label: 'E', value: 10 },
	],
	title,
	themeColor = defaultThemeColor,
	showLegend = true,
	showTooltips = true,
	showTitle = true,
}) => {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [tooltip, setTooltip] = useState<{
		visible: boolean;
		label: string;
		value: number;
		x: number;
		y: number;
	}>({
		visible: false,
		label: '',
		value: 0,
		x: 0,
		y: 0,
	});
	const legendColors = useMemo(() => generateColorVariations(themeColor, data.length), [data.length, themeColor]);

	useEffect(() => {
		if (!svgRef.current) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll('*').remove();

		const margin = { top: 20, right: 20, bottom: 20, left: 20 };
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;
		const radius = Math.min(innerWidth, innerHeight) / 2;

		const g = svg
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		const colors = generateColorVariations(themeColor, data.length);
		const color = d3.scaleOrdinal(colors);

		const pie = d3
			.pie<DataPoint>()
			.value((d) => d.value)
			.sort(null);

		const arc = d3
			.arc<d3.PieArcDatum<DataPoint>>()
			.innerRadius(radius * 0.6)
			.outerRadius(radius * 0.9);

		const outerArc = d3
			.arc<d3.PieArcDatum<DataPoint>>()
			.innerRadius(radius * 0.9)
			.outerRadius(radius * 0.9);

		g.selectAll('path')
			.data(pie(data))
			.enter()
			.append('path')
			.attr('d', arc)
			.attr('fill', (d) => color(d.data.label))
			.attr('stroke', 'white')
			.attr('stroke-width', 2)
			.attr('opacity', 0.8)
			.on('mouseover', function (event, d) {
				d3.select(this)
					.transition()
					.duration(200)
					.attr('opacity', 1)
					.attr('outerRadius', radius * 0.95);
				if (!showTooltips) return;
				const bounds = containerRef.current?.getBoundingClientRect();
				if (!bounds) return;
				setTooltip({
					visible: true,
					label: d.data.label,
					value: d.data.value,
					x: event.clientX - bounds.left,
					y: event.clientY - bounds.top,
				});
			})
			.on('mousemove', (event, d) => {
				if (!showTooltips) return;
				const bounds = containerRef.current?.getBoundingClientRect();
				if (!bounds) return;
				setTooltip((prev) => ({
					...prev,
					label: d.data.label,
					value: d.data.value,
					x: event.clientX - bounds.left,
					y: event.clientY - bounds.top,
				}));
			})
			.on('mouseout', function () {
				d3.select(this)
					.transition()
					.duration(200)
					.attr('opacity', 0.8)
					.attr('outerRadius', radius * 0.9);
				if (!showTooltips) return;
				setTooltip((prev) => ({ ...prev, visible: false }));
			});

		const label = g
			.selectAll('text')
			.data(pie(data))
			.enter()
			.append('text')
			.attr('dy', '.35em');

		label
			.append('tspan')
			.attr('x', 0)
			.attr('y', '-0.7em')
			.text((d) => d.data.label)
			.attr('fill', 'white')
			.attr('text-anchor', 'middle')
			.style('font-size', '12px');

		label
			.append('tspan')
			.attr('x', 0)
			.attr('y', '0.7em')
			.text((d) => d.data.value)
			.attr('fill', 'white')
			.attr('text-anchor', 'middle')
			.style('font-size', '12px');

		const midAngle = (d: d3.PieArcDatum<DataPoint>) => d.startAngle + (d.endAngle - d.startAngle) / 2;

		label
			.attr('transform', (d) => {
				const pos = outerArc.centroid(d);
				pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
				return `translate(${pos})`;
			})
			.attr('text-anchor', (d) => (midAngle(d) < Math.PI ? 'start' : 'end'));

		g.selectAll('polyline')
			.data(pie(data))
			.enter()
			.append('polyline')
			.attr('points', (d) => {
				const pos = outerArc.centroid(d);
				pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
				const points = [arc.centroid(d), outerArc.centroid(d), pos];
				return points.map((p) => p.join(',')).join(' ');
			})
			.attr('stroke', 'white')
			.attr('fill', 'none')
			.attr('opacity', 0.3);

		if (showTitle && title) {
			svg
				.append('text')
				.attr('x', width / 2)
				.attr('y', margin.top)
				.attr('text-anchor', 'middle')
				.attr('fill', 'white')
				.text(title);
		}
	}, [data, height, showTitle, showTooltips, themeColor, title, width]);

	return (
		<div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
			{showLegend && (
				<div
					style={{
						position: 'absolute',
						right: 12,
						top: 12,
						background: 'rgba(0,0,0,0.4)',
						padding: '6px 10px',
						borderRadius: 8,
						color: 'rgba(255,255,255,0.85)',
						fontSize: 12,
						display: 'flex',
						flexDirection: 'column',
						gap: 4,
					}}
				>
					{data.map((slice, index) => (
						<div key={slice.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
							<span
								style={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									backgroundColor: legendColors[index],
									opacity: 0.8,
								}}
							/>
							<span>{slice.label}</span>
						</div>
					))}
				</div>
			)}
			<svg
				ref={svgRef}
				style={{ width: '100%', height: '100%' }}
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="xMidYMid meet"
			/>
			{showTooltips && tooltip.visible && (
				<div
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

export default withLoading(D3DonutChart);

