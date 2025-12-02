'use client';

import { useTranslations } from 'next-intl';
import { useSidebar } from '@/app/(site)/components/layout/sidebar-context';
import { Search, Menu, X, ChevronRight, PanelLeftClose, PanelLeft, ChevronUp, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { cn } from "@/lib/utils"
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from '@/app/(shared)/ui/logo';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded: isOpen, setIsExpanded: setIsOpen } = useSidebar();
  const { locale } = useParams();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isManualToggleRef = useRef(false);

  // Reset manual toggle flag after a short delay
  const resetManualToggle = () => {
    setTimeout(() => {
      isManualToggleRef.current = false;
    }, 100);
  };

  // Handle manual toggle
  const handleToggle = () => {
    isManualToggleRef.current = true;
    setIsOpen(!isOpen);
    resetManualToggle();
  };

  const gettingStartedT = useTranslations('Docs.getting-started');
  const visualizationsT = useTranslations('Docs.visualizations');
  const featuresT = useTranslations('Docs.features');
  const contributingT = useTranslations('Docs.contributing');
  const searchT = useTranslations('Docs');

  const sidebarConfig = [
    {
      label: gettingStartedT('title'),
      items: [
        { label: gettingStartedT('introduction.title'), href: `/${locale}/docs` },
        { label: gettingStartedT('installation.title'), href: `/${locale}/docs/installation` },
      ]
    },
    {
      label: visualizationsT('title'),
      items: [
        { label: visualizationsT('line-chart'), href: `/${locale}/docs/line-chart` },
        { label: visualizationsT('bar-chart'), href: `/${locale}/docs/bar-chart` },
        { label: visualizationsT('donut-chart'), href: `/${locale}/docs/donut-chart` },
        { label: visualizationsT('stream-chart'), href: `/${locale}/docs/stream-chart` },
        { label: visualizationsT('tree-map'), href: `/${locale}/docs/treemap-chart` },
        { label: visualizationsT('stacked-bar-chart'), href: `/${locale}/docs/stacked-bar-chart` },
      ]
    },
    {
      label: featuresT('title'),
      items: [
        { label: featuresT('theming'), href: `/${locale}/docs/theming` },
        { label: featuresT('animations'), href: `/${locale}/docs/animations` },
        { label: featuresT('responsiveness'), href: `/${locale}/docs/responsiveness` },
        { label: featuresT('accessibility'), href: `/${locale}/docs/accessibility` },
      ]
    },
    {
      label: contributingT('title'),
      items: [
        { label: contributingT('how-to'), href: `/${locale}/docs/contributing` }
      ]
    }
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    
    const handleResize = () => {
      // Only update state if it wasn't manually toggled
      if (!isManualToggleRef.current) {
        if (mediaQuery.matches) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      }
      document.body.style.overflow = (mediaQuery.matches && isOpen) ? 'hidden' : 'auto';
    }
    
    // Initial setup
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, setIsOpen]);

  // Handle navigation changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    // Only update state if it wasn't manually toggled
    if (!isManualToggleRef.current) {
      if (mediaQuery.matches) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    }
  }, [pathname, setIsOpen]);

  return (
    <div className="relative min-h-screen">
      {/* Mobile Menu Button and Dropdown */}
      <nav className={cn(
        "fixed top-4 left-4 right-4 z-[100] md:hidden",
        "bg-transparent"
      )}>
        <div className="relative isolate">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-background/80 dark:bg-[#1B1B1B]/80 backdrop-blur-[8px] backdrop-saturate-[140%] rounded-xl" />
            <div className="absolute inset-0 border border-border/40 dark:border-border/30 rounded-xl" />
            <div className="absolute inset-0 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12),0_4px_8px_-4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3),0_4px_8px_-4px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.05)] rounded-xl transition-all duration-300" />
          </div>
          <div className="relative flex items-center justify-between h-[52px] px-5 py-2.5">
            <Link href="/" className="flex items-center gap-3 group relative z-[101]">
              <div className="absolute inset-[-4px] rounded-xl bg-green-500/0 group-hover:bg-green-500/20 transition-all duration-300 blur-lg" />
              <div className="h-10 w-10 relative">
                <Logo className="absolute inset-0" showGrid={false} />
              </div>
            </Link>
            <button
              onClick={handleToggle}
              className="relative p-2 rounded-lg hover:bg-transparent group"
            >
              <div className="absolute inset-0 rounded-full bg-green-500/0 group-hover:bg-green-500/20 transition-all duration-300 blur-lg" />
              <Menu className={cn(
                "w-5 h-5 transition-all relative text-foreground group-hover:text-green-500",
                isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              )} />
              <X className={cn(
                "w-5 h-5 transition-all absolute inset-0 m-2 text-foreground group-hover:text-green-500",
                !isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              )} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-[40] bg-background md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Content */}
      <div className={cn(
        "fixed inset-x-4 top-[76px] bottom-4 z-[45] md:hidden isolate",
        "before:absolute before:inset-0 before:-z-10",
        "before:bg-background/95 before:dark:bg-[#1B1B1B]/95",
        "before:backdrop-blur-[8px] before:backdrop-saturate-[140%]",
        "before:border before:border-border/40 before:dark:border-border/30",
        "before:rounded-xl",
        "before:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12),0_4px_8px_-4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.2)]",
        "before:dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3),0_4px_8px_-4px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.05)]",
        "before:transition-all before:duration-300 before:ease-out",
        isOpen 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 -translate-y-4 pointer-events-none"
      )}>
        <div className="relative z-10 p-6 h-full overflow-y-auto">
          <div className="space-y-6">
            {sidebarConfig.map((item) => (
              <div key={item.label} className="space-y-3">
                <div className="font-medium text-lg text-foreground/90">{item.label}</div>
                <div className="space-y-1 pl-1">
                  {item.items?.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "group flex items-center py-2 px-3 rounded-lg relative isolate",
                        "text-muted-foreground/90 hover:text-green-500",
                        "transition-all duration-300"
                      )}
                      onClick={() => {
                        isManualToggleRef.current = false;
                        setIsOpen(false);
                      }}
                    >
                      <div className="absolute inset-0 rounded-lg bg-green-500/0 group-hover:bg-green-500/10 -z-10 transition-all duration-300" />
                      <div className="absolute inset-0 rounded-lg bg-green-500/0 group-hover:bg-green-500/5 blur-lg -z-10 transition-all duration-300" />
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className={cn(
        "fixed z-40 hidden md:flex flex-col border-r border-border/40 bg-sidebar transition-all duration-300",
        "top-0 h-screen",
        isOpen ? "md:w-72" : "md:w-16"
      )}>
        <div className="flex flex-col h-full">
          <div className={cn(
            "sticky top-4 z-50 flex items-center gap-2 px-4 bg-background dark:bg-[#1B1B1B]",
            "rounded-none border-b border-border/40",
            "h-[52px] pt-1"
          )}>
            <div className={cn(
              "relative flex-1",
              !isOpen && "hidden" // Hide search when collapsed
            )}>
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={searchT('search')}
                className={cn(
                  "w-full pl-9 h-10 bg-background/40 dark:bg-[#2A2A2A]",
                  "border-border/40",
                  "focus-visible:ring-1 focus-visible:ring-green-500/20",
                  "placeholder:text-muted-foreground/50"
                )}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-10 w-10 relative group hover:bg-transparent",
                "after:absolute after:inset-0 after:rounded-full after:bg-green-500/0 hover:after:bg-green-500/20 after:transition-all after:duration-300 after:blur-lg",
                !isOpen && "mx-auto" // Center the button when collapsed
              )}
              onClick={handleToggle}
            >
              {isOpen ? (
                <PanelLeftClose className="relative z-10 text-foreground group-hover:text-green-500 transition-colors duration-300" />
              ) : (
                <PanelLeft className="relative z-10 text-foreground group-hover:text-green-500 transition-colors duration-300" />
              )}
            </Button>
          </div>
          <SidebarContent isOpen={isOpen} sidebarConfig={sidebarConfig} />
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 min-h-screen transition-all duration-300",
        "pt-[52px] md:pt-24", // Mobile: account for top bar, Desktop: normal padding
        isOpen ? "md:pl-72" : "md:pl-16" // Desktop sidebar spacing
      )}>
        <div className="container relative mx-auto p-4 md:p-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

