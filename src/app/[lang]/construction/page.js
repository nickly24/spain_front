import { PageHero } from "../../../components/PageHero";
import { Container } from "../../../components/Container";
import { BeforeAfterGallery } from "../../../components/BeforeAfterGallery";
import { prisma } from "../../../lib/prisma";
import { getLocaleFromParams } from "../../../lib/i18n";
import { getPageMeta } from "../../../lib/page-meta";
import { getUi } from "../../../lib/ui";

export async function generateMetadata({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const ui = getUi(lang);
  const meta = await getPageMeta("construction", lang);
  const title = meta?.seoTitle ?? meta?.title ?? ui.meta.constructionDefault;
  const description = meta?.seoDescription ?? undefined;
  return { title, description, openGraph: { title, description } };
}

export default async function ConstructionPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const base = `/${lang}`;
  const localesForConstruction = lang === "ru" ? ["ru"] : ["ru", lang];

  const T = {
    ru: {
      heroSubtitle:
        "Проектирование, строительство, реконструкция и сопровождение. Аккуратный процесс, понятные этапы и результат, который приятно показывать.",
      processLabel: "Процесс",
      processTitle: "Как мы ведём проекты",
      processText: "Чёткие шаги, которые удобно показывать клиенту: от брифа до сдачи.",
      servicesLabel: "Услуги",
      servicesTitle: "Что входит в сопровождение",
      servicesText: "Набор блоков можно расширять/сужать под финальное ТЗ и макеты.",
      ctaTitle: "Нужен расчёт и консультация?",
      ctaText:
        "Напишите, что вы планируете построить или обновить — и мы предложим следующий шаг: оценка, этапы, сроки и ориентировочная стоимость.",
    },
    en: {
      heroSubtitle:
        "Design, construction, renovation and support. A neat process with clear stages and a result you’ll be proud to show.",
      processLabel: "Process",
      processTitle: "How we run projects",
      processText: "Clear steps you can easily show to a client — from brief to delivery.",
      servicesLabel: "Services",
      servicesTitle: "What’s included",
      servicesText: "This set of blocks can be expanded or reduced to match the final requirements and layouts.",
      ctaTitle: "Need an estimate and consultation?",
      ctaText:
        "Tell us what you plan to build or improve — we’ll propose the next step: estimate, stages, timeline and an approximate cost.",
    },
    es: {
      heroSubtitle:
        "Diseño, construcción, reforma y acompañamiento. Un proceso claro por etapas y un resultado que da gusto enseñar.",
      processLabel: "Proceso",
      processTitle: "Cómo gestionamos los proyectos",
      processText: "Pasos claros — del briefing a la entrega.",
      servicesLabel: "Servicios",
      servicesTitle: "Qué incluye el acompañamiento",
      servicesText: "Este conjunto se puede ampliar o reducir según los requisitos finales y los diseños.",
      ctaTitle: "¿Necesitas presupuesto y consulta?",
      ctaText:
        "Escríbenos qué planeas construir o renovar — y te propondremos el siguiente paso: estimación, etapas, plazos y un coste aproximado.",
    },
  };
  const t = T[lang] || T.ru;

  const [stepsRaw, casesRaw, services, hero, page, snippets] = await Promise.all([
    prisma.constructionStep.findMany({
      orderBy: { order: "asc" },
      include: { translations: { where: { locale: { in: localesForConstruction } } } },
    }),
    prisma.constructionCase.findMany({
      orderBy: { id: "asc" },
      include: { translations: { where: { locale: { in: localesForConstruction } } } },
    }),
    prisma.constructionService.findMany({
      orderBy: { sortOrder: "asc" },
      include: { translations: { where: { locale: { in: localesForConstruction } } } },
    }),
    prisma.heroBanner.findFirst({ where: { pageSlug: "construction" } }),
    prisma.page.findUnique({ where: { slug: "construction" } }),
    prisma.pageContent.findMany({ where: { pageSlug: "construction", locale: lang } }),
  ]);

  const contentMap = new Map((snippets || []).map((s) => [s.key, s.value]));
  const heroSubtitle =
    contentMap.get("construction.hero.subtitle") ||
    contentMap.get("__page_content__") ||
    page?.content ||
    t.heroSubtitle;

  const steps = stepsRaw.map((s) => {
    const trs = Array.isArray(s.translations) ? s.translations : [];
    const tr = trs.find((x) => x.locale === lang) || trs.find((x) => x.locale === "ru") || null;
    return {
      n: String(s.order).padStart(2, "0"),
      title: tr?.title ?? s.title,
      text: tr?.text ?? s.text,
    };
  });

  const cases = casesRaw.map((c) => {
    const trs = Array.isArray(c.translations) ? c.translations : [];
    const tr = trs.find((x) => x.locale === lang) || trs.find((x) => x.locale === "ru") || null;
    return {
      title: tr?.title ?? c.title,
      beforeSrc: c.beforeUrl,
      afterSrc: c.afterUrl,
      was: Array.isArray(tr?.was) ? tr.was : Array.isArray(c.was) ? c.was : [],
      done: Array.isArray(tr?.done) ? tr.done : Array.isArray(c.done) ? c.done : [],
    };
  });

  const servicesWithLocale = services.map((s) => {
    const trs = Array.isArray(s.translations) ? s.translations : [];
    const tr = trs.find((x) => x.locale === lang) || trs.find((x) => x.locale === "ru") || null;
    return {
      ...s,
      title: tr?.title ?? s.title,
      text: tr?.text ?? s.text,
    };
  });

  const pageTr = await prisma.page.findUnique({
    where: { slug: "construction" },
    include: { translations: { where: { locale: lang }, take: 1 } },
  });
  const tr = pageTr?.translations?.[0];
  const heroTitle = tr?.title ?? "Строительство и проекты";
  const homeLabel = { ru: "Главная", en: "Home", es: "Inicio" }[lang];
  const crumbsStr = `${homeLabel} / ${heroTitle}`;

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        crumbs={crumbsStr}
        imageSrc="/photos/image copy 4.png"
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {contentMap.get("construction.process.label") || t.processLabel}
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                  {contentMap.get("construction.process.title") || t.processTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {contentMap.get("construction.process.text") || t.processText}
                </p>
              </div>
            </div>

            <div className="relative mt-6 space-y-4">
              <div className="pointer-events-none absolute left-5 top-6 bottom-6 w-px bg-slate-200" />
              {steps.map((s) => (
                <div key={s.n} className="relative pl-14">
                  <div className="absolute left-0 top-5 grid size-10 place-items-center rounded-2xl bg-[#ff6a3d] text-sm font-semibold text-white shadow-sm">
                    {s.n}
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-600">{s.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BeforeAfterGallery cases={cases} lang={lang} />

          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {contentMap.get("construction.services.label") || t.servicesLabel}
                </div>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                  {contentMap.get("construction.services.title") || t.servicesTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {contentMap.get("construction.services.text") || t.servicesText}
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {servicesWithLocale.map((s) => (
                <div
                  key={s.title}
                  className="group inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
                  title={s.text}
                >
                  <span className="inline-block size-2 rounded-full bg-[#ff6a3d]" />
                  <span className="font-semibold text-slate-900">{s.title}</span>
                  <span className="hidden sm:inline text-slate-500">— {s.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-black/10 bg-[#ff6a3d] p-6 text-white shadow-sm">
            <div className="text-sm font-semibold">{contentMap.get("construction.cta.title") || t.ctaTitle}</div>
            <p className="mt-2 text-sm leading-6 text-white/85">
              {contentMap.get("construction.cta.text") || t.ctaText}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <a
                href="tel:+34865450175"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/30"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +34 865 450 175
              </a>
              <a
                href="mailto:info@mggroup.es"
                className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/30"
              >
                <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                info@mggroup.es
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
