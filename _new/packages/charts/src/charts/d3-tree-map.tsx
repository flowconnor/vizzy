"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useChartDimensions } from '../hooks/use-chart-dimensions';
import { ChartStyle } from '../types';
import { withLoading } from '../utils/with-loading';

interface DataPoint {
	name: string;
	value: number;
	children?: DataPoint[];
}

export type VibeType =
	| 'rainforest'
	| 'savanna'
	| 'tundra'
	| 'coral'
	| 'volcanic'
	| 'dunes'
	| 'evergreen';

interface D3TreeMapProps {
	width?: number;
	height?: number;
	data: DataPoint;
	padding?: number;
	themeColor?: string;
	tooltipBackgroundColor?: string;
	tooltipTextColor?: string;
	vibe?: VibeType;
	showLegend?: boolean;
	showAxes?: boolean;
	showGrid?: boolean;
	showLabels?: boolean;
	labelSize?: number;
	showTitle?: boolean;
	showTooltips?: boolean;
	className?: string;
}

type TreemapNode = d3.HierarchyRectangularNode<DataPoint>;

const D3TreeMap: React.FC<D3TreeMapProps> = ({
	width = 500,
	height = 250,
	data = {
		name: 'root',
		value: 0,
		children: [
			{ name: 'Sample 1', value: 100 },
			{ name: 'Sample 2', value: 200 },
			{ name: 'Sample 3', value: 300 },
		],
	},
	padding = 2,
	themeColor = '#22C55E',
	tooltipBackgroundColor = '#1B1B1B',
	tooltipTextColor = '#ffffff',
	vibe = 'evergreen',
	showLegend = true,
	showAxes = false,
	showGrid = false,
	showLabels = true,
	labelSize = 12,
	showTitle = false,
	showTooltips = true,
	className = '',
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const { dimensions } = useChartDimensions();
	const [legendVisible, setLegendVisible] = useState(showLegend);

	useEffect(() => {
		if (!svgRef.current || !data) return;

		d3.select(svgRef.current).selectAll('*').remove();

		const margin = {
			top: padding,
			right: padding,
			bottom: padding,
			left: padding,
		};

		const availableHeight = height - margin.top - margin.bottom;
		const titleHeight = showTitle ? 40 : 0;
		const legendHeight = showLegend ? Math.min(30, availableHeight * 0.1) : 0;
		const legendMargin = showLegend ? 12 : 0;

		margin.top += titleHeight;
		margin.bottom += legendHeight + legendMargin;

		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;

		const svg = d3
			.select(svgRef.current)
			.attr('width', width)
			.attr('height', height)
			.style('overflow', 'visible');

		if (showTitle) {
			const titleGradient = svg.append('defs').append('linearGradient').attr('id', 'titleGradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');

			const color = d3.color(themeColor);
			const brighterColor = color?.brighter(0.5)?.toString() || themeColor;

			titleGradient
				.append('stop')
				.attr('offset', '0%')
				.attr('stop-color', themeColor)
				.attr('stop-opacity', 0.2);

			titleGradient
				.append('stop')
				.attr('offset', '100%')
				.attr('stop-color', brighterColor)
				.attr('stop-opacity', 0.4);

			svg.append('text').attr('x', width / 2).attr('y', 24).attr('text-anchor', 'middle').attr('fill', 'url(#titleGradient)').attr('font-size', 20).attr('font-weight', 600).text(typeof data === 'object' ? data.name : 'Tree Map');
		}

		const hierarchyRoot = d3
			.hierarchy<DataPoint>(data)
			.sum((d) => d.value)
			.sort((a, b) => (b.value || 0) - (a.value || 0));

		const treemap = d3.treemap<DataPoint>().size([innerWidth, innerHeight]).paddingInner(padding).round(true);

		const treemapRoot = treemap(hierarchyRoot) as TreemapNode;
		const leaves = treemapRoot.leaves() as TreemapNode[];

		const container = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

		const colorScale = d3.scaleSequential(d3.interpolateCubehelixDefault).domain([0, treemapRoot.children?.length || 1]);

		const createGlow = (color: string, id: string) => {
			const defs = svg.append('defs');
			const filter = defs.append('filter').attr('id', id).attr('height', '200%').attr('width', '200%').attr('x', '-50%').attr('y', '-50%');

			filter
				.append('feDropShadow')
				.attr('dx', 0)
				.attr('dy', 0)
				.attr('stdDeviation', 5)
				.attr('flood-color', color)
				.attr('flood-opacity', 0.3);
		};

		createGlow(themeColor, 'nodeGlow');

		const nodes = container
			.selectAll<SVGGElement, TreemapNode>('g')
			.data(leaves)
			.join('g')
			.attr('transform', (d) => `translate(${d.x0},${d.y0})`);

		nodes
			.append('rect')
			.attr('width', (d) => Math.max(0, d.x1 - d.x0))
			.attr('height', (d) => Math.max(0, d.y1 - d.y0))
			.attr('rx', 6)
			.attr('ry', 6)
			.style('fill', (_, i) => colorScale(i))
			.style('opacity', 0.9)
			.style('stroke', 'rgba(255,255,255,0.1)')
			.style('stroke-width', 1)
			.style('filter', 'url(#nodeGlow)')
			.on('mouseover', function () {
				d3.select(this)
					.transition()
					.duration(200)
					.style('opacity', 1)
					.style('transform', 'translate(-2px, -2px) scale(1.02)');
			})
			.on('mouseout', function () {
				d3.select(this)
					.transition()
					.duration(200)
					.style('opacity', 0.9)
					.style('transform', 'translate(0, 0) scale(1)');
			});

		if (showLabels) {
			const textGroup = nodes.append('g').attr('class', 'label-group');

			textGroup
				.append('text')
				.attr('x', 8)
				.attr('y', 20)
				.attr('fill', 'white')
				.style('font-size', `${labelSize}px`)
				.style('font-weight', 600)
				.style('text-shadow', '0 2px 4px rgba(0,0,0,0.4)')
				.text((d) => d.data.name);

			textGroup
				.append('text')
				.attr('x', 8)
				.attr('y', 40)
				.attr('fill', 'rgba(255,255,255,0.8)')
				.style('font-size', `${Math.max(10, labelSize - 2)}px`)
				.text((d) => d3.format('~s')(d.value || 0));
		}

		if (showLegend) {
			const legend = svg
				.append('g')
				.attr('transform', `translate(${margin.left},${height - margin.bottom + 20})`)
				.attr('class', 'treemap-legend');

			legend
				.selectAll('g')
				.data(treemapRoot.children || [])
				.join('g')
				.attr('transform', (_, i) => `translate(${i * 120}, 0)`)
				.each(function (d, i) {
					d3.select(this)
						.append('rect')
						.attr('width', 12)
						.attr('height', 12)
						.attr('rx', 3)
						.attr('ry', 3)
						.attr('fill', colorScale(i))
						.attr('opacity', 0.9);

					d3.select(this)
						.append('text')
						.attr('x', 18)
						.attr('y', 10)
						.attr('fill', 'rgba(255,255,255,0.9)')
						.attr('font-size', 12)
						.text(d.data.name);
				});
		}

		const tooltip = d3.select(tooltipRef.current);
		tooltip.style('visibility', 'hidden');

		if (showTooltips) {
			nodes
				.on('mousemove', (event, d) => {
					const tooltipWidth = (tooltip.node() as HTMLElement).offsetWidth;
					const tooltipHeight = (tooltip.node() as HTMLElement).offsetHeight;

					tooltip
						.style('visibility', 'visible')
						.style('position', 'fixed')
						.style('pointer-events', 'none')
						.style('background-color', tooltipBackgroundColor)
						.style('color', tooltipTextColor)
						.style('padding', '12px 16px')
						.style('border-radius', '12px')
						.style('box-shadow', `0 10px 40px rgba(0,0,0,0.25)`)
						.style('backdrop-filter', 'blur(12px)')
						.style('border', `1px solid ${themeColor}33`)
						.style('font-size', '0.85rem')
						.style('line-height', '1.4')
						.style('min-width', '180px')
						.style('max-width', '280px')
						.style('left', `${Math.min(event.clientX + 20, window.innerWidth - tooltipWidth - 20)}px`)
						.style('top', `${Math.max(20, event.clientY - tooltipHeight - 20)}px`)
						.html(
							`
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <span style="width:10px;height:10px;border-radius:999px;background:${themeColor};display:inline-block;"></span>
                <strong style="font-size:0.95rem;">${d.data.name}</strong>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:6px;">
                <span>Value</span>
                <span style="font-weight:600;">${d3.format(',')(d.value || 0)}</span>
              </div>
              ${
								d.parent
									? `<div style="display:flex;justify-content:space-between;font-size:0.8rem;color:rgba(255,255,255,0.6);">
                    <span>Parent</span>
                    <span>${d.parent.data.name}</span>
                  </div>`
									: ''
							}
            `
						);
				})
				.on('mouseout', () => {
					tooltip.style('visibility', 'hidden');
				});
		}
	}, [
		data,
		height,
		labelSize,
		padding,
		showLegend,
		showLabels,
		showTitle,
		showTooltips,
		themeColor,
		tooltipBackgroundColor,
		tooltipTextColor,
		width,
	]);

	return (
		<div ref={containerRef} className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
			<svg ref={svgRef} />
			<div ref={tooltipRef} />
		</div>
	);
};

export default withLoading(D3TreeMap);

