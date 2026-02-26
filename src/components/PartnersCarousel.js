"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

function sig(n, digits = 6) {
  const num = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(num)) return "0";
  // Приводим к одинаковой строке для SSR/CSR (устраняет hydration mismatch)
  // Пример: 0.2583030323 -> "0.258303"
  const s = num.toPrecision(digits);
  return String(Number(s)); // убирает хвостовые нули
}

function repeatToMin(items, minLen) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  if (list.length >= minLen) return list;
  if (!list.length) return [];
  const out = [];
  while (out.length < minLen) out.push(...list);
  return out.slice(0, minLen);
}

export function PartnersCarousel({ partners }) {
  const items = useMemo(() => repeatToMin(partners, 10), [partners]);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const phaseRef = useRef(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!items.length) return;

    function tick(ts) {
      if (!lastRef.current) lastRef.current = ts;
      const dt = Math.min(40, ts - lastRef.current);
      lastRef.current = ts;

      // скорость вращения (в радианах/мс)
      // скорость вращения (в радианах/мс)
      // намеренно медленно: “витрина партнёров”, а не спиннер
      phaseRef.current += dt * 0.00002;

      // обновляем не чаще ~30fps
      if (ts % 33 < 16) {
        setPhase(phaseRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [items.length]);

  if (!items.length) return null;

  const count = items.length;
  const step = (Math.PI * 2) / count;
  const radiusX = 420; // шире «рамка» и сильнее выпуклость
  const radiusZ = 1;

  return (
    <div className="relative h-[160px] w-full overflow-hidden">
      {/* мягкая виньетка по бокам */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-[#e8f4e8] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#e8f4e8] to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-[136px] w-full max-w-[1240px]">
          {items.map((p, i) => {
            const a = phase + i * step;
            const x = Math.sin(a) * radiusX;
            const z = Math.cos(a) * radiusZ; // -1..1

            const t = (z + 1) / 2; // 0..1
            const scale = 0.55 + t * 0.6; // 0.55..1.15
            const opacity = 0.18 + t * 0.82;
            const blur = (1 - t) * 1.1;
            const y = (1 - t) * 10;
            const zIndex = Math.round(t * 1000);

            const style = {
              transform: `translateX(${sig(x)}px) translateY(${sig(y)}px) scale(${sig(scale)})`,
              opacity: sig(opacity),
              filter: blur ? `blur(${sig(blur)}px)` : undefined,
              zIndex: String(zIndex),
            };

            const content = (
              <div
                className={cn(
                  "flex h-[84px] w-[220px] items-center justify-center rounded-2xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.08)]",
                  "transition-[transform,opacity,filter] duration-200"
                )}
              >
                <img
                  src={p.logoUrl}
                  alt={p.name || "Партнёр"}
                  className="max-h-[46px] max-w-[170px] object-contain"
                  loading="lazy"
                />
              </div>
            );

            return (
              <div
                key={`${p.id}-${i}`}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={style}
              >
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="outline-none focus-visible:ring-2 focus-visible:ring-black/20 rounded-2xl"
                    aria-label={p.name ? `Партнёр: ${p.name}` : "Партнёр"}
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

