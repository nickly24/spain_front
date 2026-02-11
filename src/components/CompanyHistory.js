"use client";

import { useMemo, useState } from "react";

const BRAND = "#FF5A2B";

export function CompanyHistory() {
  const items = useMemo(
    () => [
      {
        year: 2016,
        title: "Начало пути",
        text: "Запуск направления недвижимости в Испании. Формирование первых партнёрств и процессов подбора объектов.",
      },
      {
        year: 2019,
        title: "Рост каталога",
        text: "Расширение географии и портфеля объектов. Упор на удобный отбор по городу, спальням и стоимости.",
      },
      {
        year: 2022,
        title: "Проекты и строительство",
        text: "Запуск проектного направления: ремонт, реконструкция и задачи «под ключ» с понятными этапами.",
      },
      {
        year: 2024,
        title: "Системный сервис",
        text: "Фокус на стандартах качества, скорости коммуникации и прозрачной логике сопровождения для клиентов.",
      },
    ],
    []
  );

  const [active, setActive] = useState(items[0].year);
  const current = items.find((i) => i.year === active) || items[0];

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        История компании
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

          <div className="mt-8 border-t border-black/10 pt-6">
            <div className="text-sm font-semibold text-slate-900">
              Социальная ответственность
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              В проектах мы ориентируемся на качество среды: удобные планировки,
              безопасность, инфраструктуру и долговечные решения.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

