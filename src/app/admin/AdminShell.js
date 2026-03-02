"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  Menu, 
  ExternalLink, 
  LayoutDashboard,
  Home,
  Tag,
  MapPin,
  FileText,
  Layout,
  Image as ImageIcon,
  Navigation,
  Mail,
  Share2,
  Users,
  Hammer,
  ChevronDown,
  ChevronRight,
  Images
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

const MobileNavSheet = dynamic(
  () => import("./MobileNavSheet").then((m) => m.MobileNavSheet),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden"
        aria-label="Открыть меню"
        suppressHydrationWarning
      >
        <Menu className="h-4 w-4" />
      </Button>
    ),
  }
);

// Маппинг иконок для пунктов меню
const ICON_MAP = {
  "Дашборд": LayoutDashboard,
  "Объекты": Home,
  "Теги": Tag,
  "Города": MapPin,
  "Новости и статьи": FileText,
  "Страницы и баннеры": Layout,
  "Медиа": ImageIcon,
  "Навигация": Navigation,
  "Контакты": Mail,
  "Соцсети": Share2,
  "Партнёры": Users,
  "Этапы и услуги": Hammer,
  "Кейсы до/после": Images,
};

function getIcon(label) {
  const IconComponent = ICON_MAP[label];
  return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
}

function isActivePath(pathname, href) {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminNav({ sections, onNavigate }) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState(() => {
    // По умолчанию открываем раздел, в котором находится активная страница
    const initialOpen = {};
    sections.forEach((sec, index) => {
      const hasActive = sec.items.some(item => isActivePath(pathname, item.href));
      initialOpen[index] = hasActive;
    });
    return initialOpen;
  });

  const toggleSection = (index) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-1 pb-2">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          MG Group
        </div>
        <div className="mt-1 text-sm font-semibold text-foreground">
          Панель управления
        </div>
      </div>

      <Separator className="my-3" />

      <ScrollArea className="flex-1">
        <nav className="space-y-2 px-1 pb-6">
          {sections.map((sec, index) => {
            const isOpen = openSections[index];
            const hasActive = sec.items.some(item => isActivePath(pathname, item.href));
            
            return (
              <div key={sec.title}>
                <button
                  onClick={() => toggleSection(index)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                    hasActive
                      ? "bg-accent/50 text-accent-foreground"
                      : "text-foreground/70 hover:bg-accent/30 hover:text-accent-foreground"
                  )}
                >
                  <span className="text-xs uppercase tracking-wider">{sec.title}</span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="mt-1 space-y-1 pl-2">
                    {sec.items.map((item) => {
                      const active = isActivePath(pathname, item.href);
                      const icon = getIcon(item.label);
                      
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={onNavigate}
                          className={cn(
                            "group flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                            active
                              ? "bg-accent text-accent-foreground"
                              : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {icon && (
                              <span className={cn(
                                "shrink-0",
                                active ? "text-accent-foreground" : "text-muted-foreground"
                              )}>
                                {icon}
                              </span>
                            )}
                            <span className="truncate">{item.label}</span>
                          </div>
                          {typeof item.badge === "number" ? (
                            <Badge
                              variant={active ? "default" : "secondary"}
                              className="shrink-0"
                            >
                              {item.badge}
                            </Badge>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

export function AdminShell({ navSections = [], navItems, children }) {
  const sections = useMemo(() => {
    if (Array.isArray(navSections) && navSections.length) return navSections;
    if (Array.isArray(navItems) && navItems.length) {
      return [{ title: "Навигация", items: navItems }];
    }
    return [];
  }, [navItems, navSections]);

  return (
    <div className="admin-theme min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className="hidden w-80 shrink-0 border-r border-border bg-card p-4 lg:block"
        >
          <AdminNav sections={sections} />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-border bg-background shadow-sm">
            <div className="flex h-14 items-center justify-between gap-3 px-4 lg:px-6">
              <div className="flex items-center gap-2">
                <MobileNavSheet
                  renderNav={(close) => (
                    <AdminNav sections={sections} onNavigate={close} />
                  )}
                />

                <div className="leading-tight">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    MG Group — CMS
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    Управление сайтом и контентом
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline">
                  <Link href="/">
                    <ExternalLink className="h-4 w-4" />
                    На сайт
                  </Link>
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 lg:px-6">{children}</div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

