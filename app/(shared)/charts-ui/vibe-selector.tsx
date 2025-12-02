'use client'

import { useEffect, useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"
import { useThemeColor } from '@/app/(shared)/providers/theme-context'
import { useTranslations } from 'next-intl'
import { ChartStyle } from '@canopy/charts'
import { 
  TreePine, 
  SunMedium, 
  Snowflake, 
  Waves, 
  Flame, 
  Wind 
} from 'lucide-react'

const vibes = [
  {
    id: 'rainforest',
    Icon: TreePine,
    baseColor: '#94A3B8',
    hoverAnimation: {
      rotate: [-5, 5, -5],
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    loadAnimation: {
      x: [-10, 0],
      scale: [0.9, 1],
      opacity: 0
    }
  },
  {
    id: 'savanna',
    Icon: SunMedium,
    baseColor: '#94A3B8',
    hoverAnimation: {
      scale: [1, 1.2, 1],
      rotate: [0, 180],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
    loadAnimation: {
      y: [-10, 0],
      scale: [0.9, 1],
      opacity: 0
    }
  },
  {
    id: 'tundra',
    Icon: Snowflake,
    baseColor: '#94A3B8',
    hoverAnimation: {
      rotate: [0, 360],
      transition: { duration: 8, repeat: Infinity, ease: "linear" }
    },
    loadAnimation: {
      x: [10, 0],
      scale: [0.9, 1],
      opacity: 0
    }
  },
  {
    id: 'coral',
    Icon: Waves,
    baseColor: '#94A3B8',
    hoverAnimation: {
      x: [-3, 3, -3],
      y: [-2, 2, -2],
      rotate: [-5, 5, -5],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    loadAnimation: {
      y: [10, 0],
      scale: [0.9, 1],
      opacity: 0
    }
  },
  {
    id: 'volcanic',
    Icon: Flame,
    baseColor: '#94A3B8',
    hoverAnimation: {
      y: [-4, 0, -4],
      scale: [1, 1.2, 1],
      rotate: [-5, 5, -5],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    },
    loadAnimation: {
      y: [10, 0],
      scale: [0.9, 1],
      opacity: 0
    }
  },
  {
    id: 'dunes',
    Icon: Wind,
    baseColor: '#94A3B8',
    hoverAnimation: {
      x: [-4, 4, -4],
      scale: [0.95, 1.05, 0.95],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    loadAnimation: {
      x: [-10, 0],
      scale: [0.9, 1],
      opacity: 0
    }
  }
]

interface VibeSelectorProps {
  selectedVibe?: ChartStyle
  onVibeChange: (vibe: ChartStyle) => void
}

export function VibeSelector({ 
  selectedVibe = 'evergreen', 
  onVibeChange 
}: VibeSelectorProps) {
  const t = useTranslations('ChartControls.vibes')
  const { themeColor } = useThemeColor()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

      <div className="grid grid-cols-3 gap-2">
        {vibes.map((vibe) => {
          const isSelected = selectedVibe === vibe.id
          return (
            <TooltipProvider key={vibe.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    initial={vibe.loadAnimation as any}
                    animate={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
                    transition={{ 
                      delay: vibes.indexOf(vibe) * 0.05, 
                      duration: 0.3, 
                      type: "spring",
                      stiffness: 400,
                      damping: 25
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95, y: 2 }}
                    onClick={() => onVibeChange(vibe.id as ChartStyle)}
                    className={clsx(
                      "relative flex flex-col items-center justify-center gap-1 w-full p-1.5 rounded-md",
                      "text-muted-foreground hover:text-foreground transition-all duration-300",
                      "group/vibe",
                      "bg-background/40 dark:bg-[#1B1B1B]/30 backdrop-blur-[12px] backdrop-saturate-[180%]",
                      isSelected ? [
                        "text-foreground",
                        "border-[var(--theme-color)]"
                      ] : [
                        "border-zinc-400/10 dark:border-zinc-600/10",
                        "hover:border-[var(--theme-color)]/40"
                      ]
                    )}
                    style={{ 
                      '--theme-color': themeColor,
                      borderWidth: '1px',
                      borderStyle: 'solid'
                    } as React.CSSProperties}
                  >
                    <motion.div 
                      className="relative p-2"
                      style={{ 
                        color: isSelected ? themeColor : vibe.baseColor,
                      }}
                      whileHover={vibe.hoverAnimation}
                      animate={mounted && isSelected ? vibe.hoverAnimation : {}}
                    >
                      {isSelected && (
                        <>
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ 
                              background: `radial-gradient(circle at center, ${themeColor} 0%, transparent 70%)`,
                              filter: 'blur(8px)',
                              transform: 'scale(2.5)'
                            }}
                            initial={{ scale: 2, opacity: 0 }}
                            animate={{ 
                              scale: [2, 2.5, 2.2, 2.3],
                              opacity: [0, 0.4, 0.3, 0.35],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                              ease: "easeInOut"
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ 
                              background: `radial-gradient(circle at center, ${themeColor}60 0%, transparent 60%)`,
                              filter: 'blur(4px)',
                              transform: 'scale(2)'
                            }}
                            initial={{ scale: 1.8, opacity: 0 }}
                            animate={{ 
                              scale: [1.8, 2, 1.8, 1.9],
                              opacity: [0.2, 0.3, 0.2, 0.25],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "reverse",
                              ease: "easeInOut",
                              delay: 0.1
                            }}
                          />
                        </>
                      )}
                      <vibe.Icon 
                        size={18}
                        className={clsx(
                          "transition-transform duration-300",
                          isSelected && "scale-110"
                        )}
                      />
                    </motion.div>
                    <motion.span 
                      className="text-xs capitalize"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: vibes.indexOf(vibe) * 0.1 + 0.2 }}
                    >
                      {t(`Types.${vibe.id}`)}
                    </motion.span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom"
                  align="center"
                  sideOffset={5}
                  className="bg-background/95 dark:bg-[#1B1B1B]/95 backdrop-blur-[12px] backdrop-saturate-[180%] 
                    border border-border/40 shadow-lg rounded-lg px-3 py-2"
                >
                  <p className="text-xs capitalize">{t(`Types.${vibe.id}`)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}
