"use client";

import { useMemo, useState, useEffect } from "react";
import { PropertyCard } from "./PropertyCard";
import { getIntlLocale, getUi, formatInt } from "../lib/ui";

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

function formatThousands(valueDigits, lang) {
  if (!valueDigits) return "";
  const n = Number(valueDigits);
  if (!Number.isFinite(n)) return "";
  return formatInt(n, lang);
}

function digitsOnly(s) {
  return String(s || "").replace(/[^\d]/g, "");
}

export function PropertyCatalog({ properties, mode, basePath = "", lang = "ru" }) {
  const PAGE_SIZE = 6;
  const ui = getUi(lang);

  const cities = useMemo(() => {
    const seen = new Map();
    for (const p of properties) {
      const key = p.cityKey || p.city || "";
      const label = p.cityLabel || p.city || "";
      if (!key || !label) continue;
      if (!seen.has(key)) seen.set(key, label);
    }
    const locale = getIntlLocale(lang);
    return Array.from(seen.entries())
      .map(([key, label]) => ({ key, label }))
      .sort((a, b) => a.label.localeCompare(b.label, locale));
  }, [properties, lang]);

  const priceKey = mode === "sale" ? "priceEur" : "rentEurPerMonth";
  const priceValues = useMemo(
    () => properties.map((p) => p[priceKey]).filter((v) => typeof v === "number"),
    [properties, priceKey]
  );

  const priceMinDefault = Math.min(...priceValues);
  const priceMaxDefault = Math.max(...priceValues);

  const [cityKey, setCityKey] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minPriceRaw, setMinPriceRaw] = useState(String(priceMinDefault));
  const [maxPriceRaw, setMaxPriceRaw] = useState(String(priceMaxDefault));

  const filtered = useMemo(() => {
    const min = toNumberOrNull(minPriceRaw);
    const max = toNumberOrNull(maxPriceRaw);
    const bed = toNumberOrNull(bedrooms);

    return properties.filter((p) => {
      if (cityKey && (p.cityKey || p.city) !== cityKey) return false;

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
  }, [properties, cityKey, bedrooms, minPriceRaw, maxPriceRaw, priceKey]);

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const unit = mode === "sale" ? "€" : `€ ${ui.catalog.rentSuffix}`;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="block">
              <div className="text-xs text-slate-600">{ui.catalog.city}</div>
              <div className="relative mt-1">
                <select
                  value={cityKey}
                  onChange={(e) => {
                    setCityKey(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none focus:border-mg-teal"
                >
                  <option value="">{ui.catalog.allCities}</option>
                  {cities.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
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
              <div className="text-xs text-slate-600">{ui.catalog.bedrooms}</div>
              <div className="relative mt-1">
                <select
                  value={bedrooms}
                  onChange={(e) => {
                    setBedrooms(e.target.value);
                    setPage(1);
                  }}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 outline-none focus:border-mg-teal"
                >
                  <option value="">{ui.catalog.any}</option>
                  <option value="0">{ui.catalog.studio}</option>
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
              <div className="text-xs text-slate-600">
                {ui.catalog.price} ({unit})
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    inputMode="numeric"
                    value={formatThousands(minPriceRaw, lang)}
                    onChange={(e) => {
                      setMinPriceRaw(digitsOnly(e.target.value));
                      setPage(1);
                    }}
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
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-mg-teal"
                    placeholder={ui.catalog.from}
                  />
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                    €
                  </span>
                </div>
                <div className="relative">
                  <input
                    inputMode="numeric"
                    value={formatThousands(maxPriceRaw, lang)}
                    onChange={(e) => {
                      setMaxPriceRaw(digitsOnly(e.target.value));
                      setPage(1);
                    }}
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
                      setPage(1);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-mg-teal"
                    placeholder={ui.catalog.to}
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
              setCityKey("");
              setBedrooms("");
              setMinPriceRaw(String(priceMinDefault));
              setMaxPriceRaw(String(priceMaxDefault));
              setPage(1);
            }}
            className="shrink-0 rounded-full border border-black/10 bg-black/3 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-black/5 sm:ml-2"
          >
            {ui.catalog.reset}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-slate-600">
          {ui.catalog.found}{" "}
          <span className="font-semibold text-mg-gold">{filtered.length}</span>
        </span>
        {totalPages > 1 && (
          <span className="text-sm text-slate-600">
            {ui.catalog.page}{" "}
            <span className="font-semibold text-slate-900">{currentPage}</span>
            {` ${ui.catalog.of} `}
            <span className="font-semibold text-slate-900">{totalPages}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((p) => (
          <PropertyCard key={p.id} property={p} basePath={basePath} lang={lang} />
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
                  ? "bg-mg-gold text-mg-ink"
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

