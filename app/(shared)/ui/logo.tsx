"use client"

import { motion } from "framer-motion"
import { useThemeColor } from "@/app/(shared)/providers/theme-context"
import * as d3 from 'd3'

const pathVariants = {
   initial: {
      pathLength: 0,
      rotate: 0,
      opacity: 0,
   },
   animate: {
      pathLength: [0, 1, 1],
      rotate: [0, 0, -180],
      opacity: 1,
      transition: {
         pathLength: {
            duration: 1.5,
            ease: "easeInOut",
         },
         rotate: {
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.5,
         },
         opacity: {
            duration: 0.01,
         },
      },
   },
}

const glowVariants = {
   initial: {
      opacity: 0,
      rotate: 0,
   },
   animate: {
      opacity: [0, 0.5, 0.5],
      rotate: [0, 0, -180],
      transition: {
         opacity: {
            duration: 1.5,
            ease: "easeInOut",
         },
         rotate: {
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.5,
         },
      },
   },
}

const gridVariants = {
   initial: {
      opacity: 0,
      scale: 1.2,
   },
   animate: {
      opacity: [0, 1],
      scale: [1.2, 1],
      transition: {
         duration: 0.8,
         ease: [0.4, 0, 0.2, 1],
         delay: 1.5,
      },
   },
}

export function Logo({ 
   className, 
   showGrid = true,
   style
}: { 
   className?: string, 
   showGrid?: boolean,
   style?: React.CSSProperties 
}) {
   const { themeColor } = useThemeColor()
   const color = d3.color(themeColor)
   const lighterColor = color ? d3.hsl(color).brighter(0.5).formatHex() : '#000000'
   const darkerColor = color ? d3.hsl(color).darker(0.2).formatHex() : '#000000'

   return (
      <div className={`relative flex items-center justify-center ${className}`} style={style}>
         <motion.svg
            viewBox="0 0 500 500"
            initial="initial"
            animate="animate"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
         >
            {/* Radial fade mask */}
            <defs>
               <radialGradient id="fade-mask" cx="50%" cy="50%" r="50%">
                  <stop offset="80%" stopColor="white" stopOpacity="1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
               </radialGradient>
               <mask id="fade">
                  <circle cx="250" cy="250" r="250" fill="url(#fade-mask)" />
               </mask>
               <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feFlood floodColor={themeColor} floodOpacity="0.3" result="color"/>
                  <feComposite in="color" in2="blur" operator="in" result="coloredBlur"/>
                  <feComposite in="SourceGraphic" in2="coloredBlur" operator="over"/>
               </filter>
               <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor={themeColor} />
               </filter>
               <linearGradient id="themeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={themeColor} />
                  <stop offset="50%" stopColor={lighterColor} />
                  <stop offset="100%" stopColor={themeColor} />
               </linearGradient>
            </defs>

            {/* Grid Background */}
            {showGrid && (
               <g mask="url(#fade)" style={{ opacity: 0.45 }}>
                  <motion.g 
                     variants={gridVariants}
                     className="origin-center"
                  >
                     {/* Horizontal lines */}
                     {Array.from({ length: 20 }).map((_, i) => (
                        <motion.line
                           key={`h-${i}`}
                           x1="0"
                           y1={25 * i}
                           x2="500"
                           y2={25 * i}
                           stroke="currentColor"
                           className="text-muted-foreground/60"
                           strokeWidth="1"
                        />
                     ))}
                     {/* Vertical lines */}
                     {Array.from({ length: 20 }).map((_, i) => (
                        <motion.line
                           key={`v-${i}`}
                           x1={25 * i}
                           y1="0"
                           x2={25 * i}
                           y2="500"
                           stroke="currentColor"
                           className="text-muted-foreground/60"
                           strokeWidth="1"
                        />
                     ))}
                  </motion.g>
               </g>
            )}

            {/* Logo Group - centered */}
            <g transform="translate(250, 250)">
               {/* Glow effect */}
               <motion.path
                  d="M -150 0 A 100 100 0 1 1 100 0 A 50 50 0 1 1 -100 0"
                  variants={glowVariants}
                  stroke={themeColor}
                  strokeWidth="35"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#glow)"
                  opacity="0.5"
                  style={{ transformOrigin: "center" }}
               />

               {/* Main path */}
               <motion.path
                  d="M -150 0 A 100 100 0 1 1 100 0 A 50 50 0 1 1 -100 0"
                  variants={pathVariants}
                  stroke="url(#themeGradient)"
                  strokeWidth="32"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#shadow)"
                  style={{ transformOrigin: "center" }}
               />
            </g>
         </motion.svg>
      </div>
   )
}