// Separate component for sidebar content to avoid duplication
function SidebarContent({ isOpen, sidebarConfig }: { isOpen: boolean, sidebarConfig: any[] }) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    // Get the part after /docs/ from both paths
    const getDocsPath = (p: string) => {
      const match = p.match(/\/docs\/?(.*)$/);
      return match ? match[1] : '';
    };
    
    const currentPath = getDocsPath(pathname);
    const itemPath = getDocsPath(path);
    
    return currentPath === itemPath;
  };

  return (
    <div className="overflow-y-auto flex-1 pt-6">
      {sidebarConfig.map((item, i) => (
        <div key={i} className="py-4">
          <h2 className={cn(
            "px-4 text-sm font-semibold text-foreground/70",
            !isOpen && "md:hidden"
          )}>
            {item.label}
          </h2>
          <div className="mt-2">
            {item.items?.map((subItem: any, j: number) => {
              const active = isActive(subItem.href);
              return (
                <div key={j} className="relative isolate">
                  {active && (
                    <div className="absolute inset-0 -z-[1] mx-2">
                      <div className="absolute inset-0 rounded-lg bg-green-500/5 blur-[2px]" />
                      <div className="absolute -inset-1 rounded-lg bg-green-500/3 blur-sm" />
                    </div>
                  )}
                  <Link
                    href={subItem.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-1.5 text-sm transition-colors relative",
                      !isOpen && "md:justify-center",
                      active
                        ? "text-green-500/90"
                        : "text-muted-foreground hover:text-green-500"
                    )}
                  >
                    <ChevronRight className={cn(
                      "h-3 w-3",
                      !isOpen && "md:hidden"
                    )} />
                    <span className={cn(
                      !isOpen && "md:hidden"
                    )}>
                      {subItem.label}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
