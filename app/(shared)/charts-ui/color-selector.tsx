'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import * as d3 from 'd3'
import { useThemeColor } from '@/app/(shared)/providers/theme-context'
import { useTranslations } from 'next-intl'

const themes = [
  { name: 'forest', color: '#22C55E', gradient: ['#22C55E', '#16A34A', '#15803D'], description: 'Fresh and natural green' },
  { name: 'ocean', color: '#0EA5E9', gradient: ['#0EA5E9', '#0284C7', '#0369A1'], description: 'Deep and calming blue' },
  { name: 'sunset', color: '#F97316', gradient: ['#F97316', '#EA580C', '#C2410C'], description: 'Warm and energetic orange' },
  { name: 'berry', color: '#EC4899', gradient: ['#EC4899', '#DB2777', '#BE185D'], description: 'Vibrant and playful pink' },
  { name: 'lavender', color: '#A855F7', gradient: ['#A855F7', '#9333EA', '#7E22CE'], description: 'Elegant and soothing purple' },
  { name: 'ruby', color: '#EF4444', gradient: ['#EF4444', '#DC2626', '#B91C1C'], description: 'Bold and passionate red' },
  { name: 'gold', color: '#EAB308', gradient: ['#EAB308', '#CA8A04', '#A16207'], description: 'Rich and luxurious yellow' },
  { name: 'slate', color: '#64748B', gradient: ['#64748B', '#475569', '#334155'], description: 'Professional and neutral gray' }
]

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

function ColorSpectrum({ value, onChange }: { value: number, onChange: (value: number) => void }) {
  const colors = d3.range(0, 360, 1).map(h => d3.hsl(h, 0.8, 0.5).formatHex())
  
  return (
    <div className="relative h-12 w-full">
      <div 
        className="absolute inset-0 rounded-md"
        style={{
          background: `linear-gradient(to right, ${colors.join(',')})`
        }}
      />
      <Slider
        value={[value]}
        min={0}
        max={359}
        step={1}
        onValueChange={([v]) => onChange(v)}
        className="absolute inset-0 [&>[role=slider]]:h-full [&>[role=slider]]:w-2 [&>[role=slider]]:rounded-sm [&>[role=slider]]:border-2 [&>[role=slider]]:border-white/50 [&>[role=slider]]:bg-transparent [&>[role=slider]]:hover:border-white"
      />
    </div>
  )
}

function CustomColorPicker({ currentColor, onChange }: { currentColor: string, onChange: (color: string) => void }) {
  const t = useTranslations('chart.colorSelector.custom')
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
    <div className="space-y-4 p-4 w-[240px]">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('hex')}</label>
            <Input
              value={hexValue}
              onChange={(e) => handleHexChange(e.target.value)}
              className="h-7 bg-background/40 dark:bg-[#1B1B1B]/40 border-border/40 text-sm font-mono"
              placeholder="#000000"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('rgb')}</label>
            <Input
              value={rgbValue}
              onChange={(e) => handleRgbChange(e.target.value)}
              className="h-7 bg-background/40 dark:bg-[#1B1B1B]/40 border-border/40 text-sm font-mono"
              placeholder="0, 0, 0"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('hue')}</label>
            <span className="text-xs text-muted-foreground font-mono select-none">{Math.round(hue)}°</span>
          </div>
          <ColorSpectrum 
            value={hue} 
            onChange={(h) => {
              setHue(h)
              updateFromHSL(h, saturation, lightness)
            }} 
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('saturation')}</label>
            <span className="text-xs text-muted-foreground font-mono select-none">{Math.round(saturation)}%</span>
          </div>
          <div className="relative group">
            <Slider
              value={[saturation]}
              min={0}
              max={100}
              step={1}
              onValueChange={([s]) => {
                setSaturation(s)
                updateFromHSL(hue, s, lightness)
              }}
              className="py-1.5 [&>[role=slider]]:h-3 [&>[role=slider]]:w-[2px] 
                [&>[role=slider]]:border-0
                [&>[role=slider]]:bg-[var(--theme-color)]
                [&>[role=slider]]:opacity-70
                [&>[role=slider]]:hover:opacity-100
                [&>[role=slider]]:transition-opacity
                [&>[role=slider]]:duration-150
                [&_[role=track]]:h-[1px]
                [&_[role=track]]:bg-[var(--theme-color)]/20
                [&_[role=track]]:rounded-none
                [&_[role=range]]:bg-[var(--theme-color)]/40"
              style={{ '--theme-color': currentColor } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('lightness')}</label>
            <span className="text-xs text-muted-foreground font-mono select-none">{Math.round(lightness)}%</span>
          </div>
          <div className="relative group">
            <Slider
              value={[lightness]}
              min={0}
              max={100}
              step={1}
              onValueChange={([l]) => {
                setLightness(l)
                updateFromHSL(hue, saturation, l)
              }}
              className="py-1.5 [&>[role=slider]]:h-3 [&>[role=slider]]:w-[2px] 
                [&>[role=slider]]:border-0
                [&>[role=slider]]:bg-[var(--theme-color)]
                [&>[role=slider]]:opacity-70
                [&>[role=slider]]:hover:opacity-100
                [&>[role=slider]]:transition-opacity
                [&>[role=slider]]:duration-150
                [&_[role=track]]:h-[1px]
                [&_[role=track]]:bg-[var(--theme-color)]/20
                [&_[role=track]]:rounded-none
                [&_[role=range]]:bg-[var(--theme-color)]/40"
              style={{ '--theme-color': currentColor } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      <div 
        className="h-6 rounded-sm transition-all duration-300"
        style={{ 
          background: `linear-gradient(to right, ${d3.hsl(hue, saturation/100, 0.2).formatHex()}, ${d3.hsl(hue, saturation/100, 0.5).formatHex()}, ${d3.hsl(hue, saturation/100, 0.8).formatHex()})`
        }}
        aria-label={t('preview')}
      />
    </div>
  )
}

