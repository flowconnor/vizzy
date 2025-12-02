"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/app/(shared)/ui";
import { useThemeColor } from "@/app/(shared)/providers/theme-context"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { themeColor } = useThemeColor()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative hover:bg-transparent group"
    >
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-300 blur-lg"
        style={{ backgroundColor: themeColor }}
      />
      {theme === "dark" ? (
        <Sun 
          className="h-5 w-5 text-foreground transition-colors duration-300" 
          style={{ 
            color: 'currentColor',
            '--hover-color': themeColor
          } as React.CSSProperties}
        />
      ) : (
        <Moon 
          className="h-5 w-5 text-foreground transition-colors duration-300"
          style={{ 
            color: 'currentColor',
            '--hover-color': themeColor
          } as React.CSSProperties}
        />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
