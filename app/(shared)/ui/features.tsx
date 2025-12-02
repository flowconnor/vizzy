"use client"

import { useState } from "react"
import { Globe, TreesIcon as Tree, Wand2, PlugIcon as Plugin, Wrench, Triangle } from "lucide-react"
import Link from "next/link"
import { ColorSelector } from "@/app/(shared)/charts-ui"
import { VibeSelector } from "@/app/(shared)/charts-ui"
import {
  D3TreeMap as TreeMap,
  D3BarChart as BarChart,
  D3LineChart as LineChart,
  D3StreamChart as StreamChart,
  D3StackedBarChart as StackedBarChart,
  D3DonutChart as DonutChart,
  ChartStyle
} from "@vizzy/charts"
import { AiChartSuggest } from "@/app/(shared)/charts-ui"
import { ChartControls } from "@/app/(shared)/charts-ui"
import { Input, Slider, Switch, Label, Button } from "@/app/(shared)/ui";
import { Command } from 'lucide-react'
import * as d3 from 'd3'
import { useThemeColor } from "@/app/(shared)/providers/theme-context"
import React from 'react';
import { useParams } from 'next/navigation'
import { ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type Feature = {
   title: string;
   description: string;
   link: string;
   href: string;
} & (
   | { component: React.FC<any>; icon?: never }
   | { component?: never; icon: React.FC<any> }
)

function CustomColorPicker({ currentColor, onChange }: { currentColor: string, onChange: (color: string) => void }) {
   const hsl = d3.hsl(currentColor)
   const [hue, setHue] = useState(hsl.h)
   const [saturation, setSaturation] = useState(hsl.s * 100)
   const [lightness, setLightness] = useState(hsl.l * 100)
   const [hexValue, setHexValue] = useState(currentColor)
   const [rgbValue, setRgbValue] = useState(() => {
      const rgb = d3.rgb(currentColor)
      return `${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}`
   })

   const updateColor = (color: string) => {
      try {
         const validColor = d3.color(color)
         if (validColor) {
            const hsl = d3.hsl(validColor)
            setHue(hsl.h)
            setSaturation(hsl.s * 100)
            setLightness(hsl.l * 100)
            setHexValue(validColor.formatHex())
            const rgb = d3.rgb(validColor)
            setRgbValue(`${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}`)
            onChange(validColor.formatHex())
         }
      } catch (e) {
         // Invalid color format, ignore
      }
   }

   const updateFromHSL = (h: number, s: number, l: number) => {
      const newColor = d3.hsl(h, s / 100, l / 100).formatHex()
      setHexValue(newColor)
      const rgb = d3.rgb(newColor)
      setRgbValue(`${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}`)
      onChange(newColor)
   }

   const handleHexChange = (value: string) => {
      setHexValue(value)
      if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
         updateColor(value)
      }
   }

   const handleRgbChange = (value: string) => {
      setRgbValue(value)
      const rgbMatch = value.match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/)
      if (rgbMatch) {
         const [_, r, g, b] = rgbMatch
         if (Number(r) <= 255 && Number(g) <= 255 && Number(b) <= 255) {
            updateColor(`rgb(${r}, ${g}, ${b})`)
         }
      }
   }

   return (
      <div className="space-y-6 p-4 w-[300px]">
         <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">HEX</label>
                  <Input
                     value={hexValue}
                     onChange={(e) => handleHexChange(e.target.value)}
                     className="h-8 bg-[#2A2A2A] border-[#3A3A3A] text-sm font-mono"
                     placeholder="#000000"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400">RGB</label>
                  <Input
                     value={rgbValue}
                     onChange={(e) => handleRgbChange(e.target.value)}
                     className="h-8 bg-[#2A2A2A] border-[#3A3A3A] text-sm font-mono"
                     placeholder="0, 0, 0"
                  />
               </div>
            </div>
         </div>
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Hue</label>
            <div className="relative h-12 w-full">
               <div
                  className="absolute inset-0 rounded-md"
                  style={{
                     background: `linear-gradient(to right, ${d3.range(0, 360, 1).map(h => d3.hsl(h, 0.8, 0.5).formatHex()).join(',')})`
                  }}
               />
               <Slider
                  value={[hue]}
                  min={0}
                  max={359}
                  step={1}
                  onValueChange={([h]) => {
                     setHue(h)
                     updateFromHSL(h, saturation, lightness)
                  }}
                  className="absolute inset-0"
               />
            </div>
         </div>
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Saturation</label>
            <Slider
               value={[saturation]}
               min={0}
               max={100}
               step={1}
               onValueChange={([s]) => {
                  setSaturation(s)
                  updateFromHSL(hue, s, lightness)
               }}
               className="py-2"
            />
         </div>
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Lightness</label>
            <Slider
               value={[lightness]}
               min={0}
               max={100}
               step={1}
               onValueChange={([l]) => {
                  setLightness(l)
                  updateFromHSL(hue, saturation, l)
               }}
               className="py-2"
            />
         </div>
      </div>
   )
}

