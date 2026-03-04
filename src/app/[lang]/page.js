import { Container } from "../../components/Container";
import { HeroSlideshow } from "../../components/HeroSlideshow";
import { PropertyCard } from "../../components/PropertyCard";
import { prisma } from "../../lib/prisma";
import { getLocaleFromParams } from "../../lib/i18n";
import { getPageMeta } from "../../lib/page-meta";
import { getUi } from "../../lib/ui";
import { getPropertyTagLabels } from "../../lib/tags";
import { getCityKeyFromProperty, getCityLabelFromProperty } from "../../lib/cities";

export async function generateMetadata({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const ui = getUi(lang);
  const meta = await getPageMeta("home", lang);
  const title = meta?.seoTitle ?? meta?.title ?? ui.meta.homeDefault;
  const description = meta?.seoDescription ?? undefined;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default async function Home({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const localesForTag = lang === "ru" ? ["ru"] : ["ru", lang];

  const [hot, page, snippets] = await Promise.all([
    prisma.property.findMany({
      where: { status: "published", listingType: "sale" },
      include: {
        images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }] },
        tags: {
          orderBy: [{ sortOrder: "asc" }, { tagId: "asc" }],
          include: {
            tag: {
              include: {
                translations: { where: { locale: { in: localesForTag } } },
              },
            },
          },
        },
        cityRel: {
          include: {
            translations: { where: { locale: { in: ["ru", lang] } } },
          },
        },
      },
      orderBy: { id: "asc" },
      take: 3,
    }),
    prisma.page.findUnique({ where: { slug: "home" } }),
    prisma.pageContent.findMany({
      where: { pageSlug: "home", locale: lang },
    }),
  ]);

  const propIds = hot.map((p) => p.id);
  const transList =
    lang !== "ru" && propIds.length > 0
      ? await prisma.propertyTranslation.findMany({
          where: { locale: lang, propertyId: { in: propIds } },
        })
      : [];
  const transByProp = new Map(transList.map((t) => [t.propertyId, t]));
  const hotWithLocale = hot.map((p) => {
    const tr = transByProp.get(p.id);
    const baseProp = tr ? { ...p, title: tr.title, description: tr.description } : p;
    return {
      ...baseProp,
      badgesLocalized: getPropertyTagLabels(baseProp, lang),
      cityLabel: getCityLabelFromProperty(baseProp, lang),
      cityKey: getCityKeyFromProperty(baseProp),
    };
  });

  const contentMap = new Map(
    (snippets || []).map((s) => [s.key, s.value])
  );
  const contentObject = Object.fromEntries(contentMap);

  const base = `/${lang}`;
  const hotBadge = contentMap.get("home.hot.badge") || "Подборка";
  const hotTitle = contentMap.get("home.hot.title") || "Актуальные объекты";
  const hotDescription =
    contentMap.get("home.hot.description") ||
    contentMap.get("__page_content__") ||
    page?.content ||
    "Несколько вариантов, с которых удобно начать. Полный список — в каталоге.";
  const hotCta = contentMap.get("home.hot.cta") || "В каталог →";

  const quickSaleTitle =
    contentMap.get("home.quick.sale.title") || "Продажа недвижимости";
  const quickSaleText =
    contentMap.get("home.quick.sale.text") ||
    "Подборка актуальных объектов с фильтрами по городу, спальням и цене.";
  const quickSaleCta =
    contentMap.get("home.quick.sale.cta") || "Открыть каталог →";

  const quickRentTitle =
    contentMap.get("home.quick.rent.title") || "Аренда недвижимости";
  const quickRentText =
    contentMap.get("home.quick.rent.text") ||
    "Квартиры и дома в аренду. Удобно сравнивать и быстро связаться с нами.";
  const quickRentCta =
    contentMap.get("home.quick.rent.cta") || "Смотреть аренду →";

  const quickConstructionTitle =
    contentMap.get("home.quick.construction.title") || "Строительство и проекты";
  const quickConstructionText =
    contentMap.get("home.quick.construction.text") ||
    "Услуги, реализованные и текущие проекты. От идеи до результата.";
  const quickConstructionCta =
    contentMap.get("home.quick.construction.cta") || "Перейти в раздел →";

  return (
    <div>
      <HeroSlideshow content={contentObject} />

      <section className="bg-[#e8f4e8]">
        <Container className="py-14">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <a
              href={`${base}/sale`}
              className="group block rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#7DC931]/30 hover:bg-[#7DC931] hover:shadow-lg"
            >
              <div className="text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-white">
                {quickSaleTitle}
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600 transition-colors duration-300 group-hover:text-white/90">
                {quickSaleText}
              </div>
              <span className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-[#ff6a3d] transition-colors duration-300 group-hover:bg-white group-hover:text-[#7DC931]">
                {quickSaleCta}
              </span>
            </a>

            <a
              href={`${base}/rent`}
              className="group block rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#7DC931]/30 hover:bg-[#7DC931] hover:shadow-lg"
            >
              <div className="text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-white">
                {quickRentTitle}
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600 transition-colors duration-300 group-hover:text-white/90">
                {quickRentText}
              </div>
              <span className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-[#ff6a3d] transition-colors duration-300 group-hover:bg-white group-hover:text-[#7DC931]">
                {quickRentCta}
              </span>
            </a>

            <a
              href={`${base}/construction`}
              className="group block rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#7DC931]/30 hover:bg-[#7DC931] hover:shadow-lg"
            >
              <div className="text-sm font-semibold text-slate-900 transition-colors duration-300 group-hover:text-white">
                {quickConstructionTitle}
              </div>
              <div className="mt-2 text-sm leading-6 text-slate-600 transition-colors duration-300 group-hover:text-white/90">
                {quickConstructionText}
              </div>
              <span className="mt-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold text-[#ff6a3d] transition-colors duration-300 group-hover:bg-white group-hover:text-[#7DC931]">
                {quickConstructionCta}
              </span>
            </a>
          </div>
        </Container>
      </section>

      <section className="bg-[#e8f4e8]">
        <Container className="py-14">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {hotBadge}
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {hotTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 whitespace-pre-line">
                {hotDescription}
              </p>
            </div>
            <a
              href={`${base}/sale`}
              className="hidden sm:inline-flex items-center justify-center rounded-full bg-[#ff6a3d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff5a2b]"
            >
              {hotCta}
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotWithLocale.map((p) => (
              <PropertyCard key={p.id} property={p} basePath={base} lang={lang} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <a
              href={`${base}/sale`}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#ff6a3d] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#ff5a2b]"
            >
              {hotCta}
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
