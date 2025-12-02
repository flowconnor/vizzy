'use client';

import * as Icons from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useSidebar } from "../layout/sidebar-context"
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  const { isExpanded } = useSidebar();
  // Update docs page detection to work with any locale
  const isDocsPage = pathname.includes('/docs')

  return (
    <footer className={cn(
      "relative mt-16 border-t border-border/40",
      "transition-all duration-300",
      isDocsPage 
        ? isExpanded 
          ? "ml-72" 
          : "ml-16"
        : ""
    )}>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80 dark:from-[#1B1B1B] dark:via-[#1B1B1B] dark:to-[#1B1B1B]/80" />
      
      <div className={cn(
        "relative",
        isDocsPage 
          ? "px-6" 
          : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
        "py-12"
      )}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Main Info */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground">Canopy Charts</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Fully customizable, low-level visualizations. Powered by D3, styled with Tailwind, nothing more.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link 
                href="https://github.com/cbarrett3/canopy-charts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-md hover:bg-muted transition-colors"
              >
                <Icons.Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link 
                href="https://twitter.com/canopycharts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-md hover:bg-muted transition-colors"
              >
                <Icons.Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link 
                href="https://www.npmjs.com/package/canopy-charts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-md hover:bg-muted transition-colors"
              >
                <Icons.PackageCheck className="h-4 w-4" />
                <span className="sr-only">NPM</span>
              </Link>
            </div>
          </div>

          {/* Documentation */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Documentation</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-muted-foreground hover:text-green-500 transition-colors">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/docs/installation" className="text-muted-foreground hover:text-green-500 transition-colors">
                  Installation
                </Link>
              </li>
              <li>
                <Link href="/docs/examples" className="text-muted-foreground hover:text-green-500 transition-colors">
                  Examples
                </Link>
              </li>
              <li>
                <Link href="/docs/api" className="text-muted-foreground hover:text-green-500 transition-colors">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Community</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link 
                  href="https://github.com/cbarrett3/canopy-charts" 
                  className="text-muted-foreground hover:text-green-500 transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link 
                  href="https://twitter.com/canopycharts" 
                  className="text-muted-foreground hover:text-green-500 transition-colors"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-muted-foreground hover:text-green-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} Canopy Charts. Released under the MIT License.
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/security" className="hover:text-foreground transition-colors">
                Security
              </Link>
              <Link href="/status" className="hover:text-foreground transition-colors">
                Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
