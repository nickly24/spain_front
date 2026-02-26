import { PageHero } from "../../../components/PageHero";
import { Container } from "../../../components/Container";
import { PropertyCatalog } from "../../../components/PropertyCatalog";
import { prisma } from "../../../lib/prisma";
import { getLocaleFromParams } from "../../../lib/i18n";
import { getPageMeta } from "../../../lib/page-meta";
import { getUi } from "../../../lib/ui";
import { getPropertyTagLabels } from "../../../lib/tags";
import { getCityKeyFromProperty, getCityLabelFromProperty } from "../../../lib/cities";

export async function generateMetadata({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const ui = getUi(lang);
  const meta = await getPageMeta("rent", lang);
  return { title: meta?.seoTitle ?? meta?.title ?? ui.meta.rentDefault };
}

export default async function RentPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const base = `/${lang}`;
  const localesForTag = lang === "ru" ? ["ru"] : ["ru", lang];

  const [properties, hero, snippets] = await Promise.all([
    prisma.property.findMany({
      where: { status: "published", listingType: "rent" },
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
    }),
    prisma.heroBanner.findFirst({ where: { pageSlug: "rent" } }),
    prisma.pageContent.findMany({ where: { pageSlug: "rent", locale: lang } }),
  ]);

  const propIds = properties.map((p) => p.id);
  const translations =
    lang !== "ru" && propIds.length > 0
      ? await prisma.propertyTranslation.findMany({
          where: { locale: lang, propertyId: { in: propIds } },
        })
      : [];
  const transByProp = new Map(translations.map((t) => [t.propertyId, t]));
  const propertiesWithLocale = properties.map((p) => {
    const tr = transByProp.get(p.id);
    const baseProp = tr ? { ...p, title: tr.title, description: tr.description } : p;
    return {
      ...baseProp,
      badgesLocalized: getPropertyTagLabels(baseProp, lang),
      cityLabel: getCityLabelFromProperty(baseProp, lang),
      cityKey: getCityKeyFromProperty(baseProp),
    };
  });

  const contentMap = new Map((snippets || []).map((s) => [s.key, s.value]));
  const heroSubtitle =
    contentMap.get("rent.hero.subtitle") ||
    "Квартиры и дома в аренду. Фильтры по городу, количеству спален и стоимости помогут подобрать вариант под ваш бюджет.";

  const pageTr = await prisma.page.findUnique({
    where: { slug: "rent" },
    include: { translations: { where: { locale: lang }, take: 1 } },
  });
  const tr = pageTr?.translations?.[0];
  const heroTitle = tr?.title ?? "Аренда недвижимости в Испании";
  const homeLabel = { ru: "Главная", en: "Home", es: "Inicio" }[lang];
  const rentLabel = tr?.title ?? "Аренда";
  const crumbsStr = `${homeLabel} / ${rentLabel}`;

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        crumbs={crumbsStr}
        imageSrc={hero?.imageUrl || "/photos/image copy 2.png"}
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <PropertyCatalog
            properties={propertiesWithLocale}
            mode="rent"
            basePath={base}
            lang={lang}
          />
        </Container>
      </section>
    </div>
  );
}
