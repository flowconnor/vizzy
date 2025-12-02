'use client';

import { Github, GitPullRequest, Bug, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';

export default function ContributingPage() {
  const [mounted, setMounted] = useState(false);
  useTranslations('Docs.features');

  useEffect(() => {
    setMounted(true);
  }, []);

  const contributionTypes = [
    {
      icon: <Github className="w-6 h-6" />,
      title: "Fork & Clone",
      description: "Start by forking the repository and cloning it locally."
    },
    {
      icon: <GitPullRequest className="w-6 h-6" />,
      title: "Pull Requests",
      description: "Submit PRs for bug fixes, features, or documentation improvements."
    },
    {
      icon: <Bug className="w-6 h-6" />,
      title: "Report Issues",
      description: "Help us by reporting bugs or suggesting new features."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Star & Share",
      description: "Support us by starring the repo and sharing with others."
    }
  ];

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
            How to Contribute
          </motion.h1>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-8">
          We welcome contributions from the community! Here's how you can help make Vizzy even better.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contributionTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-green-500/50 dark:hover:border-green-500/50 transition-colors group"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="text-green-600 dark:text-green-500 group-hover:text-green-400 transition-colors">
                  {type.icon}
                </div>
                <h3 className="font-medium">{type.title}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {type.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-medium mb-4">Contribution Guidelines</h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
              <li>Ensure your code follows the existing style and conventions</li>
              <li>Write clear commit messages and documentation updates</li>
              <li>Add tests for new features when applicable</li>
              <li>Update the changelog for notable changes</li>
              <li>Be respectful and constructive in discussions</li>
            </ul>
          </div>

          <div className="mt-8 p-6 rounded-lg border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.2)] dark:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-green-500" />
              <h3 className="font-medium">Thank You!</h3>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              We&apos;re excited to have you contribute to Vizzy!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
