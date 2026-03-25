"use client";

import { useMemo, useState } from "react";

const BRAND = "#086b5e";

export function CompanyHistory({ lang = "ru" }) {
  const T = {
    ru: {
      label: "История компании",
      items: [
        {
          year: 2018,
          title: "Два самостоятельных направления",
          text: "С 2018 года формировались и развивались два самостоятельных направления: Marescol Properties — агентство недвижимости, специализирующееся на операциях купли-продажи на побережье Costa Blanca, и Guru Construction — строительная и дизайн-компания, реализующая проекты ремонта и интерьеров любой сложности.",
        },
        {
          year: 2025,
          title: "Единая структура MG Group",
          text: "В 2025 году эти направления были объединены, что привело к созданию MG Group как единой структуры, способной предоставлять комплексные решения в сфере недвижимости.",
        },
      ],
    },
    en: {
      label: "Company history",
      items: [
        {
          year: 2018,
          title: "Two independent lines of business",
          text: "From 2018, two independent directions emerged and grew: Marescol Properties — a real estate agency focused on buy–sell transactions on the Costa Blanca, and Guru Construction — a construction and design company delivering renovation and interior projects of any complexity.",
        },
        {
          year: 2025,
          title: "MG Group as one company",
          text: "In 2025 these lines were brought together, creating MG Group as a single structure able to offer comprehensive real estate solutions end to end.",
        },
      ],
    },
    es: {
      label: "Historia de la empresa",
      items: [
        {
          year: 2018,
          title: "Dos líneas independientes",
          text: "Desde 2018 se fueron formando y desarrollando dos direcciones independientes: Marescol Properties — agencia inmobiliaria especializada en compraventa en la Costa Blanca, y Guru Construction — empresa de construcción y diseño que ejecuta proyectos de reforma e interiorismo de cualquier complejidad.",
        },
        {
          year: 2025,
          title: "Unificación en MG Group",
          text: "En 2025 estas direcciones se unieron, dando lugar a MG Group como estructura única capaz de ofrecer soluciones integrales en el sector inmobiliario.",
        },
      ],
    },
  };

  const t = T[lang] || T.ru;
  const items = useMemo(() => t.items, [t.items]);

  const [active, setActive] = useState(items[0].year);
  const current = items.find((i) => i.year === active) || items[0];

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {t.label}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((i) => {
          const isActive = i.year === active;
          return (
            <button
              key={i.year}
              type="button"
              onClick={() => setActive(i.year)}
              className="rounded-full px-4 py-2 text-sm font-semibold"
              style={
                isActive
                  ? { backgroundColor: BRAND, color: "white" }
                  : {
                      backgroundColor: "#f3f4f6",
                      color: "#0f172a",
                      border: "1px solid rgba(0,0,0,0.06)",
                    }
              }
            >
              {i.year}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-6">
          <div className="text-[72px] font-semibold leading-none tracking-tight text-slate-900 sm:text-[96px]">
            {current.year}
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="text-sm font-semibold text-slate-900">{current.title}</div>
          <p className="mt-2 text-sm leading-7 text-slate-600">{current.text}</p>
        </div>
      </div>
    </section>
  );
}

