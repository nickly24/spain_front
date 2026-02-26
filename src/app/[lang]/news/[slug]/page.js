import { notFound } from "next/navigation";
import { PageHero } from "../../../../components/PageHero";
import { Container } from "../../../../components/Container";
import { prisma } from "../../../../lib/prisma";
import { getLocaleFromParams } from "../../../../lib/i18n";
import { getUi } from "../../../../lib/ui";

export async function generateStaticParams() {
  const posts = await prisma.newsPost.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function NewsPostPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const slug = resolved?.slug;
  const lang = getLocaleFromParams(resolved);
  const base = `/${lang}`;

  const [post, hero] = slug
    ? await Promise.all([
        prisma.newsPost.findUnique({ where: { slug } }),
        prisma.heroBanner.findFirst({ where: { pageSlug: "news" } }),
      ])
    : [null, null];

  if (!post) return notFound();

  const tr =
    lang !== "ru"
      ? await prisma.newsPostTranslation.findUnique({
          where: { postId_locale: { postId: post.id, locale: lang } },
        })
      : null;
  const title = tr?.title ?? post.title;
  const content = tr?.content ?? post.content ?? "";
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);

  const pageTr = await prisma.page.findUnique({
    where: { slug: "news" },
    include: { translations: { where: { locale: lang }, take: 1 } },
  });
  const ui = getUi(lang);
  const newsListTitle = pageTr?.translations?.[0]?.title ?? ui.meta.newsDefault;
  const homeLabel = { ru: "Главная", en: "Home", es: "Inicio" }[lang];
  const crumbsStr = `${homeLabel} / ${newsListTitle}`;
  const backLabel = { ru: "← Назад к списку", en: "← Back to list", es: "← Volver al listado" }[lang];
  const localeForDate = lang === "ru" ? "ru-RU" : lang === "es" ? "es-ES" : "en-GB";
  const publishedStr =
    post.publishedAt &&
    (lang === "ru"
      ? `Публикация от ${new Date(post.publishedAt).toLocaleDateString("ru-RU")}`
      : lang === "en"
        ? `Published on ${new Date(post.publishedAt).toLocaleDateString("en-GB")}`
        : `Publicado el ${new Date(post.publishedAt).toLocaleDateString("es-ES")}`);

  return (
    <div>
      <PageHero
        title={title}
        subtitle={publishedStr}
        crumbs={crumbsStr}
        imageSrc={hero?.imageUrl || "/photos/image copy 6.png"}
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <article className="max-w-3xl">
            <div className="space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </article>

          <div className="mt-10">
            <a
              href={`${base}/news`}
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black/3 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-black/5"
            >
              {backLabel}
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
