'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/app/(shared)/ui";
import { Keyboard, Eye, Speaker, Code2, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const features = [
  {
    icon: Keyboard,
    title: "Keyboard Navigation",
    description: "Navigate through chart elements using arrow keys and enter for selection. Tab support for focus management.",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-500/10 to-blue-600/10",
    code: `<D3BarChart
  data={data}
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'ArrowRight') nextBar()
    if (e.key === 'ArrowLeft') prevBar()
    if (e.key === 'Enter') selectBar()
  }}
/>`
  },
  {
    icon: Eye,
    title: "Visual Accessibility",
    description: "High contrast themes, customizable colors, and clear visual hierarchies for all users.",
    color: "from-purple-500 to-purple-600",
    bgColor: "from-purple-500/10 to-purple-600/10",
    code: `<D3BarChart
  data={data}
  theme={{
    colors: {
      primary: '#22C55E',
      contrast: '#000',
      bg: '#fff'
    },
    patterns: true
  }}
/>`
  },
  {
    icon: Speaker,
    title: "Screen Reader Support",
    description: "Comprehensive ARIA labels and descriptions for meaningful screen reader navigation.",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-500/10 to-green-600/10",
    code: `<D3BarChart
  data={data}
  aria-label="Revenue chart"
  role="graphics-document"
  aria-description="Monthly revenue"
  getBarLabel={d => 
    \`\${d.label}: \${d.value}%\`
  }
/>`
  },
  {
    icon: Code2,
    title: "Semantic Markup",
    description: "Clean, semantic HTML structure with proper roles and relationships.",
    color: "from-orange-500 to-orange-600",
    bgColor: "from-orange-500/10 to-orange-600/10",
    code: `<figure role="graphics-document">
  <figcaption className="sr-only">
    Revenue Metrics
  </figcaption>
  <D3BarChart
    data={data}
    role="graphics-symbol"
  />
</figure>`
  }
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
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            fontFamily: '"JetBrains Mono", monospace',
            height: '100%',
            background: 'rgb(17, 17, 17)',
          }}
          wrapLongLines={true}
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

export default function AccessibilityPage() {
  const [mounted, setMounted] = useState(false);

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
            Accessibility
          </motion.h1>
          <div 
            className="absolute -inset-x-2 -inset-y-2 blur-lg opacity-40 -z-10"
            style={{
              background: `linear-gradient(to right, ${themeColor}20, ${themeColor}10, ${themeColor}20)`
            }}
          />
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl mb-6">
          Vizzy is committed to making data visualization accessible to everyone. Our D3-based components are continuously evolving to meet and exceed WCAG 2.1 guidelines, ensuring a seamless experience across all devices and assistive technologies.
        </p>

        <div className="space-y-6">
          {/* Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="relative overflow-hidden border-zinc-200/40 dark:border-zinc-800/50 bg-zinc-50/40 dark:bg-zinc-900/50 backdrop-blur-xl h-full">
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-900/50 to-transparent" />
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-md bg-gradient-to-r",
                        feature.bgColor
                      )}>
                        <feature.icon className={cn(
                          "h-5 w-5 bg-gradient-to-r bg-clip-text text-transparent",
                          feature.color
                        )} />
                      </div>
                      <h2 className={cn(
                        "text-lg font-semibold bg-gradient-to-r bg-clip-text text-transparent",
                        feature.color
                      )}>
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {feature.description}
                    </p>
                    <div className="mt-4">
                      <CodeSnippetDemo code={feature.code} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Future Improvements Note */}
          <motion.div variants={itemVariants}>
            <Card className="relative overflow-hidden border-zinc-200/40 dark:border-zinc-800/50 bg-zinc-50/40 dark:bg-zinc-900/50 backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/50 dark:from-zinc-900/50 to-transparent" />
              <div className="relative p-6">
                <h2 className="text-lg font-semibold mb-3 bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                  Continuous Improvement
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  We&apos;re actively working on enhancing our D3-based components with more accessibility features, including:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    Advanced focus management and keyboard interactions
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    Enhanced screen reader descriptions for complex visualizations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    Additional color contrast options and pattern fills
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    Improved touch and gesture support for mobile devices
                  </li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
