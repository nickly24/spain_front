"use client";

import { useMemo, useState, useEffect } from "react";
import { PropertyCard } from "./PropertyCard";

function clampNumber(value, { min, max }) {
  if (Number.isNaN(value)) return value;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function toNumberOrNull(v) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatThousands(valueDigits) {
  if (!valueDigits) return "";
  const n = Number(valueDigits);
  if (!Number.isFinite(n)) return "";
  return new Intl.NumberFormat("ru-RU").format(n);
}

function digitsOnly(s) {
  return String(s || "").replace(/[^\d]/g, "");
}

export function PropertyCatalog({ properties, mode }) {
  const PAGE_SIZE = 6;

  const cities = useMemo(() => {
    const set = new Set(properties.map((p) => p.city).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ru"));
  }, [properties]);

  const priceKey = mode === "sale" ? "priceEur" : "rentEurPerMonth";
  const priceValues = useMemo(
    () => properties.map((p) => p[priceKey]).filter((v) => typeof v === "number"),
    [properties, priceKey]
  );

  const priceMinDefault = Math.min(...priceValues);
  const priceMaxDefault = Math.max(...priceValues);

  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minPriceRaw, setMinPriceRaw] = useState(String(priceMinDefault));
  const [maxPriceRaw, setMaxPriceRaw] = useState(String(priceMaxDefault));

  const filtered = useMemo(() => {
    const min = toNumberOrNull(minPriceRaw);
    const max = toNumberOrNull(maxPriceRaw);
    const bed = toNumberOrNull(bedrooms);

    return properties.filter((p) => {
      if (city && p.city !== city) return false;

      if (bed !== null) {
        // 4+ спальни — считаем как >=4
        if (bed >= 4) {
          if (p.bedrooms < 4) return false;
        } else {
          if (p.bedrooms !== bed) return false;
        }
      }

      const price = p[priceKey];
      if (typeof price === "number") {
        if (min !== null && price < min) return false;
        if (max !== null && price > max) return false;
      }

      return true;
    });
  }, [properties, city, bedrooms, minPriceRaw, maxPriceRaw, priceKey]);

  const [page, setPage] = useState(1);

  // При смене фильтров возвращаемся на первую страницу
  useEffect(() => {
    setPage(1);
  }, [city, bedrooms, minPriceRaw, maxPriceRaw]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const unit = mode === "sale" ? "€" : "€ / мес";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block">
              <div className="text-xs text-slate-600">Город</div>
              <div className="relative mt-1">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none focus:border-[#ff6a3d]"
                >
                  <option value="">Все города</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <svg
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-500"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 0 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </label>

            <label className="block">
              <div className="text-xs text-slate-600">Кол-во спален</div>
              <div className="relative mt-1">
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none focus:border-[#ff6a3d]"
                >
                  <option value="">Любое</option>
                  <option value="0">Студия</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
                <svg
                  viewBox="0 0 20 20"
                  className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-500"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 0 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </label>

            <label className="block">
              <div className="text-xs text-slate-600">Стоимость ({unit})</div>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    inputMode="numeric"
                    value={formatThousands(minPriceRaw)}
                    onChange={(e) => setMinPriceRaw(digitsOnly(e.target.value))}
                    onBlur={() => {
                      const n = toNumberOrNull(minPriceRaw);
                      if (n === null) return;
                      setMinPriceRaw(
                        String(
                          clampNumber(n, {
                            min: priceMinDefault,
                            max: priceMaxDefault,
                          })
                        )
                      );
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#ff6a3d]"
                    placeholder="от"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                    €
                  </span>
                </div>
                <div className="relative">
                  <input
                    inputMode="numeric"
                    value={formatThousands(maxPriceRaw)}
                    onChange={(e) => setMaxPriceRaw(digitsOnly(e.target.value))}
                    onBlur={() => {
                      const n = toNumberOrNull(maxPriceRaw);
                      if (n === null) return;
                      setMaxPriceRaw(
                        String(
                          clampNumber(n, {
                            min: priceMinDefault,
                            max: priceMaxDefault,
                          })
                        )
                      );
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#ff6a3d]"
                    placeholder="до"
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                    €
                  </span>
                </div>
              </div>
            </label>
          </div>
          <button
            type="button"
            onClick={() => {
              setCity("");
              setBedrooms("");
              setMinPriceRaw(String(priceMinDefault));
              setMaxPriceRaw(String(priceMaxDefault));
            }}
            className="shrink-0 rounded-full border border-black/10 bg-black/3 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-black/5 sm:ml-2"
          >
            Сбросить
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-slate-600">
          Найдено{" "}
          <span className="font-semibold text-[#ff6a3d]">{filtered.length}</span>
        </span>
        {totalPages > 1 && (
          <span className="text-sm text-slate-600">
            Страница{" "}
            <span className="font-semibold text-slate-900">{currentPage}</span>
            {" из "}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              className={`min-w-9 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                n === currentPage
                  ? "bg-[#ff6a3d] text-white"
                  : "bg-white text-slate-700 border border-black/10 hover:bg-black/3"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

