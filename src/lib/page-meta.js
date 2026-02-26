import { prisma } from "./prisma";

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
  return {
    title: tr?.title ?? page.title,
    seoTitle: tr?.seoTitle ?? page.seoTitle ?? page.title,
    seoDescription: tr?.seoDescription ?? page.seoDescription ?? null,
  };
}
