'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger, CodeBlock } from "@/app/(shared)/ui";

export default function CustomizationPage() {
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Docs.features');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto py-6 px-4">
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
              backgroundImage: "linear-gradient(to right, #22c55e, #4ade80, #86efac, #4ade80, #22c55e)",
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
            Customization
          </motion.h1>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p>
            Vizzy offers extensive customization options to ensure your visualizations perfectly match your application's design language.
          </p>

          <h2>Theme Customization</h2>
          <p>
            Every aspect of your charts can be customized through our theming system. From colors to fonts, spacing to animations, you have complete control over the visual appearance.
          </p>

          <CodeBlock 
            code={`// Example of theme customization
const theme = {
  colors: {
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#15803d'
  }
}`} 
            language="tsx" 
          />

          <h2>Component-Level Styling</h2>
          <p>
            Each chart component accepts style props for fine-grained control over individual elements. This allows you to create unique variations while maintaining consistency across your application.
          </p>

          <h2>Responsive Design</h2>
          <p>
            All customization options are designed to work seamlessly across different screen sizes and devices, ensuring your visualizations look great everywhere.
          </p>
        </div>
      </div>
    </div>
  );
}
