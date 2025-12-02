'use client'

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useThemeColor } from '@/app/(shared)/providers/theme-context'
import { useTranslations } from 'next-intl'
import { Settings2, Type, Grid, Info, Axis3d, TextCursor } from 'lucide-react'
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
   TooltipProvider
} from "@/components/ui/tooltip"
import clsx from 'clsx'

interface BarChartElementsProps {
   showAxes?: boolean;
   onAxesChange: (value: boolean) => void;
   showGrid: boolean;
   onGridChange: (value: boolean) => void;
   showLabels?: boolean;
   onLabelsChange: (value: boolean) => void;
   showTitle: boolean;
   onTitleChange: (value: boolean) => void;
   showLegend: boolean;
   onLegendChange: (value: boolean) => void;
   showTooltips: boolean;
   onTooltipsChange: (value: boolean) => void;
   labelSize: number;
   onLabelSizeChange: (value: number) => void;
}

export function BarChartElements({
   showAxes = false,
   onAxesChange,
   showGrid = true,
   onGridChange,
   showLabels = true,
   onLabelsChange,
   showTitle = true,
   onTitleChange,
   showLegend = true,
   onLegendChange,
   showTooltips = true,
   onTooltipsChange,
   labelSize = 12,
   onLabelSizeChange,
}: BarChartElementsProps) {
   const { themeColor = '#22C55E' } = useThemeColor()
   const t = useTranslations('ChartControls.elements')

   const controls = [
      {
         id: 'axes',
         label: t('axes'),
         icon: <Axis3d className="w-4 h-4" />,
         value: showAxes,
         onChange: onAxesChange,
         tooltip: t('axesTooltip')
      },
      {
         id: 'grid',
         label: t('grid'),
         icon: <Grid className="w-4 h-4" />,
         value: showGrid,
         onChange: onGridChange,
         tooltip: t('gridTooltip')
      },
      {
         id: 'labels',
         label: t('labels'),
         icon: <TextCursor className="w-4 h-4" />,
         value: showLabels,
         onChange: onLabelsChange,
         tooltip: t('labelsTooltip')
      },
      {
         id: 'title',
         label: t('title'),
         icon: <Type className="w-4 h-4" />,
         value: showTitle,
         onChange: onTitleChange,
         tooltip: t('titleTooltip')
      },
      {
         id: 'legend',
         label: t('legend'),
         icon: <Settings2 className="w-4 h-4" />,
         value: showLegend,
         onChange: onLegendChange,
         tooltip: t('legendTooltip')
      },
      {
         id: 'tooltips',
         label: t('tooltips'),
         icon: <Info className="w-4 h-4" />,
         value: showTooltips,
         onChange: onTooltipsChange,
         tooltip: t('tooltipsTooltip')
      }
   ]

   return (
      <div
         className="relative bg-background/40 dark:bg-[#1B1B1B]/30 backdrop-blur-[12px] backdrop-saturate-[180%] 
        rounded-lg p-4 h-full space-y-6 transition-all duration-300"
         style={{
            boxShadow: `inset 0 0 0 1px ${themeColor}33`
         }}
      >
         <div className="flex items-center gap-2">
            <div
               className="w-3 h-3 rounded-full"
               style={{
                  backgroundColor: themeColor,
                  boxShadow: `0 0 0 1px ${themeColor}33`
               }}
            />
            <h3 className="text-sm font-medium text-foreground">{t('title')}</h3>
         </div>

         <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {controls.map(({ id, label, icon, value, onChange, tooltip }) => (
                  <Tooltip key={id}>
                     <TooltipTrigger asChild>
                        <div className="flex items-center justify-between group/control min-w-0">
                           <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div className={clsx(
                                 "flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center",
                                 "bg-background/60 dark:bg-background/5",
                                 "transition-colors duration-300",
                                 "group-hover/control:bg-background/80 dark:group-hover/control:bg-background/10"
                              )}>
                                 {icon}
                              </div>
                              <Label className="text-sm text-muted-foreground font-normal cursor-pointer truncate">
                                 {label}
                              </Label>
                           </div>
                           <Switch
                              checked={value}
                              onCheckedChange={onChange}
                              className="flex-shrink-0 ml-2 data-[state=checked]:bg-[var(--theme-color)]"
                              style={{ '--theme-color': themeColor } as React.CSSProperties}
                           />
                        </div>
                     </TooltipTrigger>
                     <TooltipContent side="right" align="center" className="max-w-[200px]">
                        <p className="text-xs">{tooltip}</p>
                     </TooltipContent>
                  </Tooltip>
               ))}
            </div>
         </TooltipProvider>

         <div className="space-y-2.5">
            <div className="flex items-center justify-between min-w-0 gap-4">
               <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('labelSize')}</label>
               <span className="text-xs text-muted-foreground font-mono flex-shrink-0">
                  {labelSize}px
               </span>
            </div>
            <Slider
               value={[labelSize]}
               onValueChange={([value]) => onLabelSizeChange(value)}
               min={8}
               max={24}
               step={1}
               className="[&>[role=slider]]:h-3.5 [&>[role=slider]]:w-3.5"
            />
         </div>
      </div>
   )
} 