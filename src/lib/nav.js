import { prisma } from "./prisma";

/**
 * Возвращает ссылки навигации для локали: header, footer, topbar.
 * href уже с префиксом /{lang}.
 */
export async function getNavLinksByLocale(locale) {
  const links = await prisma.navigationLink.findMany({
    where: { visible: true },
    include: {
      translations: {
        where: { locale },
        take: 1,
      },
    },
    orderBy: [{ location: "asc" }, { sortOrder: "asc" }],
  });

  const base = `/${locale}`;
  const byLocation = { header: [], footer: [], topbar: [] };

  for (const link of links) {
    const label = link.translations?.[0]?.label ?? link.label;
    const href = link.href === "/" ? base : `${base}${link.href}`;
    const item = { href, label };
    if (byLocation[link.location]) byLocation[link.location].push(item);
  }

  return byLocation;
}
