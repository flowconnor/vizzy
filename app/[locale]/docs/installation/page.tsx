'use client';

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { useParams } from 'next/navigation';

const InstallationPage = () => {
  const t = useTranslations("Docs.installation");
  const [copied, setCopied] = useState<string>();
  const { locale } = useParams();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(undefined), 2000);
  };

  const dependencies = [
    {
      name: "React" as const,
      version: "18.x",
      logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
      description: "Required: Core UI framework"
    },
    {
      name: "D3.js" as const,
      version: "7.x",
      logo: "https://raw.githubusercontent.com/d3/d3-logo/master/d3.svg",
      description: "Required: Data visualization library"
    },
    {
      name: "TypeScript" as const,
      version: "5.x",
      logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
      description: "Required: Type safety and better DX"
    },
    {
      name: "Tailwind CSS" as const,
      version: "3.x",
      logo: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg",
      description: "Required: Styling and theming"
    }
  ] as const;

  type TechName = typeof dependencies[number]['name'];

  const techInfo: Record<TechName, { color: string; url: string }> = {
    'React': {
      color: 'rgb(97, 218, 251)',
      url: 'https://react.dev/learn'
    },
    'D3.js': {
      color: 'rgb(244, 99, 58)',
      url: 'https://d3js.org/getting-started'
    },
    'TypeScript': {
      color: 'rgb(49, 120, 198)',
      url: 'https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html'
    },
    'Tailwind CSS': {
      color: 'rgb(56, 189, 248)',
      url: 'https://tailwindcss.com/docs/installation'
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-4">
          <div className="relative inline-block">
            <h1 className="text-4xl font-semibold tracking-tight bg-clip-text text-transparent relative z-10"
              style={{
                backgroundImage: "linear-gradient(to right, #22c55e, #4ade80)",
              }}
            >
              Get started with Vizzy
            </h1>
            <div className="absolute -inset-x-4 -inset-y-4 bg-gradient-to-r from-green-500/10 via-green-500/5 to-green-500/10 blur-xl opacity-50 -z-10" />
          </div>
          <p className="text-lg text-zinc-400">
            Build beautiful, interactive charts with React and D3.js in minutes
          </p>
        </div>  

        {/* Requirements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {dependencies.map((dep, index) => {
            const { color, url } = techInfo[dep.name] || { color: 'rgb(75, 85, 99)', url: '#' };
            
            return (
              <motion.a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                key={dep.name}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  rotateZ: (index - 1.5) * 3,
                  x: (index - 1.5) * 4
                }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5,
                  rotateZ: (index - 1.5) * 4,
                  z: 1
                }}
                className="relative group cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-xl transform -skew-y-2 scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${color}20)`
                  }}
                />
                <div 
                  className="relative bg-zinc-900 backdrop-blur-sm rounded-xl p-4 shadow-lg transform transition-all duration-300 group-hover:-translate-y-2"
                  style={{
                    transformOrigin: 'top',
                    border: `1px solid ${color}`,
                    boxShadow: `0 4px 0 0 ${color}40`
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <div 
                        className="absolute -inset-4 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity"
                        style={{
                          background: `radial-gradient(circle, ${color}, transparent)`
                        }}
                      />
                      <Image
                        src={dep.logo}
                        alt={dep.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 relative transform transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-sm">{dep.name}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{`v${dep.version}`}</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        {dep.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Quick Start */}
        <div className="space-y-4">
          <h2 
            className="text-xl font-medium tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #22c55e, #4ade80)",
            }}
          >
            Quick Start
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl">
            The Vizzy CLI helps you get started quickly by checking your project setup, installing dependencies, and adding chart components. When you create a new chart, it sets up all the necessary building blocks including data handling, styling, and animations.
          </p>
          
          <div className="grid gap-4">
            {/* Step 1: Create Project */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                  1
                </div>
                <h3 className="text-lg font-medium tracking-tight">Create Project</h3>
              </div>
              <div className="relative pl-10">
                <div className="relative">
                  <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800/50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCopy("npx vizzy@latest init", "create-npx")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "create-npx" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            npx
                          </button>
                          <button
                            onClick={() => handleCopy("pnpm dlx vizzy@latest init", "create-pnpm")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "create-pnpm" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            pnpm
                          </button>
                          <button
                            onClick={() => handleCopy("yarn dlx vizzy@latest init", "create-yarn")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "create-yarn" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            yarn
                          </button>
                          <button
                            onClick={() => handleCopy("bunx vizzy@latest init", "create-bun")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "create-bun" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            bun
                          </button>
                          <button
                            onClick={() => handleCopy("deno run npm:vizzy@latest init", "create-deno")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "create-deno" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            deno
                          </button>
                        </div>
                        <div className="w-px h-4 bg-zinc-800" />
                        <button
                          onClick={() => {
                            const cmd = copied?.startsWith("create-pnpm") ? "pnpm dlx vizzy@latest init" :
                              copied?.startsWith("create-yarn") ? "yarn dlx vizzy@latest init" :
                              copied?.startsWith("create-bun") ? "bunx vizzy@latest init" :
                              copied?.startsWith("create-deno") ? "deno run npm:vizzy@latest init" :
                              "npx vizzy@latest init";
                            handleCopy(cmd, copied || "create-npx");
                          }}
                          className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copied?.startsWith("create-") ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-zinc-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="px-4 py-3 font-mono text-sm text-zinc-100 bg-black/40">
                      <span className="text-green-500">$</span> {copied?.startsWith("create-pnpm") ? "pnpm dlx vizzy@latest init" : 
                        copied?.startsWith("create-yarn") ? "yarn dlx vizzy@latest init" :
                        copied?.startsWith("create-bun") ? "bunx vizzy@latest init" :
                        copied?.startsWith("create-deno") ? "deno run npm:vizzy@latest init" :
                        "npx vizzy@latest init"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Add Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                  2
                </div>
                <h3 className="text-lg font-medium tracking-tight">Add Chart</h3>
              </div>
              <div className="relative pl-10">
                <div className="relative">
                  <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-lg border border-zinc-800/50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/50">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCopy("npx vizzy add line-chart", "add-npx")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "add-npx" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            npx
                          </button>
                          <button
                            onClick={() => handleCopy("pnpm dlx vizzy add line-chart", "add-pnpm")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "add-pnpm" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            pnpm
                          </button>
                          <button
                            onClick={() => handleCopy("yarn dlx vizzy add line-chart", "add-yarn")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "add-yarn" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            yarn
                          </button>
                          <button
                            onClick={() => handleCopy("bunx vizzy add line-chart", "add-bun")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "add-bun" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            bun
                          </button>
                          <button
                            onClick={() => handleCopy("deno run npm:vizzy add line-chart", "add-deno")}
                            className={`text-xs px-2 py-0.5 rounded transition-colors ${copied === "add-deno" ? "text-green-500 bg-green-500/10" : "text-zinc-500 hover:text-zinc-400"}`}
                          >
                            deno
                          </button>
                        </div>
                        <div className="w-px h-4 bg-zinc-800" />
                        <button
                          onClick={() => {
                            const cmd = copied?.startsWith("add-pnpm") ? "pnpm dlx vizzy add line-chart" :
                              copied?.startsWith("add-yarn") ? "yarn dlx vizzy add line-chart" :
                              copied?.startsWith("add-bun") ? "bunx vizzy add line-chart" :
                              copied?.startsWith("add-deno") ? "deno run npm:vizzy add line-chart" :
                              "npx vizzy add line-chart";
                            handleCopy(cmd, copied || "add-npx");
                          }}
                          className="p-1.5 rounded-md hover:bg-white/5 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copied?.startsWith("add-") ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-zinc-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="px-4 py-3 font-mono text-sm text-zinc-100 bg-black/40">
                      <span className="text-green-500">$</span> {copied?.startsWith("add-pnpm") ? "pnpm dlx vizzy add line-chart" :
                        copied?.startsWith("add-yarn") ? "yarn dlx vizzy add line-chart" :
                        copied?.startsWith("add-bun") ? "bunx vizzy add line-chart" :
                        copied?.startsWith("add-deno") ? "deno run npm:vizzy add line-chart" :
                        "npx vizzy add line-chart"}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Next Steps */}
        <Link 
          href={`/${locale}/docs/line-chart`}
          className="block group relative rounded-lg border bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-900 dark:border-zinc-800 p-3 hover:shadow-md transition-all duration-300 active:scale-[0.99]"
        >
          <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-green-500/50 group-active:border-green-500/70 transition-all duration-500" />
          <div className="absolute -inset-px rounded-lg border border-transparent group-hover:border-green-500/30 group-active:border-green-500/50 transition-all duration-500" />
          <div className="absolute -inset-[2px] rounded-lg border border-transparent group-hover:border-green-500/20 group-active:border-green-500/40 blur-[1px] transition-all duration-500" />
          <div className="relative flex items-start space-x-3">
            <div className="h-8 w-8 rounded-full border border-primary/30 flex items-center justify-center group-hover:border-primary/50 group-active:border-primary/70 transition-colors duration-300">
              <ArrowRight className="h-3.5 w-3.5 text-primary group-hover:translate-x-0.5 group-active:translate-x-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1 text-zinc-900 dark:text-zinc-100 group-hover:text-green-500/90 transition-colors duration-300">Line Chart Documentation</h3>
              <p className="text-xs text-muted-foreground/80 mb-2 group-hover:text-muted-foreground/90 transition-colors">
                Learn how to customize and use the D3.js line chart component
              </p>
              <div className="inline-flex items-center text-xs text-primary group-hover:text-primary/80 transition-colors">
                <span className="relative">
                  View Documentation
                  <span className="absolute inset-x-0 -bottom-0.5 h-[1px] bg-gradient-to-r from-green-500/0 via-green-500/70 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <ArrowRight className="ml-1 h-3 w-3 transform group-hover:translate-x-0.5 group-active:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
};

export default InstallationPage;
