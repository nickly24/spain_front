"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Container } from "./Container";
import Image from "next/image";
import { LOCALES } from "../lib/i18n";
import { getUi } from "../lib/ui";

/** Порог вниз: скрыть верхнюю полосу при scrollY >= это значение */
const SCROLL_HIDE_PX = 100;
/** Порог вверх: показать полосу при scrollY <= это значение. Гистерезис убирает дёрганье у границы */
const SCROLL_SHOW_PX = 40;

const FALLBACK_NAV = {
  ru: [
    { href: "/sale", label: "Продажа" },
    { href: "/rent", label: "Аренда" },
    { href: "/construction", label: "Строительство" },
    { href: "/about", label: "О компании" },
    { href: "/news", label: "Новости и статьи" },
    { href: "/contacts", label: "Контакты" },
  ],
  en: [
    { href: "/sale", label: "Sale" },
    { href: "/rent", label: "Rent" },
    { href: "/construction", label: "Construction" },
    { href: "/about", label: "About" },
    { href: "/news", label: "News" },
    { href: "/contacts", label: "Contacts" },
  ],
  es: [
    { href: "/sale", label: "Venta" },
    { href: "/rent", label: "Alquiler" },
    { href: "/construction", label: "Construcción" },
    { href: "/about", label: "Sobre nosotros" },
    { href: "/news", label: "Noticias" },
    { href: "/contacts", label: "Contactos" },
  ],
};
const FALLBACK_TOPBAR = {
  ru: [
    { href: "/partners", label: "Партнёрам" },
    { href: "/sale", label: "Продажа с MG Group" },
    { href: "/news", label: "Новости" },
    { href: "/about", label: "О компании" },
  ],
  en: [
    { href: "/partners", label: "Partners" },
    { href: "/sale", label: "Sale with MG Group" },
    { href: "/news", label: "News" },
    { href: "/about", label: "About" },
  ],
  es: [
    { href: "/partners", label: "Socios" },
    { href: "/sale", label: "Venta con MG Group" },
    { href: "/news", label: "Noticias" },
    { href: "/about", label: "Sobre nosotros" },
  ],
};

