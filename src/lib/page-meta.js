import { prisma } from "./prisma";

/** Локализованный fallback для SEO description, когда в БД нет значения для языка */
const DEFAULT_DESCRIPTION = {
  ru: "MG Group (Marescol S.L): продажа, аренда и строительство недвижимости в Испании. Каталог объектов с фильтрами и удобной навигацией.",
  en: "MG Group (Marescol S.L): real estate sales, rentals and construction in Spain. Property catalog with filters and convenient navigation.",
  es: "MG Group (Marescol S.L): venta, alquiler y construcción de inmuebles en España. Catálogo con filtros y navegación.",
};

/**
 * Возвращает title, seoTitle, seoDescription для страницы по slug и locale.
 * Если перевода нет — fallback на поля Page.
 */
export async function getPageMeta(pageSlug, locale) {
  const page = await prisma.page.findUnique({
    where: { slug: pageSlug },
    include: {
      translations: { where: { locale }, take: 1 },
    },
  });
  if (!page) return null;
  const tr = page.translations?.[0];
  const seoDescription = tr?.seoDescription ?? page.seoDescription ?? null;
  const lang = locale === "en" || locale === "es" ? locale : "ru";
  return {
    title: tr?.title ?? page.title,
    seoTitle: tr?.seoTitle ?? page.seoTitle ?? page.title,
    seoDescription: seoDescription || DEFAULT_DESCRIPTION[lang],
  };
}
