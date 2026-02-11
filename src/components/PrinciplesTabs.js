"use client";

import { useMemo, useState } from "react";

const BRAND = "#ff6a3d";

export function PrinciplesTabs() {
  const items = useMemo(
    () => [
      {
        id: "transparency",
        label: "Прозрачность",
        title: "Прозрачность процесса",
        text: "Понятные шаги, сроки и ожидания. Мы фиксируем договорённости и держим вас в курсе статуса.",
      },
      {
        id: "practical",
        label: "Практичность",
        title: "Практичность решений",
        text: "Подсказываем то, что реально работает: район, бюджет, цели, ликвидность и удобство в быту.",
      },
      {
        id: "communication",
        label: "Коммуникация",
        title: "Коммуникация без задержек",
        text: "Быстро отвечаем и сопровождаем. Сводим вопросы в понятный план действий, чтобы не было хаоса.",
      },
      {
        id: "details",
        label: "Детали",
        title: "Внимание к деталям",
        text: "Мы не теряем важное: параметры объекта, условия, нюансы. Всё собираем в ясную картину для решения.",
      },
    ],
    []
  );

  const [active, setActive] = useState(items[0].id);
  const current = items.find((i) => i.id === active) || items[0];

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Принципы работы
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((i) => {
          const isActive = i.id === active;
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => setActive(i.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "text-white"
                  : "text-slate-700 hover:bg-black/5 border border-black/10 bg-white"
              }`}
              style={
                isActive
                  ? { backgroundColor: BRAND }
                  : undefined
              }
            >
              {i.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="text-5xl font-semibold tracking-tight text-slate-900">
            {current.label}
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="text-base font-semibold text-slate-900">{current.title}</div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{current.text}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/10 bg-black/3 p-4">
              <div className="text-xs text-slate-500">Формат</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">Без лишнего шума</div>
            </div>
            <div className="rounded-2xl border border-black/10 bg-black/3 p-4">
              <div className="text-xs text-slate-500">Цель</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">Качественный результат</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

