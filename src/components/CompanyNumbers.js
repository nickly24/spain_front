"use client";

const BRAND = "#FF5A2B";

function Chart() {
  // Простая декоративная «линия роста» + столбики как в референсе
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0.35" />
          <stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <g opacity="0.45">
        <rect x="36" y="120" width="48" height="86" rx="10" fill="url(#fade)" />
        <rect x="112" y="95" width="48" height="111" rx="10" fill="url(#fade)" />
        <rect x="188" y="72" width="48" height="134" rx="10" fill="url(#fade)" />
        <rect x="264" y="52" width="28" height="154" rx="10" fill="url(#fade)" />
      </g>
      <path
        d="M40 126 C80 120, 110 116, 140 98 C170 80, 205 92, 235 70 C265 48, 285 36, 300 28"
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M287 30 L305 24 L297 42"
        fill="none"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CompanyNumbers({ lang = "ru" }) {
  const T = {
    ru: {
      label: "MG Group в цифрах",
      title: "Показатели и масштаб",
      growthTitle: "Рост проектов",
      growthText: "Визуальная заглушка под реальную статистику.",
      note: "Цифры и подписи уточним после согласования.",
      stats: [
        { big: "37 млн м²", small: "жилья введено в эксплуатацию (пример)" },
        { big: "650 тыс.", small: "клиентов/жителей (пример)" },
        { big: "170+ объектов", small: "в портфеле проектов (пример)" },
        { big: "30+ специалистов", small: "в команде и партнёрской сети (пример)" },
      ],
    },
    en: {
      label: "MG Group in numbers",
      title: "Key metrics",
      growthTitle: "Project growth",
      growthText: "Placeholder for real statistics.",
      note: "Numbers and captions will be finalized after approval.",
      stats: [
        { big: "37M m²", small: "commissioned housing (example)" },
        { big: "650K", small: "clients/residents (example)" },
        { big: "170+ listings", small: "in project portfolio (example)" },
        { big: "30+ specialists", small: "team and partner network (example)" },
      ],
    },
    es: {
      label: "MG Group en cifras",
      title: "Indicadores",
      growthTitle: "Crecimiento de proyectos",
      growthText: "Marcador de posición para estadísticas reales.",
      note: "Las cifras y los textos se concretarán tras la aprobación.",
      stats: [
        { big: "37M m²", small: "vivienda puesta en servicio (ejemplo)" },
        { big: "650K", small: "clientes/residentes (ejemplo)" },
        { big: "170+ inmuebles", small: "en la cartera (ejemplo)" },
        { big: "30+ especialistas", small: "equipo y red de socios (ejemplo)" },
      ],
    },
  };
  const t = T[lang] || T.ru;
  const stats = t.stats;

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {t.label}
      </div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
        {t.title}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Большая оранжевая карточка с графиком */}
        <div
          className="relative overflow-hidden rounded-3xl p-6 text-white lg:col-span-5"
          style={{ backgroundColor: BRAND }}
        >
          <div className="text-lg font-semibold">{t.growthTitle}</div>
          <div className="mt-1 text-sm text-white/85">
            {t.growthText}
          </div>

          <div className="mt-6 aspect-4/3 w-full">
            <Chart />
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-white/85">
            <span>80</span>
            <span>120</span>
            <span>150</span>
          </div>
          <div className="mt-3 text-xs text-white/80">
            {t.note}
          </div>
        </div>

        {/* Остальные карточки как в референсе */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {stats.map((s) => (
              <div
                key={s.big}
                className="rounded-3xl border border-black/10 bg-[#f3f4f6] p-6"
              >
                <div className="text-2xl font-semibold text-slate-900">{s.big}</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">{s.small}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

