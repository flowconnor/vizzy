'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SidebarContextType = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        isExpanded ? '18rem' : '4rem'
      );
      document.documentElement.dataset.sidebarExpanded = isExpanded.toString();
    }
  }, [isExpanded, mounted]);

  const value = React.useMemo(
    () => ({ isExpanded, setIsExpanded }),
    [isExpanded]
  );

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