function Icon({ children, className = "" }) {
  return (
    <span
      className={`inline-flex size-9 items-center justify-center rounded-full border border-black/10 bg-black/3 text-slate-600 hover:text-slate-900 hover:border-black/15 ${className}`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

function BurgerIcon({ open, className }) {
  return (
    <span className={`inline-flex flex-col justify-center gap-1.5 ${className}`} aria-hidden>
      <span
        className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
          open ? "translate-y-2 rotate-45" : ""
        }`}
      />
      <span className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${open ? "opacity-0 scale-x-0" : ""}`} />
      <span
        className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-200 ${
          open ? "-translate-y-2 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

/** Строит путь для смены языка: /ru/about -> /en/about */
function pathForLocale(pathname, locale) {
  if (!pathname || pathname === "/") return `/${locale}`;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${locale}`;
  const rest = segments.slice(1).join("/");
  return rest ? `/${locale}/${rest}` : `/${locale}`;
}

export function Header({ lang = "ru", headerLinks = [], topbarLinks = [], socials = [] }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <HeaderInner pathname={pathname} lang={lang} headerLinks={headerLinks} topbarLinks={topbarLinks} socials={socials} />;
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5H16.8V5.1c-.3 0-1.2-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7.7v3h2.7v8h3.1Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5Zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5ZM18 6.7a1.3 1.3 0 1 1-1.3 1.3A1.3 1.3 0 0 1 18 6.7Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31.3 31.3 0 0 0 2 12a31.3 31.3 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 22 12a31.3 31.3 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

function Flag({ locale, className = "" }) {
  if (locale === "ru") {
    return (
      <svg viewBox="0 0 24 16" className={`h-4 w-6 rounded-sm ${className}`} aria-hidden>
        <rect width="24" height="16" rx="2" fill="#FFFFFF" />
        <rect y="5.33" width="24" height="5.34" fill="#0039A6" />
        <rect y="10.66" width="24" height="5.34" fill="#D52B1E" />
        <rect width="24" height="16" rx="2" fill="none" stroke="rgba(0,0,0,0.08)" />
      </svg>
    );
  }
  if (locale === "es") {
    return (
      <svg viewBox="0 0 24 16" className={`h-4 w-6 rounded-sm ${className}`} aria-hidden>
        <rect width="24" height="16" rx="2" fill="#AA151B" />
        <rect y="4" width="24" height="8" fill="#F1BF00" />
        <rect width="24" height="16" rx="2" fill="none" stroke="rgba(0,0,0,0.08)" />
      </svg>
    );
  }
  // en -> simplified UK-style flag (SVG, not emoji)
  return (
    <svg viewBox="0 0 24 16" className={`h-4 w-6 rounded-sm ${className}`} aria-hidden>
      <rect width="24" height="16" rx="2" fill="#012169" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#FFFFFF" strokeWidth="3.2" />
      <path d="M0 0 L24 16 M24 0 L0 16" stroke="#C8102E" strokeWidth="1.6" />
      <rect x="10" width="4" height="16" fill="#FFFFFF" />
      <rect y="6" width="24" height="4" fill="#FFFFFF" />
      <rect x="10.8" width="2.4" height="16" fill="#C8102E" />
      <rect y="6.8" width="24" height="2.4" fill="#C8102E" />
      <rect width="24" height="16" rx="2" fill="none" stroke="rgba(0,0,0,0.08)" />
    </svg>
  );
}

const LOCALE_NAMES = {
  ru: "Русский",
  en: "English",
  es: "Español",
};

function LanguagePicker({ pathname, lang, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const label = LOCALE_NAMES[lang] || "Русский";
  const setOpenSafe = (next) => {
    setOpen(next);
    onOpenChange?.(next);
  };
  return (
    <div className="relative ml-2">
      <button
        type="button"
        onClick={() => setOpenSafe(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-white"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Flag locale={lang} />
        <span className="text-slate-900">{label}</span>
        <svg viewBox="0 0 20 20" className={`size-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} fill="currentColor" aria-hidden>
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 0 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg"
          role="menu"
        >
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={pathForLocale(pathname, l)}
              onClick={() => setOpenSafe(false)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold ${
                l === lang ? "bg-[#7DC931]/10 text-slate-900" : "text-slate-700 hover:bg-black/3"
              }`}
              role="menuitem"
            >
              <Flag locale={l} />
              <span className="flex-1">{LOCALE_NAMES[l] || l.toUpperCase()}</span>
              {l === lang ? <span className="text-[#7DC931]">●</span> : <span className="text-slate-300">○</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function HeaderInner({ pathname, lang = "ru", headerLinks = [], topbarLinks = [], socials = [] }) {
  const ui = getUi(lang);
  const [open, setOpen] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(true);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const phone = useMemo(() => "+34 865 450 175", []);
  const telHref = useMemo(() => "tel:+34865450175", []);

  const fallbackNav = FALLBACK_NAV[lang] || FALLBACK_NAV.ru;
  const fallbackTopbar = FALLBACK_TOPBAR[lang] || FALLBACK_TOPBAR.ru;
  const navLinks = headerLinks.length
    ? headerLinks
    : fallbackNav.map((l) => ({ ...l, href: `/${lang}${l.href === "/" ? "" : l.href}` }));
  const topbar = topbarLinks.length
    ? topbarLinks
    : fallbackTopbar.map((l) => ({ ...l, href: `/${lang}${l.href === "/" ? "" : l.href}` }));
  const homeHref = `/${lang}`;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setTopBarVisible((prev) => {
        if (y <= SCROLL_SHOW_PX) return true;
        if (y >= SCROLL_HIDE_PX) return false;
        return prev;
      });
    };
    if (typeof window === "undefined") return;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (lang && typeof document !== "undefined") {
      document.documentElement.lang = lang === "es" ? "es" : lang === "en" ? "en" : "ru";
    }
  }, [lang]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#e8f4e8]/95 backdrop-blur">
      {/* Top bar */}
      <div
        className={`relative z-10 hidden md:block transition-all duration-300 ease-out ${
          topBarVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        } ${langMenuOpen ? "overflow-visible" : "overflow-hidden"}`}
      >
        <Container className="py-2">
          <div className="flex items-center justify-between gap-6 text-xs text-white/70">
            <div className="flex items-center gap-3">
              {(socials || []).map((s) => {
                const url = s?.url;
                if (!url) return null;
                const platform = s.platform;
                const icon =
                  platform === "facebook" ? (
                    <FacebookIcon />
                  ) : platform === "instagram" ? (
                    <InstagramIcon />
                  ) : (
                    <YouTubeIcon />
                  );
                const aria =
                  platform === "facebook"
                    ? "Facebook"
                    : platform === "instagram"
                      ? "Instagram"
                      : "YouTube";
                return (
                  <a
                    key={platform}
                    className="hover:text-slate-900"
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={aria}
                  >
                    <Icon>{icon}</Icon>
                  </a>
                );
              })}
              <span className="ml-2 h-4 w-px bg-black/10" />
              {topbar.slice(0, 2).map((l) => (
                <Link key={l.href} className="text-slate-600 hover:text-slate-900" href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="ml-2 h-4 w-px bg-black/10" />
              {topbar.slice(2).map((l) => (
                <Link key={l.href} className="text-slate-600 hover:text-slate-900" href={l.href}>
                  {l.label}
                </Link>
              ))}
              <LanguagePicker pathname={pathname} lang={lang} onOpenChange={setLangMenuOpen} />
            </div>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href={homeHref} className="flex items-center shrink-0">
            <Image
              src="/logo.svg"
              alt="MG Group"
              width={110}
              height={49}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-base font-semibold text-slate-600 hover:text-slate-900 hover:bg-black/3"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#7DC931] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6bb428]"
              href={telHref}
            >
              {phone}
            </a>
            <button
              type="button"
              className="lg:hidden inline-flex size-11 items-center justify-center rounded-[5px] border border-[#ff6a3d] bg-[#ff6a3d] text-white shadow-sm hover:bg-[#ff5a2b]"
              aria-label={open ? ui.header.closeMenu : ui.header.openMenu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <BurgerIcon open={open} className="text-white" />
            </button>
          </div>
        </div>
      </Container>

      {open && (
        <div className="lg:hidden border-t border-black/10 bg-[#e8f4e8]">
          <Container className="py-4">
            <a
              href={telHref}
              className="mb-3 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-black/3"
              onClick={() => setOpen(false)}
            >
              <svg
                className="size-4 shrink-0 text-[#ff6a3d]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                />
              </svg>
              {phone}
            </a>
            <div className="flex flex-col gap-0.5">
              <div className="mb-3 flex flex-wrap items-center gap-2 px-4">
                {LOCALES.map((l) => (
                  <Link
                    key={l}
                    href={pathForLocale(pathname, l)}
                    onClick={() => setOpen(false)}
                    className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold ${
                      l === lang
                        ? "bg-[#7DC931] text-white"
                        : "border border-black/10 bg-white text-slate-700 hover:bg-black/3"
                    }`}
                  >
                    <span className="mr-2">
                      <Flag locale={l} />
                    </span>
                    {LOCALE_NAMES[l] || l.toUpperCase()}
                  </Link>
                ))}
              </div>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-slate-700 hover:bg-black/3"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

