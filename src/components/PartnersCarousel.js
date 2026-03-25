"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function repeatToFill(items, minLen) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!list.length) return [];
  if (list.length >= minLen) return list;
  const out = [];
  while (out.length < minLen) out.push(...list);
  return out.slice(0, minLen);
}

function chunk(items, size) {
  const arr = Array.isArray(items) ? items : [];
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const CARD_W = 200;
const GAP = 28;
const SLOT = CARD_W + GAP;
const SPEED = 0.035;

function LogoCard({ partner }) {
  const inner = (
    <div className="flex h-[84px] w-[200px] items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
      <img
        src={partner.logoUrl}
        alt={partner.name || "Партнёр"}
        className="h-full w-full object-contain"
        loading="lazy"
      />
    </div>
  );

  if (partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noreferrer"
        className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-black/20"
        aria-label={partner.name ? `Партнёр: ${partner.name}` : "Партнёр"}
      >
        {inner}
      </a>
    );
  }
  return inner;
}

export function PartnersCarousel({ partners }) {
  const baseItems = useMemo(
    () => (Array.isArray(partners) ? partners.filter(Boolean) : []),
    [partners],
  );

  const [mobilePage, setMobilePage] = useState(0);
  const touchStartXRef = useRef(null);
  const stripRef = useRef(null);

  const minForViewport = Math.ceil(1600 / SLOT) + 1;
  const singleStrip = useMemo(
    () => repeatToFill(baseItems, minForViewport),
    [baseItems, minForViewport],
  );
  const stripPx = singleStrip.length * SLOT;

  useEffect(() => {
    if (!singleStrip.length || !stripPx) return;

    let offset = 0;
    let last = 0;
    let raf = 0;

    function tick(ts) {
      if (!last) last = ts;
      const dt = Math.min(40, ts - last);
      last = ts;
      offset = (offset + dt * SPEED) % stripPx;
      if (stripRef.current) {
        stripRef.current.style.transform = `translateX(-${offset}px)`;
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [singleStrip.length, stripPx]);

  if (!baseItems.length) return null;

  const pages = chunk(baseItems, 4);
  const pageCount = pages.length || 1;

  const displayItems = [...singleStrip, ...singleStrip];

  return (
    <>
      {/* Mobile: swipeable 2×2 grid pages */}
      <div className="md:hidden">
        <div
          className="relative overflow-hidden"
          role="region"
          aria-label="Партнёры — галерея"
          onTouchStart={(e) => {
            const x = e.touches?.[0]?.clientX;
            touchStartXRef.current = typeof x === "number" ? x : null;
          }}
          onTouchEnd={(e) => {
            const startX = touchStartXRef.current;
            touchStartXRef.current = null;
            if (typeof startX !== "number") return;
            const endX = e.changedTouches?.[0]?.clientX;
            if (typeof endX !== "number") return;
            const dx = endX - startX;
            const threshold = 40;
            if (dx > threshold) {
              setMobilePage((p) => Math.max(0, p - 1));
            } else if (dx < -threshold) {
              setMobilePage((p) => Math.min(pageCount - 1, p + 1));
            }
          }}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${mobilePage * 100}%)` }}
          >
            {pages.map((page, pageIdx) => (
              <div key={pageIdx} className="w-full shrink-0">
                <div className="grid grid-cols-2 gap-3">
                  {page.map((p) => (
                    <div key={p.id}>
                      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
                        <img
                          src={p.logoUrl}
                          alt={p.name || "Партнёр"}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {pageCount > 1 ? (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {Array.from({ length: pageCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMobilePage(i)}
                className="rounded-full p-1"
                aria-label={`Страница ${i + 1} из ${pageCount}`}
                aria-current={i === mobilePage ? "true" : undefined}
              >
                <span
                  className={`block h-1.5 w-1.5 rounded-full ${
                    i === mobilePage ? "bg-slate-900" : "bg-slate-400/50"
                  }`}
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Desktop: infinite conveyor belt with ring-like depth at edges */}
      <div className="relative hidden h-[120px] w-full overflow-hidden md:block">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-36 bg-linear-to-r from-mg-mint via-mg-mint/70 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-36 bg-linear-to-l from-mg-mint via-mg-mint/70 to-transparent" />

        <div className="flex h-full items-center">
          <div ref={stripRef} className="flex items-center will-change-transform">
            {displayItems.map((p, i) => (
              <div
                key={`${p.id}-d-${i}`}
                className="shrink-0"
                style={{ width: CARD_W, marginRight: GAP }}
              >
                <LogoCard partner={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
