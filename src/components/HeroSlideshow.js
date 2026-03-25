"use client";

import Image from "next/image";
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

export function HeroSlideshow({ content = {} }) {
  const [index, setIndex] = useState(0);

  const slideContent = SLIDES.map((s) => {
    const labelKey = `home.hero.${s.id}.label`;
    const subtitleKey = `home.hero.${s.id}.subtitle`;
    return {
      ...s,
      label: content[labelKey] || s.label,
      subtitle: content[subtitleKey] || s.subtitle,
    };
  });

  const activeSlide = slideContent[index] || slideContent[0] || SLIDES[0];

  const titleLine1 =
    content["home.hero.title.line1"] || "Недвижимость в Испании";
  const titleLine2 =
    content["home.hero.title.line2"] || "с подбором под ваш запрос";

  const mainCta = content["home.hero.mainCta"] || "Перейти в раздел";
  const callCta = content["home.hero.callCta"] || "Позвонить";

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % slideContent.length);
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [slideContent.length]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/photos/poster.jpg"
          alt="MG Group — недвижимость в Испании"
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/55 to-[#07090c]" />
      </div>

      {/* Три точки справа (как было) — только на десктопе */}
      <div className="hidden lg:flex absolute right-10 top-1/2 z-10 -translate-y-1/2 flex-col items-center gap-1.5">
        {slideContent.map((s, i) => (
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
                i === index ? "bg-mg-teal" : "bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>

      <Container className="relative py-16 sm:py-20 lg:py-28">
        <div className="max-w-3xl">
            {/* Плашка: Продажа • Аренда • Строительство — активный зелёным */}
            <div className="inline-flex items-center gap-x-1.5 gap-y-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] text-white/80 sm:px-4 sm:py-2 sm:text-xs whitespace-nowrap">
              {slideContent.map((s, i) => (
                <span key={s.id} className="inline-flex items-center gap-1.5">
                  {i > 0 && <span className="text-white/50">•</span>}
                  <span
                    className={
                      i === index
                        ? "font-semibold text-mg-teal"
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
              {titleLine1}{" "}
              <span className="block sm:inline">{titleLine2}</span>
            </h1>

            {/* Текст слайда: на мобиле без абсолютов (чтобы не налезало на кнопки) */}
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:hidden">
              {activeSlide.subtitle}
            </p>

            {/* Десктоп/планшет: плавное исчезновение предыдущего и появление следующего */}
            <div className="relative mt-5 hidden sm:block min-h-20">
              {slideContent.map((s, i) => (
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
              <a
                href={activeSlide.sectionHref}
                className="inline-flex items-center justify-center rounded-full bg-mg-gold px-6 py-3 text-sm font-semibold text-mg-ink hover:bg-mg-gold-hover"
              >
                {mainCta}
              </a>
              <a
                href={TEL_HREF}
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                {callCta}
              </a>
            </div>

            {/* Точки снизу (мобилка): под кнопками, в самом низу */}
            <div className="mt-6 flex justify-center gap-2 lg:hidden">
              {slideContent.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className="rounded-full p-1.5 transition-opacity hover:opacity-80"
                  aria-label={`Слайд: ${s.label}`}
                  aria-current={i === index ? "true" : undefined}
                >
                  <span
                    className={`block h-2 w-2 rounded-full transition-colors ${
                      i === index ? "bg-mg-teal" : "bg-white/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
      </Container>
    </section>
  );
}