function ChartOptions({ className }: { className?: string }) {
   const [options, setOptions] = useState({
      legends: true,
      tooltips: true,
      gridlines: true,
      annotations: false,
      titles: true,
      subtitles: true,
   });

   return (
      <div className="bg-[#1F1F1F]/50 backdrop-blur-sm border border-[#2A2A2A] rounded-lg p-4 h-full">
         <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
               <div className="h-3 w-3 rounded-sm bg-gray-400" />
               <h3 className="text-sm font-medium text-gray-200">Chart Elements</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
               {Object.entries(options).map(([key, value]) => (
                  <div
                     key={key}
                     className={`flex items-center justify-between p-2 rounded-md transition-all duration-200
                ${value ? 'bg-[#2A2A2A]/50' : 'bg-transparent hover:bg-[#2A2A2A]/30'}`}
                  >
                     <Label
                        htmlFor={key}
                        className="text-xs font-medium capitalize text-gray-400"
                     >
                        {key}
                     </Label>
                     <Switch
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                           setOptions((prev) => ({ ...prev, [key]: checked }))
                        }
                        className="data-[state=checked]:bg-gray-400"
                     />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

const features: Feature[] = [
   {
      component: TreeMap,
      title: "TreeMap",
      description:
         "Hierarchical data visualization that uses nested rectangles to represent data structure and values.",
      link: "View TreeMap docs",
      href: "/docs/treemap-chart",
   },
   {
      component: BarChart,
      title: "Bar Chart",
      description:
         "Versatile bar charts with customizable animations, colors, and layouts. Perfect for comparing values across categories.",
      link: "View Bar Chart docs",
      href: "/docs/bar-chart",
   },
   {
      component: LineChart,
      title: "Line Chart",
      description:
         "Smooth, interactive line charts with customizable curves, points, and animations. Ideal for time series data.",
      link: "View Line Chart docs",
      href: "/docs/line-chart",
   },
   {
      component: DonutChart,
      title: "Donut Chart",
      description:
         "Beautiful donut charts with interactive segments, customizable colors, and smooth transitions.",
      link: "View Donut Chart docs",
      href: "/docs/donut-chart",
   },
   {
      component: StreamChart,
      title: "Stream Chart",
      description:
         "Elegant streamgraph visualization for displaying temporal data with smooth flowing curves and transitions. Perfect for showing evolving trends.",
      link: "View Stream Chart docs",
      href: "/docs/stream-chart",
   },
   {
      component: StackedBarChart,
      title: "Stacked Bar Chart",
      description:
         "Horizontal stacked bar charts with smooth animations and customizable colors. Ideal for comparing parts of a whole across categories.",
      link: "View Stacked Bar Chart docs",
      href: "/docs/stacked-bar-chart",
   },
   // {
   //   icon: Wrench,
   //   title: "Handles your special needs",
   //   description:
   //     "Rollup is not opinionated. Many configuration options and a rich plugin interface make it the ideal bundler for special build flows and higher level tooling.",
   //   link: "See all options",
   //   href: "#",
   // },
   // {
   //   icon: Triangle,
   //   title: "The bundler behind Vite",
   //   description:
   //     "Developing for the web? Vite pre-configures Rollup for you with sensible defaults and powerful plugins while giving you an insanely fast development server.",
   //   link: "Check out Vite",
   //   href: "#",
   // },
]

export function Features() {
   const { themeColor, setThemeColor } = useThemeColor()
   const params = useParams()
   const locale = params?.locale || 'en'
   const [currentVibe, setCurrentVibe] = useState<ChartStyle>('rainforest')
   const [showAxes, setShowAxes] = useState(true)
   const [showGrid, setShowGrid] = useState(true)
   const [showLabels, setShowLabels] = useState(true)
   const [labelSize, setLabelSize] = useState(12)
   const [showTitle, setShowTitle] = useState(true);
   const [showLegend, setShowLegend] = useState(true);
   const [showTooltips, setShowTooltips] = useState(true);

   const features: Feature[] = [
      {
         component: TreeMap,
         title: "TreeMap",
         description:
            "Hierarchical data visualization that uses nested rectangles to represent data structure and values.",
         link: "View TreeMap docs",
         href: `/${locale}/docs/treemap-chart`,
      },
      {
         component: BarChart,
         title: "Bar Chart",
         description:
            "Versatile bar charts with customizable animations, colors, and layouts. Perfect for comparing values across categories.",
         link: "View Bar Chart docs",
         href: `/${locale}/docs/bar-chart`,
      },
      {
         component: LineChart,
         title: "Line Chart",
         description:
            "Smooth, interactive line charts with customizable curves, points, and animations. Ideal for time series data.",
         link: "View Line Chart docs",
         href: `/${locale}/docs/line-chart`,
      },
      {
         component: DonutChart,
         title: "Donut Chart",
         description:
            "Beautiful donut charts with interactive segments, customizable colors, and smooth transitions.",
         link: "View Donut Chart docs",
         href: `/${locale}/docs/donut-chart`,
      },
      {
         component: StreamChart,
         title: "Stream Chart",
         description:
            "Elegant streamgraph visualization for displaying temporal data with smooth flowing curves and transitions. Perfect for showing evolving trends.",
         link: "View Stream Chart docs",
         href: `/${locale}/docs/stream-chart`,
      },
      {
         component: StackedBarChart,
         title: "Stacked Bar Chart",
         description:
            "Horizontal stacked bar charts with smooth animations and customizable colors. Ideal for comparing parts of a whole across categories.",
         link: "View Stacked Bar Chart docs",
         href: `/${locale}/docs/stacked-bar-chart`,
      },
   ]

   return (
      <section className="relative mt-[-1px] pt-32 pb-16 bg-white dark:bg-[#1B1B1B]">
         <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-white dark:from-[#1B1B1B] dark:via-[#1B1B1B] dark:to-[#1A1A1A] opacity-90" />
         </div>
         
         <div className="relative px-4 mb-16 max-w-7xl mx-auto">
            <ChartControls
               currentTheme={themeColor}
               currentVibe={currentVibe}
               onThemeChange={setThemeColor}
               onVibeChange={setCurrentVibe}
               showAxes={showAxes}
               onAxesChange={setShowAxes}
               showGrid={showGrid}
               onGridChange={setShowGrid}
               showLabels={showLabels}
               onLabelsChange={setShowLabels}
               labelSize={labelSize}
               onLabelSizeChange={setLabelSize}
               showTitle={showTitle}
               onTitleChange={setShowTitle}
               showLegend={showLegend}
               onLegendChange={setShowLegend}
               showTooltips={showTooltips}
               onTooltipsChange={setShowTooltips}
            />
         </div>
         <div className="relative grid grid-cols-1 gap-8 px-4 max-w-7xl mx-auto md:grid-cols-2 lg:grid-cols-3">
            <style jsx>{`
              @keyframes moveRight {
                from { background-position: 0 0; }
                to { background-position: 44px 0; }
              }
              @keyframes moveDown {
                from { background-position: 0 0; }
                to { background-position: 0 44px; }
              }
            `}</style>
            {/* Vertical Dashed Lines */}
            <div 
               className="absolute hidden lg:block w-[1px] pointer-events-none"
               style={{
                  left: '0',  
                  top: '0',
                  bottom: '0',
                  background: `repeating-linear-gradient(to bottom, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                  opacity: 0.4,
                  animation: 'moveDown 5s linear infinite'
               }}
            />
            <div 
               className="absolute hidden lg:block w-[1px] pointer-events-none"
               style={{
                  left: 'calc(33.333% + 2px)',  
                  top: '0',
                  bottom: '0',
                  background: `repeating-linear-gradient(to bottom, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                  opacity: 0.4,
                  animation: 'moveDown 5s linear infinite'
               }}
            />
            <div 
               className="absolute hidden lg:block w-[1px] pointer-events-none"
               style={{
                  right: 'calc(33.333% - 2px)',  
                  top: '0',
                  bottom: '0',
                  background: `repeating-linear-gradient(to bottom, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                  opacity: 0.4,
                  animation: 'moveDown 5s linear infinite'
               }}
            />
            <div 
               className="absolute hidden lg:block w-[1px] pointer-events-none"
               style={{
                  right: '0',  
                  top: '0',
                  bottom: '0',
                  background: `repeating-linear-gradient(to bottom, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                  opacity: 0.4,
                  animation: 'moveDown 5s linear infinite'
               }}
            />
            
            {/* Horizontal Dashed Lines */}
            <div 
               className="absolute hidden md:block pointer-events-none"
               style={{
                  left: '0',
                  right: '0',
                  top: '-5px',  
                  height: '1px',
                  background: `repeating-linear-gradient(to right, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                  opacity: 0.4,
                  animation: 'moveRight 5s linear infinite'
               }}
            />
            <div 
               className="absolute hidden md:block pointer-events-none"
               style={{
                  left: '0',
                  right: '0',
                  top: '50%',
                  height: '1px',
                  background: `repeating-linear-gradient(to right, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                  opacity: 0.4,
                  animation: 'moveRight 5s linear infinite'
               }}
            />
            <div 
               className="absolute hidden md:block pointer-events-none"
               style={{
                  left: '0',
                  right: '0',
                  bottom: '-2px',  
                  height: '1px',
                  background: `repeating-linear-gradient(to right, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                  opacity: 0.4,
                  animation: 'moveRight 5s linear infinite'
               }}
            />

            {features.map((feature) => (
               <div 
                  key={feature.title} 
                  className="group relative overflow-hidden rounded-xl bg-white/60 dark:bg-[#181818]/30 
                    hover:bg-white/80 dark:hover:bg-[#1A1A1A]/40
                    backdrop-blur-[12px] backdrop-saturate-[180%] 
                    transition-all duration-300
                    hover:-translate-y-[2px]
                    hover:shadow-lg
                    flex flex-col min-h-[420px]"
               >
                  {feature.component && (
                    <div className="relative w-full pt-[56.25%]">
                      <div className="absolute inset-0 p-6">
                        <div className="relative w-full h-full overflow-hidden">
                          <div className="absolute inset-0">
                            <feature.component 
                              themeColor={themeColor} 
                              vibe={currentVibe}
                              showAxes={false}
                              showGrid={false}
                              showLabels={false}
                              labelSize={12}
                              showLegend={false}
                              showTitle={false}
                              showTooltips={true}
                              padding={4}
                              className="w-full h-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="relative flex-1 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      {feature.icon && (
                        <div>
                          <feature.icon className="w-8 h-8 text-muted-foreground/80 group-hover:text-foreground transition-colors duration-300" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold tracking-tight text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-[15px] leading-relaxed text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 mt-auto">
                      <div className="relative group">
                        <motion.div
                          className="absolute inset-0 rounded-lg blur-lg opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                          style={{
                            background: themeColor,
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className={cn(
                            "relative text-sm font-medium border-2 shadow-sm transition-all duration-300",
                            "bg-transparent hover:bg-[var(--hover-bg)] active:bg-[var(--active-bg)]",
                            "text-[var(--theme-color)] hover:text-white active:text-white",
                            "active:scale-[0.98] active:shadow-inner",
                            "flex items-center gap-1.5"
                          )}
                          style={{
                            borderColor: `${themeColor}66`,
                            '--theme-color': themeColor,
                            '--hover-bg': themeColor,
                            '--active-bg': `${themeColor}dd`,
                          } as React.CSSProperties}
                        >
                          <Link href={feature.href} className="flex items-center gap-1.5">
                            {feature.link}
                            <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
               </div>
            ))}
         </div>
      </section>
   )
}
