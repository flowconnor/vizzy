"use client"

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useThemeColor } from '@/app/(shared)/providers/theme-context'

export default function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { themeColor } = useThemeColor()

  const handleLocaleChange = (newLocale: "en" | "es") => {
    if (newLocale === locale) return;
    
    try {
      router.replace(pathname, { locale: newLocale })
    } catch (error) {
      console.error('Error changing locale:', error)
    }
  }

  return (
    <div className="relative">
      <div className={cn(
        "relative flex items-center gap-0",
        "h-8 px-1",
        "rounded-full",
        "bg-background/40 dark:bg-black/40",
        "backdrop-blur-md",
        "border border-border/20",
        "transition-all duration-200"
      )}>
        <motion.div
          className="absolute inset-[2px] w-[calc(50%-2px)] rounded-full"
          style={{ 
            background: `${themeColor}15`,
            boxShadow: `0 0 10px 0 ${themeColor}10`
          }}
          animate={{
            x: locale === 'en' ? 0 : '100%',
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
        />
        <button
          onClick={() => handleLocaleChange('en')}
          className={cn(
            "relative z-10 w-10 h-full",
            "text-sm font-medium",
            "transition-colors duration-200",
            locale === 'en' 
              ? "text-foreground" 
              : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
        >
          EN
        </button>
        <button
          onClick={() => handleLocaleChange('es')}
          className={cn(
            "relative z-10 w-10 h-full",
            "text-sm font-medium",
            "transition-colors duration-200",
            locale === 'es'
              ? "text-foreground"
              : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
        >
          ES
        </button>
      </div>
    </div>
  )
}
