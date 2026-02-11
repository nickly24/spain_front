import Link from "next/link";
import { Container } from "../components/Container";
import { HeroSlideshow } from "../components/HeroSlideshow";
import { PropertyCard } from "../components/PropertyCard";
import { getPropertiesByType } from "../lib/properties";

export default function Home() {
  const hot = getPropertiesByType("sale").slice(0, 3);
  return (
    <div>
      <HeroSlideshow />

      {/* Quick navigation */}
      <section className="bg-[#e8f4e8]">
        <Container className="py-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Link
              href="/sale"
              className="group block rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#7DC931]/30 hover:bg-[#7DC931] hover:shadow-lg"
            >
              <div className="text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-white">
                Продажа недвижимости
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600 transition-colors duration-300 group-hover:text-white/90">
                Подборка актуальных объектов с фильтрами по городу, спальням и цене.
              </div>
              <span className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-[#ff6a3d] transition-colors duration-300 group-hover:bg-white group-hover:text-[#7DC931]">
                Открыть каталог →
              </span>
            </Link>

            <Link
              href="/rent"
              className="group block rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#7DC931]/30 hover:bg-[#7DC931] hover:shadow-lg"
            >
              <div className="text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-white">
                Аренда недвижимости
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600 transition-colors duration-300 group-hover:text-white/90">
                Квартиры и дома в аренду. Удобно сравнивать и быстро связаться с нами.
              </div>
              <span className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-[#ff6a3d] transition-colors duration-300 group-hover:bg-white group-hover:text-[#7DC931]">
                Смотреть аренду →
              </span>
            </Link>

            <Link
              href="/construction"
              className="group block rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#7DC931]/30 hover:bg-[#7DC931] hover:shadow-lg"
            >
              <div className="text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-white">
                Строительство и проекты
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600 transition-colors duration-300 group-hover:text-white/90">
                Услуги, реализованные и текущие проекты. От идеи до результата.
              </div>
              <span className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-[#ff6a3d] transition-colors duration-300 group-hover:bg-white group-hover:text-[#7DC931]">
                Перейти в раздел →
              </span>
            </Link>
          </div>
        </Container>
      </section>

      {/* Hot offers */}
      <section className="bg-[#e8f4e8]">
        <Container className="py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Подборка
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                Актуальные объекты
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Несколько вариантов, с которых удобно начать. Полный список — в каталоге.
              </p>
            </div>
            <Link
              href="/sale"
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#ff6a3d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff5a2b]"
            >
              В каталог →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hot.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link
              href="/sale"
              className="inline-flex w-full items-center justify-center rounded-full bg-[#ff6a3d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff5a2b]"
            >
              В каталог →
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
