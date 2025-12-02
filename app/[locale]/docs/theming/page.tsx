'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import { Copy, Check, Palette } from "lucide-react";
import { Card } from "@/app/(shared)/ui";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const themes = [
  { name: 'Forest', color: '#22C55E', description: 'Fresh and natural green' },
  { name: 'Ocean', color: '#0EA5E9', description: 'Deep and calming blue' },
  { name: 'Sunset', color: '#F97316', description: 'Warm and energetic orange' },
  { name: 'Berry', color: '#D946EF', description: 'Vibrant and playful pink' }
];

const CodeSnippetDemo = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-full relative">
      <div className="rounded-lg border border-zinc-800 overflow-hidden h-full">
        <div className="absolute right-2 top-2 z-10">
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-zinc-800/50 transition-colors"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-zinc-400 hover:text-zinc-100" />
            )}
          </button>
        </div>
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

export default function ThemingPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const t = useTranslations('Docs.features');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto py-6 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[bottom_1px_center]" />
      </div>

      <div className={cn(
        "relative z-10",
        mounted ? "animate-in fade-in-50 duration-1000" : "opacity-0"
      )}>
        <div className="relative inline-block mb-6">
          <motion.h1 
            className="relative text-2xl font-semibold tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${activeTheme.color}, ${activeTheme.color}dd, ${activeTheme.color}bb, ${activeTheme.color}dd, ${activeTheme.color})`,
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
            Theming
          </motion.h1>
          <div 
            className="absolute -inset-x-2 -inset-y-2 blur-lg opacity-40 -z-10"
            style={{
              background: `linear-gradient(to right, ${activeTheme.color}20, ${activeTheme.color}10, ${activeTheme.color}20)`
            }}
          />
        </div>

        <p className="text-sm text-muted-foreground/90 mb-6">
          Customize the look and feel of your charts with our powerful theming system. Start with a simple color theme and expand to full customization as needed.
        </p>

        <div className="space-y-6">
          {/* Theme Color Selection */}
          <motion.div>
            <Card className="relative overflow-hidden border-zinc-200/40 dark:border-zinc-800/50 bg-zinc-50/40 dark:bg-zinc-900/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-900/50 to-transparent" />
              <div className="relative p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Palette className="h-5 w-5" style={{ color: activeTheme.color }} />
                  <h2 className="text-lg font-semibold">Theme Color</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {themes.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => setActiveTheme(theme)}
                      className={cn(
                        "group relative rounded-md p-4 text-left transition-all duration-300",
                        "bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-zinc-200/50 dark:hover:bg-zinc-800",
                        "border border-zinc-200/50 dark:border-zinc-700/50",
                        activeTheme.name === theme.name && `ring-1 ring-offset-2 dark:ring-offset-zinc-900 ring-[${theme.color}] border-[${theme.color}]`
                      )}
                      style={{ 
                        ...(activeTheme.name === theme.name && {
                          borderColor: theme.color,
                          ringColor: theme.color,
                        })
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `radial-gradient(circle at center, ${theme.color}15 0%, transparent 70%)`
                        }}
                      />
                      <div className="relative space-y-3">
                        <div className="mx-auto w-8 h-8">
                          <Palette className="w-full h-full" style={{ color: theme.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-center mb-1">{theme.name}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center line-clamp-2">{theme.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Usage</h2>
                  <CodeSnippetDemo
                    code={`// Import the D3BarChart component
import { D3BarChart } from '@codeium/vizzy';

// Use the theme prop to set your desired theme
function App() {
  return (
    <D3BarChart
      data={data}
      themeColor="${activeTheme.color}"
      // ... other props
    />
  );
}`}
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Coming Soon Features */}
          <Card className="relative overflow-hidden border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-zinc-900/20" />
            <div className="relative p-6">
              <h2 className="text-lg font-semibold mb-6">Coming Soon</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Color Palettes",
                    description: "Create and apply custom color palettes with complementary and analogous color schemes."
                  },
                  {
                    title: "Typography System",
                    description: "Control font families, sizes, weights, and line heights across all chart elements."
                  },
                  {
                    title: "Spacing & Layout",
                    description: "Fine-tune margins, paddings, and gaps between chart components."
                  },
                  {
                    title: "Animation Presets",
                    description: "Choose from a variety of animation styles for chart transitions and interactions."
                  }
                ].map((feature) => (
                  <div 
                    key={feature.title}
                    className="group relative rounded-md p-4 bg-zinc-800/50 border border-zinc-700/50 transition-colors hover:bg-zinc-800"
                  >
                    <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle at center, ${activeTheme.color}15 0%, transparent 70%)`
                      }}
                    />
                    <div className="relative">
                      <h3 className="text-sm font-medium mb-2" style={{ color: activeTheme.color }}>{feature.title}</h3>
                      <p className="text-sm text-zinc-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
