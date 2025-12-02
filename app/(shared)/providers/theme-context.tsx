'use client'

import React, { createContext, useContext, useState } from 'react'

interface ThemeColorContextType {
  themeColor: string
  setThemeColor: (color: string) => void
}

const ThemeColorContext = createContext<ThemeColorContextType>({
  themeColor: '#22C55E',  // Forest green as default
  setThemeColor: () => {},
})

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
  const [themeColor, setThemeColor] = useState('#22C55E')  // Forest green as default

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  )
}

export function useThemeColor() {
  return useContext(ThemeColorContext)
}
