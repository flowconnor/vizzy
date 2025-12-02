'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import { Card } from "@/app/(shared)/ui";
import { TreePine, SunMedium, Snowflake, Waves, Flame, Wind, Play, Pause } from "lucide-react";
import { useThemeColor } from '@/app/(shared)/providers/theme-context';
import { D3BarChart } from '@vizzy/charts';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Map our vibes to chart styles
const vibeToChartStyle = {
  'rainforest': 'rainforest',
  'savanna': 'sunset',
  'tundra': 'ocean',
  'coral': 'midnight',
  'volcanic': 'evergreen',
  'dunes': 'rainforest'
} as const;

const sampleData = [
  { label: 'Growth', value: 65 },
  { label: 'Balance', value: 45 },
  { label: 'Harmony', value: 85 },
  { label: 'Flow', value: 55 },
  { label: 'Energy', value: 75 }
];

const vibes = [
  {
    id: 'rainforest',
    name: 'Rainforest',
    Icon: TreePine,
    description: 'Gentle swaying movements inspired by tropical forests',
    hoverAnimation: {
      rotate: [-5, 5, -5],
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
  },
  {
    id: 'savanna',
    name: 'Savanna',
    Icon: SunMedium,
    description: 'Radiant pulses reminiscent of African plains',
    hoverAnimation: {
      scale: [1, 1.2, 1],
      rotate: [0, 180],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    },
  },
  {
    id: 'tundra',
    name: 'Tundra',
    Icon: Snowflake,
    description: 'Crystalline rotations like arctic snowflakes',
    hoverAnimation: {
      rotate: [0, 180],
      scale: [1, 1.1, 0.9, 1],
      transition: { duration: 2, repeat: Infinity, ease: "linear" }
    },
  },
  {
    id: 'coral',
    name: 'Coral Reef',
    Icon: Waves,
    description: 'Fluid motions inspired by ocean currents',
    hoverAnimation: {
      x: [-3, 3, -3],
      y: [-2, 2, -2],
      rotate: [-5, 5, -5],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
  },
  {
    id: 'volcanic',
    name: 'Volcanic',
    Icon: Flame,
    description: 'Energetic bursts like volcanic activity',
    hoverAnimation: {
      y: [-4, 0, -4],
      scale: [1, 1.2, 1],
      rotate: [-5, 5, -5],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    },
  },
  {
    id: 'dunes',
    name: 'Desert Dunes',
    Icon: Wind,
    description: 'Smooth drifts like desert sand',
    hoverAnimation: {
      x: [-4, 4, -4],
      scale: [0.95, 1.05, 0.95],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
  }
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const CodeSnippetDemo = ({ code }: { code: string }) => {
  return (
    <div className="w-full h-full">
      <div className="rounded-lg border border-zinc-800 overflow-hidden h-full">
        <SyntaxHighlighter
          language="typescript"
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: 'rgb(17, 17, 17)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            fontFamily: '"JetBrains Mono", monospace',
            height: '100%',
          }}
          showLineNumbers={true}
          wrapLines={true}
          lineNumberStyle={{
            minWidth: '2.5em',
            paddingRight: '1.5em',
            marginRight: '1em',
            borderRight: '1px solid rgba(148, 163, 184, 0.1)',
            color: 'rgba(148, 163, 184, 0.4)',
            textAlign: 'right',
            userSelect: 'none',
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default function AnimationsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeVibe, setActiveVibe] = useState(vibes[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const { themeColor } = useThemeColor();
  useTranslations('Docs.features');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto py-6 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[bottom_1px_center]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "relative z-10 space-y-6",
          mounted ? "animate-in fade-in-50 duration-1000" : "opacity-0"
        )}
      >
        {/* Title section */}
        <div className="relative inline-block">
          <motion.h1 
            className="relative text-2xl font-semibold tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${themeColor}, ${themeColor}dd, ${themeColor}bb, ${themeColor}dd, ${themeColor})`,
              backgroundSize: "200% auto",
            }}
            animate={{
              backgroundPosition: ["0% center", "200% center"]
            }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity
            }}
          >
            Animations
          </motion.h1>
          <div 
            className="absolute -inset-x-2 -inset-y-2 blur-lg opacity-40 -z-10"
            style={{
              background: `linear-gradient(to right, ${themeColor}20, ${themeColor}10, ${themeColor}20)`
            }}
          />
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl">
          Bring your charts to life with our ecosystem-inspired animation system. Each vibe offers unique motion characteristics that add personality to your visualizations.
        </p>

        <div className="space-y-6">
          {/* Vibe selection grid */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-zinc-200/40 dark:border-zinc-800/50 bg-zinc-50/40 dark:bg-zinc-900/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-900/50 to-transparent" />
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <activeVibe.Icon className="h-5 w-5" style={{ color: themeColor }} />
                    <h2 className="text-lg font-semibold">Choose your vibe</h2>
                  </div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      "text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400",
                      "hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                    )}
                    aria-label={isPlaying ? "Pause animations" : "Play animations"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vibes.map((vibe) => {
                    const isActive = activeVibe.id === vibe.id;
                    return (
                      <button
                        key={vibe.id}
                        onClick={() => setActiveVibe(vibe)}
                        className={cn(
                          "group relative rounded-md p-4 text-left transition-all duration-300",
                          "bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-800",
                          "border border-zinc-200/50 dark:border-zinc-700/50",
                          isActive && "ring-1 ring-offset-2 dark:ring-offset-zinc-900"
                        )}
                        style={{ 
                          ...(isActive && {
                            borderColor: themeColor,
                            ringColor: themeColor,
                          })
                        }}
                      >
                        <div 
                          className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `radial-gradient(circle at center, ${themeColor}15 0%, transparent 70%)`
                          }}
                        />
                        <div className="relative space-y-3">
                          <motion.div
                            animate={isPlaying ? vibe.hoverAnimation : {}}
                            className={cn(
                              "mx-auto w-8 h-8",
                              isActive ? "text-zinc-900 dark:text-white" : "text-zinc-500 dark:text-zinc-400"
                            )}
                            style={isActive ? { color: themeColor } : undefined}
                          >
                            <vibe.Icon className="w-full h-full" />
                          </motion.div>
                          <div>
                            <div className="text-sm font-medium text-center mb-1">{vibe.name}</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center line-clamp-2">{vibe.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Demo section */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart Demo */}
            <div className="group relative">
              <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-zinc-500/10 via-zinc-300/10 to-zinc-500/10 
                 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500" />
              <div className="relative bg-zinc-50/40 dark:bg-[#1B1B1B]/30 backdrop-blur-[12px] backdrop-saturate-[180%] 
                 border border-zinc-200/40 dark:border-zinc-800/40 
                 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.1)] 
                 rounded-lg p-4 transition-all duration-300 group-hover:shadow-lg h-[300px] lg:h-[400px]">
                <D3BarChart
                  data={sampleData}
                  themeColor={themeColor}
                  vibe={vibeToChartStyle[activeVibe.id as keyof typeof vibeToChartStyle]}
                />
              </div>
            </div>

            {/* Code Example */}
            <div className="group relative">
              <div className="absolute -inset-[1px] rounded-lg bg-gradient-to-r from-zinc-500/10 via-zinc-300/10 to-zinc-500/10 
                 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-500" />
              <div className="relative bg-zinc-50/40 dark:bg-[#1B1B1B]/30 backdrop-blur-[12px] backdrop-saturate-[180%] 
                 border border-zinc-200/40 dark:border-zinc-800/40 
                 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.1)] 
                 rounded-lg transition-all duration-300 group-hover:shadow-lg h-[300px] lg:h-[400px] overflow-auto">
                <CodeSnippetDemo code={`
<BarChart
   data={data}
   vibe="${activeVibe.id}"  // Animation style
   animate={${isPlaying}}   // Enable animations
   themeColor="${themeColor}"
/>
`} />
              </div>
            </div>
          </motion.div>

          {/* Coming Soon Features */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-zinc-200/40 dark:border-zinc-800/50 bg-zinc-50/40 dark:bg-zinc-900/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-900/50 to-transparent" />
              <div className="relative p-6">
                <h2 className="text-lg font-semibold mb-6">Coming Soon</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: "Custom Transitions",
                      description: "Define your own animation sequences with custom timing and easing functions."
                    },
                    {
                      title: "State Animations",
                      description: "Animate between different data states with smooth interpolation."
                    },
                    {
                      title: "Interaction Effects",
                      description: "Add hover and click animations to chart elements."
                    },
                    {
                      title: "Scroll Animations",
                      description: "Trigger animations as charts enter the viewport."
                    }
                  ].map((feature) => (
                    <div 
                      key={feature.title}
                      className="group relative rounded-md p-4 bg-zinc-800/50 border border-zinc-700/50 transition-colors hover:bg-zinc-800"
                    >
                      <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${themeColor}15 0%, transparent 70%)`
                        }}
                      />
                      <div className="relative">
                        <h3 className="text-sm font-medium mb-2" style={{ color: themeColor }}>{feature.title}</h3>
                        <p className="text-sm text-zinc-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
