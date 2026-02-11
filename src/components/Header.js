"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { Container } from "./Container";
import Image from "next/image";

/** Порог вниз: скрыть верхнюю полосу при scrollY >= это значение */
const SCROLL_HIDE_PX = 100;
/** Порог вверх: показать полосу при scrollY <= это значение. Гистерезис убирает дёрганье у границы */
const SCROLL_SHOW_PX = 40;

const NAV_LINKS = [
  { href: "/sale", label: "Продажа" },
  { href: "/rent", label: "Аренда" },
  { href: "/construction", label: "Строительство" },
  { href: "/about", label: "О компании" },
  { href: "/news", label: "Новости и статьи" },
  { href: "/contacts", label: "Контакты" },
];

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

export function Header() {
  const [open, setOpen] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(true);

  const phone = useMemo(() => "+34 865 450 175", []);
  const telHref = useMemo(() => "tel:+34865450175", []);

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

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#e8f4e8]/95 backdrop-blur">
      {/* Top bar — схлопывается при скролле вниз, появляется у верхушки */}
      <div
        className={`hidden md:block overflow-hidden transition-all duration-300 ease-out ${
          topBarVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Container className="py-2">
          <div className="flex items-center justify-between gap-6 text-xs text-white/70">
            <div className="flex items-center gap-3">
              <a className="hover:text-slate-900" href="#" aria-label="Facebook">
                <Icon>
                  <svg viewBox="0 0 24 24" className="size-4 fill-current">
                    <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5H16.8V5.1c-.3 0-1.2-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7.7v3h2.7v8h3.1Z" />
                  </svg>
                </Icon>
              </a>
              <a className="hover:text-slate-900" href="#" aria-label="Instagram">
                <Icon>
                  <svg viewBox="0 0 24 24" className="size-4 fill-current">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3Zm-5 4.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5Zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5ZM18 6.7a1.3 1.3 0 1 1-1.3 1.3A1.3 1.3 0 0 1 18 6.7Z" />
                  </svg>
                </Icon>
              </a>
              <a className="hover:text-slate-900" href="#" aria-label="YouTube">
                <Icon>
                  <svg viewBox="0 0 24 24" className="size-4 fill-current">
                    <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31.3 31.3 0 0 0 2 12a31.3 31.3 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 22 12a31.3 31.3 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
                  </svg>
                </Icon>
              </a>

              <span className="ml-2 h-4 w-px bg-black/10" />
              <Link className="text-slate-600 hover:text-slate-900" href="/partners">
                Партнёрам
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/sale">
                Продажа с MG Group
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <a className="text-slate-600 hover:text-slate-900" href={telHref}>
                {phone}
              </a>
              <Link
                href="/contacts"
                className="rounded-full bg-[#ff6a3d] px-3 py-1.5 font-semibold text-white hover:bg-[#ff5a2b]"
              >
                Позвоните мне
              </Link>
              <span className="ml-2 h-4 w-px bg-black/10" />
              <Link className="text-slate-600 hover:text-slate-900" href="/news">
                Новости
              </Link>
              <Link className="text-slate-600 hover:text-slate-900" href="/about">
                О компании
              </Link>
              <span className="ml-2 rounded-full border border-black/10 bg-black/3 px-2 py-1 text-[11px] text-slate-600">
                RU
              </span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <Container className="py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
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
            {NAV_LINKS.map((l) => (
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
              className="hidden sm:inline-flex items-center justify-center rounded-full border border-black/10 bg-black/3 px-4 py-2 text-sm text-slate-700 hover:bg-black/5"
              href={telHref}
            >
              {phone}
            </a>

            <button
              type="button"
              className="lg:hidden inline-flex size-10 items-center justify-center rounded-full border border-black/10 bg-black/3 text-slate-700 hover:bg-black/5"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <BurgerIcon open={open} className="text-slate-700" />
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-black/10 bg-[#e8f4e8]">
          <Container className="py-4">
            <a
              href={telHref}
              className="mb-3 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-black/3"
              onClick={() => setOpen(false)}
            >
              <svg className="size-4 shrink-0 text-[#ff6a3d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {phone}
            </a>
            <div className="flex flex-col gap-0.5">
              {NAV_LINKS.map((l) => (
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

