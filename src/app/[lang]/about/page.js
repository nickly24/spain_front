import { PageHero } from "../../../components/PageHero";
import { Container } from "../../../components/Container";
import { CompanyHistory } from "../../../components/CompanyHistory";
import { prisma } from "../../../lib/prisma";
import { getLocaleFromParams } from "../../../lib/i18n";
import { getPageMeta } from "../../../lib/page-meta";
import { getUi } from "../../../lib/ui";

export async function generateMetadata({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const ui = getUi(lang);
  const meta = await getPageMeta("about", lang);
  const title = meta?.seoTitle ?? meta?.title ?? ui.meta.aboutDefault;
  const description = meta?.seoDescription ?? undefined;
  return { title, description, openGraph: { title, description } };
}

export default async function AboutPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);

  const [hero, page, snippets] = await Promise.all([
    prisma.heroBanner.findFirst({ where: { pageSlug: "about" } }),
    prisma.page.findUnique({ where: { slug: "about" } }),
    prisma.pageContent.findMany({ where: { pageSlug: "about", locale: lang } }),
  ]);

  const contentMap = new Map((snippets || []).map((s) => [s.key, s.value]));
  const mainText =
    contentMap.get("about.mainText") ||
    contentMap.get("__page_content__") ||
    page?.content ||
    "Помогаем подобрать объекты под ваш запрос (город, спальни, стоимость), а также подключаем проектное направление, когда требуется ремонт или решение «под ключ». Ниже — история компании в формате, который удобно показывать клиенту.";

  const pageTr = await prisma.page.findUnique({
    where: { slug: "about" },
    include: { translations: { where: { locale: lang }, take: 1 } },
  });
  const tr = pageTr?.translations?.[0];
  const heroTitle = tr?.title ?? "О компании MG Group";
  const heroSubtitle =
    contentMap.get("about.hero.subtitle") ||
    (lang === "ru"
      ? "MG Group (Marescol S.L) — команда, которая занимается продажей, арендой и проектами в сфере недвижимости в Испании. Наша цель — понятный процесс и качественный результат."
      : lang === "en"
        ? "MG Group (Marescol S.L) is a team working with sales, rentals and projects in Spain. Our goal is a clear process and a high-quality result."
        : "MG Group (Marescol S.L) es un equipo que trabaja con venta, alquiler y proyectos en España. Nuestro objetivo es un proceso claro y un resultado de alta calidad.");
  const homeLabel = { ru: "Главная", en: "Home", es: "Inicio" }[lang];
  const ui = getUi(lang);
  const crumbsStr = `${homeLabel} / ${tr?.title ?? ui.meta.aboutDefault}`;
  const whoLabel =
    contentMap.get("about.who.label") ||
    (lang === "ru" ? "Кто мы" : lang === "en" ? "Who we are" : "Quiénes somos");
  const whoTitle =
    contentMap.get("about.who.title") ||
    (lang === "ru"
      ? "MG Group — недвижимость и проекты в Испании"
      : lang === "en"
        ? "MG Group — real estate and projects in Spain"
        : "MG Group — inmuebles y proyectos en España");

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        crumbs={crumbsStr}
        imageSrc={hero?.imageUrl || "/photos/image copy 3.png"}
      />

      <section className="bg-mg-mint">
        <Container className="py-12">
          <div className="space-y-10">
            <section className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {whoLabel}
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {whoTitle}
              </h2>
              <p className="mt-3 max-w-3xl whitespace-pre-line text-sm leading-7 text-slate-600">
                {mainText}
              </p>
            </section>

            <CompanyHistory lang={lang} />
          </div>
        </Container>
      </section>
    </div>
  );
}
