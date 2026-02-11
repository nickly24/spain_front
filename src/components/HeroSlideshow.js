"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { useState, useEffect } from "react";

const SLIDES = [
  {
    id: "sale",
    label: "Продажа",
    subtitle:
      "Подборка объектов для покупки. Используйте фильтры по городу, количеству спален и стоимости — чтобы быстрее найти подходящий вариант.",
    sectionHref: "/sale",
  },
  {
    id: "rent",
    label: "Аренда",
    subtitle:
      "Квартиры и дома в аренду. Удобно сравнивать по параметрам и быстро связаться с нами для просмотра.",
    sectionHref: "/rent",
  },
  {
    id: "construction",
    label: "Строительство",
    subtitle:
      "Проектирование, строительство и реконструкция. От идеи до результата — с понятными этапами и контролем качества.",
    sectionHref: "/construction",
  },
];

const INTERVAL_MS = 7500;
const TEL_HREF = "tel:+34865450175";

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/photos/poster.png"
          alt="MG Group — недвижимость в Испании"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-[#07090c]" />
      </div>

      {/* Три точки справа, по вертикали по центру (сверху вниз) */}
      <div className="absolute right-6 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-1.5 lg:right-10">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            className="rounded-full p-1 transition-colors hover:opacity-80"
            aria-label={`Слайд: ${s.label}`}
            aria-current={i === index ? "true" : undefined}
          >
            <span
              className={`block size-1.5 rounded-full transition-colors ${
                i === index ? "bg-[#7DC931]" : "bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-3xl">
            {/* Плашка: Продажа • Аренда • Строительство — активный зелёным */}
            <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80">
              {SLIDES.map((s, i) => (
                <span key={s.id} className="inline-flex items-center gap-1.5">
                  {i > 0 && <span className="text-white/50">•</span>}
                  <span
                    className={
                      i === index
                        ? "font-semibold text-[#7DC931]"
                        : ""
                    }
                  >
                    {s.label}
                  </span>
                </span>
              ))}
              <span className="text-white/50">—</span>
              <span>Испания</span>
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Недвижимость в Испании
              <br className="hidden sm:block" />
              с подбором под ваш запрос
            </h1>

            {/* Текст слайда — плавное исчезновение предыдущего и появление следующего */}
            <div className="relative mt-5 min-h-[4.5rem] sm:min-h-20">
              {SLIDES.map((s, i) => (
                <p
                  key={s.id}
                  className="absolute inset-0 max-w-2xl text-base leading-7 text-white/80 sm:text-lg transition-[opacity,transform] duration-1000 ease-in-out"
                  style={{
                    opacity: i === index ? 1 : 0,
                    transform: i === index ? "translateY(0)" : "translateY(6px)",
                    pointerEvents: i === index ? "auto" : "none",
                  }}
                >
                  {s.subtitle}
                </p>
              ))}
            </div>

            {/* Две кнопки для любого раздела: Перейти в раздел + Позвонить */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={SLIDES[index].sectionHref}
                className="inline-flex items-center justify-center rounded-full bg-[#ff6a3d] px-6 py-3 text-sm font-semibold text-white hover:bg-[#ff5a2b]"
              >
                Перейти в раздел
              </Link>
              <a
                href={TEL_HREF}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Позвонить
              </a>
            </div>
          </div>
      </Container>
    </section>
  );
}
