'use client'

import { useState, useEffect, type CSSProperties } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { ColorSelector } from "./color-selector"
import { VibeSelector } from "./vibe-selector"
import { ChartElements } from "./chart-elements"
import { Button } from "@/app/(shared)/ui";
import clsx from "clsx"
import { useThemeColor } from '@/app/(shared)/providers/theme-context'
import { useTranslations } from 'next-intl'
import type { ChartOptions, ChartStyle } from '@vizzy/charts'

type ToggleableOptions = Required<
  Pick<
    ChartOptions,
    'showAxes' | 'showGrid' | 'showLabels' | 'showTitle' | 'showLegend' | 'showTooltips' | 'labelSize'
  >
>

interface ChartControlsProps extends ToggleableOptions {
  currentTheme: string
  onThemeChange: (color: string) => void
  currentVibe: ChartStyle
  onVibeChange: (vibe: ChartStyle) => void
  onAxesChange: (show: boolean) => void
  onGridChange: (show: boolean) => void
  onLabelsChange: (show: boolean) => void
  onTitleChange: (show: boolean) => void
  onLegendChange: (show: boolean) => void
  onTooltipsChange: (show: boolean) => void
  onLabelSizeChange: (size: number) => void
}

export function ChartControls({
  currentTheme,
  onThemeChange,
  currentVibe,
  onVibeChange,
  showAxes,
  onAxesChange,
  showGrid,
  onGridChange,
  showLabels,
  onLabelsChange,
  showTitle,
  onTitleChange,
  showLegend,
  onLegendChange,
  showTooltips,
  onTooltipsChange,
  labelSize,
  onLabelSizeChange
}: ChartControlsProps) {
  const t = useTranslations('chart')
  const [isExpanded, setIsExpanded] = useState(true)

  const { setThemeColor } = useThemeColor()

  // Initialize defaults on mount
  useEffect(() => {
    setThemeColor(currentTheme)  
  }, [currentTheme, setThemeColor])

  // Keep theme context in sync
  useEffect(() => {
    if (currentTheme) {
      setThemeColor(currentTheme)
    }
  }, [currentTheme, setThemeColor])

  return (
    <section className="relative w-full">
      <div className="w-full space-y-3">
        <div className="relative flex items-center justify-center w-full max-w-7xl mx-auto px-4 gap-2 sm:gap-4 my-4">
          <style jsx>{`
            @keyframes moveRight {
              from { background-position: 0 0; }
              to { background-position: 44px 0; }
            }
          `}</style>
          <div 
            className="hidden sm:block h-[1px] pointer-events-none flex-1"
            style={{
              background: `repeating-linear-gradient(to right, transparent, transparent 4px, ${currentTheme}CC 4px, ${currentTheme}CC 8px)`,
              opacity: 0.4,
              animation: 'moveRight 5s linear infinite'
            }}
          />
          <div className="relative group flex-shrink-0">
            <div
              className="absolute inset-0 rounded-lg blur-lg opacity-10 transition-opacity duration-300 group-hover:opacity-20"
              style={{
                background: currentTheme,
              }}
            />
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className={clsx(
                "relative text-base font-medium border-2 shadow-sm transition-all duration-300",
                "w-full sm:w-[200px] md:w-[240px]",
                "bg-transparent hover:bg-[var(--hover-bg)] active:bg-[var(--active-bg)]",
                "text-[var(--theme-color)] hover:text-white active:text-white",
                "active:scale-[0.98] active:shadow-inner"
              )}
              style={{
                borderColor: `${currentTheme}66`,
                '--theme-color': currentTheme,
                '--hover-bg': currentTheme,
                '--active-bg': `${currentTheme}dd`,
              } as CSSProperties}
            >
              <div className="relative flex items-center justify-between gap-2 py-2 px-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: currentTheme,
                      boxShadow: `0 0 0 1px ${currentTheme}33`
                    }}
                  />
                  <span>
                    {t('customize')}
                  </span>
                </div>
                <ChevronUp 
                  className={clsx(
                    "w-4 h-4 transition-all duration-300",
                    !isExpanded && "rotate-180"
                  )}
                />
              </div>
            </Button>
          </div>
          <div 
            className="hidden sm:block h-[1px] pointer-events-none flex-1"
            style={{
              background: `repeating-linear-gradient(to right, transparent, transparent 4px, ${currentTheme}CC 4px, ${currentTheme}CC 8px)`,
              opacity: 0.4,
              animation: 'moveRight 5s linear infinite'
            }}
          />
        </div>

        <div
          className={clsx(
            "grid transition-[grid-template-rows,opacity] duration-300",
            isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden">
            <div className={clsx(
              "bg-background/60 dark:bg-[#1B1B1B]/50 backdrop-blur-[12px] backdrop-saturate-[180%]",
              "border border-border/40",
              "rounded-lg",
              "shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.1)]",
              "hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.2),inset_0_2px_2px_rgba(255,255,255,0.15)]",
              "dark:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.05)]",
              "dark:hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5),inset_0_2px_2px_rgba(255,255,255,0.07)]",
              "p-6",
              "transition-all duration-700 ease-out",
              isExpanded ? "translate-y-0" : "translate-y-8"
            )}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 h-full">
                <div className="flex flex-col group/item transition-all duration-300 hover:translate-y-[-1px] hover:scale-[1.01]">
                  <ColorSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />
                </div>
                <div className="flex flex-col group/item transition-all duration-300 hover:translate-y-[-1px] hover:scale-[1.01]">
                  <VibeSelector selectedVibe={currentVibe} onVibeChange={onVibeChange} />
                </div>
                <div className="flex flex-col sm:col-span-2 lg:col-span-1 group/item transition-all duration-300 hover:translate-y-[-1px] hover:scale-[1.01]">
                  <ChartElements
                    showAxes={showAxes}
                    onAxesChange={onAxesChange}
                    showGrid={showGrid}
                    onGridChange={onGridChange}
                    showLabels={showLabels}
                    onLabelsChange={onLabelsChange}
                    showTitle={showTitle}
                    onTitleChange={onTitleChange}
                    showLegend={showLegend}
                    onLegendChange={onLegendChange}
                    showTooltips={showTooltips}
                    onTooltipsChange={onTooltipsChange}
                    labelSize={labelSize}
                    onLabelSizeChange={onLabelSizeChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