interface ColorSelectorProps {
  currentTheme?: string;
  onThemeChange: (color: string) => void;
}

export function ColorSelector({ 
  currentTheme = '#22C55E', 
  onThemeChange 
}: ColorSelectorProps) {
  const t = useTranslations('ChartControls.colors')
  const { themeColor } = useThemeColor()
  const [isCustomOpen, setIsCustomOpen] = useState(false)
  
  return (
    <div 
      className="relative bg-background/40 dark:bg-[#1B1B1B]/30 backdrop-blur-[12px] backdrop-saturate-[180%] 
        rounded-lg p-4 h-full space-y-3 transition-all duration-300"
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
        <h3 className="text-sm font-medium">{t('title')}</h3>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {themes.map((theme) => (
          <TooltipProvider key={theme.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={clsx(
                    "relative w-full h-10 rounded-md overflow-hidden group/color",
                    "transition-all duration-300",
                    currentTheme === theme.color ? [
                      "scale-110 z-10",
                      "shadow-[0_0_20px_-5px_var(--theme-color)]",
                      theme.color === '#22C55E' && "animate-in fade-in duration-500"
                    ] : [
                      "hover:scale-105 hover:z-10",
                      "opacity-80 hover:opacity-100"
                    ]
                  )}
                  style={{ 
                    background: `linear-gradient(to right, ${theme.gradient.join(', ')})`,
                    '--theme-color': theme.color
                  } as React.CSSProperties}
                  onClick={() => onThemeChange(theme.color)}
                >
                  <div 
                    className={clsx(
                      "absolute inset-0 transition-opacity duration-300",
                      currentTheme === theme.color 
                        ? "opacity-0" 
                        : "opacity-100 group-hover/color:opacity-0",
                      "bg-background/40 dark:bg-[#1B1B1B]/40 backdrop-blur-[2px]"
                    )}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{t(`themes.${theme.name}.name`)}</p>
                <p className="text-sm text-muted-foreground">{t(`themes.${theme.name}.description`)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="relative mt-2 group">
        <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="relative w-full bg-background/40 dark:bg-[#1B1B1B]/30 border-0 
                hover:bg-background/60 dark:hover:bg-[#1B1B1B]/50 
                transition-all duration-300 overflow-hidden
                group/button"
              style={{
                boxShadow: `inset 0 0 0 1px ${themeColor}33`,
                '--theme-color': themeColor
              } as React.CSSProperties}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(120deg, transparent, ${themeColor}0a, transparent)`,
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 2s infinite'
                }}
              />
              <style jsx>{`
                @keyframes shimmer {
                  100% {
                    transform: translateX(100%);
                  }
                }
              `}</style>
              <div className="relative flex items-center gap-2 w-full">
                <div 
                  className="absolute inset-y-0 left-0 w-[2px] bg-[var(--theme-color)]/40 
                    transition-all duration-300
                    group-hover/button:bg-[var(--theme-color)] group-hover/button:w-[3px]"
                />
                <div 
                  className="w-2 h-2 rounded-full ml-2 transition-transform duration-300
                    group-hover/button:scale-110"
                  style={{ 
                    backgroundColor: themeColor,
                    boxShadow: `0 0 0 1px ${themeColor}33`
                  }}
                />
                <span className="flex-1 text-xs font-medium uppercase tracking-wider transition-colors duration-300
                  text-foreground/70 group-hover/button:text-foreground">{t('customization')}</span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 bg-background/95 dark:bg-[#1B1B1B]/95 backdrop-blur-[12px] backdrop-saturate-[180%] border-border/40"
            side="top"
            align="end"
            alignOffset={-8}
            sideOffset={8}
            avoidCollisions={true}
          >
            <CustomColorPicker
              currentColor={currentTheme}
              onChange={onThemeChange}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
