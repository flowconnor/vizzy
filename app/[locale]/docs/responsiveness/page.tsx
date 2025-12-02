'use client';

import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import { Card } from "@/app/(shared)/ui";
import { Copy, Check, Maximize2 } from "lucide-react";
import { D3BarChart } from "@vizzy/charts";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from "next-themes";

// More realistic data for the demo
const sampleData = [
  { label: "Revenue", value: 85 },
  { label: "Users", value: 65 },
  { label: "Growth", value: 45 },
  { label: "Retention", value: 75 },
  { label: "Engagement", value: 55 }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0
  }
};

const CodeSnippetDemo = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full relative">
      <div className="rounded-lg border border-zinc-200/20 dark:border-zinc-800 overflow-hidden h-full">
        <div className="absolute right-2 top-2 z-10">
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
            )}
          </button>
        </div>
        <SyntaxHighlighter
          language="typescript"
          style={theme === 'dark' ? vscDarkPlus : {
            'code[class*="language-"]': {
              color: '#24292e',
              background: '#ffffff',
            },
            'pre[class*="language-"]': {
              color: '#24292e',
              background: '#ffffff',
            },
            'comment': {
              color: '#6a737d'
            },
            'string': {
              color: '#032f62'
            },
            'function': {
              color: '#6f42c1'
            },
            'keyword': {
              color: '#d73a49'
            }
          }}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            fontFamily: '"JetBrains Mono", monospace',
            height: '100%',
            background: theme === 'dark' ? 'rgb(17, 17, 17)' : '#ffffff',
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

export default function ResponsivenessPage() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Docs.features');
  const { theme } = useTheme();
  const controls = useAnimation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeColor = "#22C55E"; // Using a consistent green for the theme

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
            className="relative text-2xl font-semibold tracking-tight bg-clip-text text-transparent mb-3"
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
            Responsiveness
          </motion.h1>
          <div 
            className="absolute -inset-x-2 -inset-y-2 blur-lg opacity-40 -z-10"
            style={{
              background: `linear-gradient(to right, ${themeColor}20, ${themeColor}10, ${themeColor}20)`
            }}
          />
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mb-6">
          Vizzy are designed to be naturally responsive, automatically adapting to fill their container while maintaining perfect proportions. No media queries needed – just provide the space, and watch your charts shine.
        </p>

        <div className="space-y-6">
          {/* Responsive Demo */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)] dark:shadow-[0_0_20px_rgba(34,197,94,0.15)] bg-zinc-50/40 dark:bg-zinc-900/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-900/50 to-transparent" />
              <div className="relative p-6 space-y-6">
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <Maximize2 className="h-6 w-6 text-green-500" />
                  </motion.div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                    Fluid Layout Showcase
                  </h2>
                </motion.div>
                
                {/* Grid of different sized containers */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Tall container - spans 8 columns */}
                  <motion.div 
                    className="col-span-12 md:col-span-8 h-[400px] bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <D3BarChart data={sampleData} />
                  </motion.div>
                  
                  {/* Side containers - stack in 4 columns */}
                  <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-6">
                    {/* Upper side container */}
                    <motion.div 
                      className="h-[190px] bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <D3BarChart data={sampleData} themeColor="#6366f1" vibe="sunset" />
                    </motion.div>
                    
                    {/* Lower side container */}
                    <motion.div 
                      className="h-[190px] bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <D3BarChart data={sampleData} themeColor="#ec4899" vibe="ocean" />
                    </motion.div>
                  </div>
                  
                  {/* Bottom containers - 3 equal columns */}
                  {[1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      className="col-span-4 h-[200px] bg-zinc-100/50 dark:bg-zinc-800/50 rounded-lg p-4 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <D3BarChart data={sampleData} themeColor="#f59e0b" vibe="midnight" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Code example */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)] dark:shadow-[0_0_20px_rgba(34,197,94,0.15)] bg-zinc-50/40 dark:bg-zinc-900/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-900/50 to-transparent" />
              <div className="relative p-6 space-y-4">
                <motion.div 
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <div className="p-2 rounded-md bg-gradient-to-r from-green-500/10 to-green-600/10">
                      <Maximize2 className="h-5 w-5 text-green-500" />
                    </div>
                  </motion.div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                    Implementation Example
                  </h2>
                </motion.div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-600/5 rounded-lg" />
                  <div className="relative">
                    <CodeSnippetDemo
                      code={`// Create a responsive grid layout with dynamic sizing
import { D3BarChart } from '@codeium/vizzy';

function ResponsiveChartGrid() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Main chart - spans 8 columns */}
      <div className="col-span-12 md:col-span-8 h-[400px]">
        <D3BarChart 
          data={data}
          // The chart automatically adapts to its container
        />
      </div>
      
      {/* Side charts - stack in 4 columns */}
      <div className="col-span-12 md:col-span-4 grid grid-rows-2 gap-6">
        <div className="h-[190px]">
          <D3BarChart data={data} />
        </div>
        <div className="h-[190px]">
          <D3BarChart data={data} />
        </div>
      </div>
      
      {/* Bottom row - three equal columns */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="col-span-4 h-[200px]">
          <D3BarChart data={data} />
        </div>
      ))}
    </div>
  );
}`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
