"use client"

import Link from "next/link"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/app/(shared)/ui/logo"
import { ThemeToggle } from "@/app/(shared)/ui/theme-toggle"
import LanguageSelector from "@/app/(shared)/ui/language-selector"
import { useTranslations } from 'next-intl'
import { cn } from "@/lib/utils"
import { useSidebar } from "../layout/sidebar-context"
import { usePathname } from 'next/navigation'
import { Sun, Moon } from 'lucide-react'
import { motion } from "framer-motion"
import { useThemeColor } from "@/app/(shared)/providers/theme-context"

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const pathname = usePathname()
  const isActive = pathname.includes(href)
  const { themeColor } = useThemeColor()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        href={href} 
        className={cn(
          "relative text-sm font-medium transition-colors group",
          isActive 
            ? "text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
        style={{
          color: isActive ? themeColor : undefined
        }}
      >
        <div className={cn(
          "absolute inset-0 rounded-md -z-10 transition-all duration-300 blur-sm",
          isActive 
            ? "opacity-10" 
            : "opacity-0 group-hover:opacity-10"
        )}
        style={{
          background: themeColor
        }}
        />
        {children}
      </Link>
    </motion.div>
  )
}

export function Navbar() {
  const t = useTranslations('Navbar')
  const pathname = usePathname()
  const { isExpanded } = useSidebar()
  const isDocsPage = pathname.includes('/docs')
  const { themeColor } = useThemeColor()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }
  
  return (
    <div className={cn(
      "fixed top-4 z-40",
      "transition-all duration-300",
      isDocsPage && "md:block hidden",
      isDocsPage 
        ? isExpanded 
          ? "left-[calc(18rem+1rem)] right-4 w-[calc(100%-19rem-1rem)]" 
          : "left-[calc(4rem+1rem)] right-4 w-[calc(100%-5rem-1rem)]"
        : "left-4 right-4"
    )}>
      {/* Add backdrop blur layer that extends above navbar */}
      <div className="absolute top-[-100vh] left-[-100vw] right-[-100vw] bottom-0 backdrop-blur-[32px] pointer-events-none" />
      <div className={cn(!isDocsPage && "max-w-7xl mx-auto")}>
        <div className="relative">
          {/* Dashed Border Container */}
          <div className="absolute inset-[-8px] pointer-events-none rounded-lg">
            <style jsx>{`
              @keyframes moveRight {
                from { background-position: 0 0; }
                to { background-position: 44px 0; }
              }
              @keyframes moveDown {
                from { background-position: 0 0; }
                to { background-position: 0 44px; }
              }
            `}</style>
            {/* Backdrop blur for entire container */}
            <div className="absolute inset-0 bg-white/[0.08] dark:bg-black/[0.08] backdrop-blur-[32px] rounded-lg" />
            {/* Top line */}
            <div 
              className="absolute left-0 right-0 h-[1px]"
              style={{
                background: `repeating-linear-gradient(to right, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                opacity: 0.4,
                animation: 'moveRight 3s linear infinite'
              }}
            />
            {/* Bottom line */}
            <div 
              className="absolute left-0 right-0 bottom-0 h-[1px]"
              style={{
                background: `repeating-linear-gradient(to right, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                opacity: 0.4,
                animation: 'moveRight 3s linear infinite'
              }}
            />
            {/* Left line */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-[1px]"
              style={{
                background: `repeating-linear-gradient(to bottom, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                opacity: 0.4,
                animation: 'moveDown 3s linear infinite'
              }}
            />
            {/* Right line */}
            <div 
              className="absolute top-0 bottom-0 right-0 w-[1px]"
              style={{
                background: `repeating-linear-gradient(to bottom, transparent, transparent 4px, ${themeColor}CC 4px, ${themeColor}CC 8px)`,
                opacity: 0.4,
                animation: 'moveDown 3s linear infinite'
              }}
            />
          </div>

          <motion.nav 
            className={cn(
              "relative flex items-center justify-between",
              "px-4 py-3",
              "rounded-lg",
              "transition-all duration-300 group/nav",
            )}
            whileHover={{ 
              y: 2,
              scale: 1.005
            }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
          >
            <div className="absolute inset-0 rounded-lg bg-white/[0.08] dark:bg-black/[0.08] backdrop-blur-[32px]" />
            <motion.div 
              className="relative flex items-center gap-4 font-sans"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Link href="/" className="flex items-center gap-3 mr-8 group relative">
                  <div 
                    className="absolute inset-[-4px] rounded-lg opacity-0 group-hover:opacity-20 transition-all duration-300 blur-lg"
                    style={{ backgroundColor: themeColor }}
                  />
                  <div className="h-10 w-10 relative">
                    <Logo className="absolute inset-0" />
                  </div>
                  <span 
                    className="hidden md:inline text-xl font-semibold tracking-tight text-foreground font-sans transition-all duration-300"
                    style={{
                      '--hover-color': themeColor
                    } as React.CSSProperties}
                  >
                    Canopy Charts
                  </span>
                </Link>
              </motion.div>

              <motion.div 
                className="hidden md:flex items-center gap-8 font-sans"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <NavLink href="/docs">{t('docs')}</NavLink>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-4 font-sans"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="flex items-center gap-4"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="relative hover:bg-transparent group"
                  >
                    <Link href="https://github.com/cbarrett3/canopy-charts">
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300 blur-lg" 
                        style={{ backgroundColor: themeColor }}
                      />
                      <Github 
                        className="h-5 w-5 transition-colors duration-300" 
                        style={{ 
                          color: 'currentColor',
                          '--hover-color': themeColor
                        } as React.CSSProperties}
                      />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <ThemeToggle />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <LanguageSelector />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.nav>
        </div>
      </div>
    </div>
  )
}
