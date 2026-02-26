"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Menu, ExternalLink } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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

function isActivePath(pathname, href) {
  if (!pathname) return false;
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminNav({ sections, onNavigate }) {
  const pathname = usePathname();

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
        <nav className="space-y-5 px-1 pb-6">
          {sections.map((sec) => (
            <div key={sec.title}>
              <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {sec.title}
              </div>
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const active = isActivePath(pathname, item.href);
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
                      <span className="truncate">{item.label}</span>
                      {typeof item.badge === "number" ? (
                        <Badge
                          variant={active ? "default" : "muted"}
                          className="shrink-0"
                        >
                          {item.badge}
                        </Badge>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
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
    </div>
  );
}

