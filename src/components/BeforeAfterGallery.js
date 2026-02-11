"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

export function BeforeAfterGallery({ cases }) {
  const safeCases = useMemo(
    () => (Array.isArray(cases) && cases.length ? cases : []),
    [cases]
  );
  const [idx, setIdx] = useState(0);

  if (!safeCases.length) return null;

  const c = safeCases[idx];
  const canPrev = idx > 0;
  const canNext = idx < safeCases.length - 1;

  return (
    <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Кейсы
          </div>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            Примеры работ «до/после»
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Один кейс на экране: слева «до», справа «после». Ниже — что было и что
            сделали. Переключайте стрелками.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-base font-semibold text-slate-900">{c.title}</div>
          <div className="text-sm text-slate-500">
            {idx + 1} / {safeCases.length}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-slate-50">
            <div className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
              До
            </div>
            <div className="relative aspect-16/10">
              <Image
                src={c.beforeSrc}
                alt={`${c.title} — до`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 520px, 100vw"
              />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-slate-50">
            <div className="absolute left-4 top-4 z-10 rounded-full bg-[#ff6a3d] px-3 py-1 text-xs font-semibold text-white">
              После
            </div>
            <div className="relative aspect-16/10">
              <Image
                src={c.afterSrc}
                alt={`${c.title} — после`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 520px, 100vw"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Что было
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
              {c.was.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Что сделали
            </div>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-slate-700">
              {c.done.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => canPrev && setIdx((v) => v - 1)}
            disabled={!canPrev}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-40"
            aria-label="Предыдущий пример"
          >
            <svg viewBox="0 0 20 20" className="size-5 fill-current" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.78 15.53a.75.75 0 0 1-1.06 0l-5-5a.75.75 0 0 1 0-1.06l5-5a.75.75 0 1 1 1.06 1.06L8.31 10l4.47 4.47a.75.75 0 0 1 0 1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {safeCases.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === idx ? "bg-[#ff6a3d]" : "bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Открыть пример ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => canNext && setIdx((v) => v + 1)}
            disabled={!canNext}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-40"
            aria-label="Следующий пример"
          >
            <svg viewBox="0 0 20 20" className="size-5 fill-current" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M7.22 4.47a.75.75 0 0 1 1.06 0l5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06L11.69 10 7.22 5.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

