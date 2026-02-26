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
  const meta = await getPageMeta("partners", lang);
  return { title: meta?.seoTitle ?? meta?.title ?? ui.meta.partnersDefault };
}

export default async function PartnersPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);

  const [hero, pageTr] = await Promise.all([
    prisma.heroBanner.findFirst({ where: { pageSlug: "partners" } }),
    prisma.page.findUnique({
      where: { slug: "partners" },
      include: { translations: { where: { locale: lang }, take: 1 } },
    }),
  ]);

  const tr = pageTr?.translations?.[0];
  const heroTitle = tr?.title ?? "Партнёрам";
  const heroSubtitle =
    lang === "ru"
      ? "Страница для партнёров MG Group: условия сотрудничества, направления и контакты. Текст и структура уточняются."
      : lang === "en"
        ? "Page for MG Group partners: cooperation terms, areas and contacts. Text and structure to be finalised."
        : "Página para socios de MG Group: condiciones de colaboración, ámbitos y contactos. Texto y estructura por definir.";
  const homeLabel = { ru: "Главная", en: "Home", es: "Inicio" }[lang];
  const crumbsStr = `${homeLabel} / ${heroTitle}`;
  const bodyText =
    lang === "ru"
      ? "В этом разделе можно разместить: описание моделей сотрудничества, регионы работы, формат передачи заявок, SLA и контактные данные менеджера."
      : lang === "en"
        ? "This section can include: description of cooperation models, regions, lead handover format, SLA and manager contact details."
        : "En esta sección se puede incluir: descripción de modelos de colaboración, regiones, formato de cesión de leads, SLA y datos de contacto del responsable.";

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        crumbs={crumbsStr}
        imageSrc={hero?.imageUrl || "/photos/image copy 9.png"}
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <p className="text-sm leading-6 text-slate-600">{bodyText}</p>
          </div>
        </Container>
      </section>
    </div>
  );
}
