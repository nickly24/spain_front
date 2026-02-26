import { prisma } from "../lib/prisma";
import { LOCALES } from "../lib/i18n";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [properties, posts] = await Promise.all([
    prisma.property.findMany({
      where: { status: "published" },
      select: { slug: true },
    }),
    prisma.newsPost.findMany({
      where: { status: "published" },
      select: { slug: true },
    }),
  ]);

  const staticPaths = ["", "/sale", "/rent", "/construction", "/about", "/news", "/contacts", "/partners", "/privacy"];

  const urls = [];
  for (const lang of LOCALES) {
    const prefix = `/${lang}`;
    for (const path of staticPaths) {
      urls.push({
        url: `${baseUrl}${path ? `${prefix}${path}` : prefix}`,
        lastModified: new Date(),
      });
    }
    for (const p of properties) {
      urls.push({
        url: `${baseUrl}${prefix}/property/${p.slug}`,
        lastModified: new Date(),
      });
    }
    for (const p of posts) {
      urls.push({
        url: `${baseUrl}${prefix}/news/${p.slug}`,
        lastModified: new Date(),
      });
    }
  }

  return urls;
}
