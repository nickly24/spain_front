import { PageHero } from "../../../components/PageHero";
import { Container } from "../../../components/Container";
import { prisma } from "../../../lib/prisma";
import { getLocaleFromParams } from "../../../lib/i18n";
import { getPageMeta } from "../../../lib/page-meta";
import { getUi } from "../../../lib/ui";

export async function generateMetadata({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const ui = getUi(lang);
  const meta = await getPageMeta("news", lang);
  return { title: meta?.seoTitle ?? meta?.title ?? ui.meta.newsDefault };
}

export default async function NewsPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const base = `/${lang}`;

  const [posts, hero, page, snippets] = await Promise.all([
    prisma.newsPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.heroBanner.findFirst({ where: { pageSlug: "news" } }),
    prisma.page.findUnique({ where: { slug: "news" } }),
    prisma.pageContent.findMany({ where: { pageSlug: "news", locale: lang } }),
  ]);

  const contentMap = new Map((snippets || []).map((s) => [s.key, s.value]));
  const heroSubtitle =
    contentMap.get("news.hero.subtitle") ||
    contentMap.get("__page_content__") ||
    page?.content ||
    "Публикуем новости компании и полезные материалы о недвижимости в Испании: выбор локации, покупка, аренда, проекты.";

  const postIds = posts.map((p) => p.id);
  const translations =
    lang !== "ru" && postIds.length > 0
      ? await prisma.newsPostTranslation.findMany({
          where: { locale: lang, postId: { in: postIds } },
        })
      : [];
  const transByPost = new Map(translations.map((t) => [t.postId, t]));

  const pageTr = await prisma.page.findUnique({
    where: { slug: "news" },
    include: { translations: { where: { locale: lang }, take: 1 } },
  });
  const tr = pageTr?.translations?.[0];
  const heroTitle = tr?.title ?? "Новости и статьи";
  const homeLabel = { ru: "Главная", en: "Home", es: "Inicio" }[lang];
  const crumbsStr = `${homeLabel} / ${heroTitle}`;
  const readMore = { ru: "Читать →", en: "Read more →", es: "Leer más →" }[lang];
  const localeForDate = lang === "ru" ? "ru-RU" : lang === "es" ? "es-ES" : "en-GB";

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        crumbs={crumbsStr}
        imageSrc={hero?.imageUrl || "/photos/image copy 5.png"}
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {posts.map((p) => {
              const pt = transByPost.get(p.id);
              const title = pt?.title ?? p.title;
              const excerpt = pt?.excerpt ?? p.excerpt;
              return (
                <a
                  key={p.slug}
                  href={`${base}/news/${p.slug}`}
                  className="group rounded-3xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-xs text-slate-500">
                    {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString(localeForDate) : null}
                  </div>
                  <div className="mt-3 text-base font-semibold text-slate-900 group-hover:text-[#FF5A2B]">
                    {title}
                  </div>
                  {excerpt ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">{excerpt}</p>
                  ) : null}
                  <div className="mt-4 text-sm font-semibold text-[#FF5A2B] group-hover:text-[#ff4b17]">
                    {readMore}
                  </div>
                </a>
              );
            })}
          </div>
        </Container>
      </section>
    </div>
  );
}
