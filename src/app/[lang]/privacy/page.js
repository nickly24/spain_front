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
  const meta = await getPageMeta("privacy", lang);
  return { title: meta?.seoTitle ?? meta?.title ?? ui.meta.privacyDefault };
}

export default async function PrivacyPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);

  const [hero, pageTr] = await Promise.all([
    prisma.heroBanner.findFirst({ where: { pageSlug: "privacy" } }),
    prisma.page.findUnique({
      where: { slug: "privacy" },
      include: { translations: { where: { locale: lang }, take: 1 } },
    }),
  ]);

  const tr = pageTr?.translations?.[0];
  const heroTitle = tr?.title ?? "Политика конфиденциальности";
  const heroSubtitle =
    lang === "ru"
      ? "Текст будет заменён на финальную версию с учётом требований юриста и выбранного способа обработки заявок."
      : lang === "en"
        ? "Text will be replaced with the final version in line with legal requirements and the chosen request handling method."
        : "El texto se sustituirá por la versión definitiva según los requisitos legales y el método de tramitación de solicitudes elegido.";
  const homeLabel = { ru: "Главная", en: "Home", es: "Inicio" }[lang];
  const crumbsStr = `${homeLabel} / ${heroTitle}`;
  const bodyText =
    lang === "ru"
      ? "Здесь размещается информация о том, какие персональные данные собираются (например, имя, телефон, email), с какой целью, на каком основании, как долго хранятся и как можно запросить удаление данных."
      : lang === "en"
        ? "This section will contain information on what personal data is collected (e.g. name, phone, email), for what purpose, on what basis, how long it is stored and how to request deletion."
        : "Aquí se incluirá información sobre qué datos personales se recogen (p. ej. nombre, teléfono, email), con qué fin, con qué base, cuánto tiempo se conservan y cómo solicitar su eliminación.";

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        crumbs={crumbsStr}
        imageSrc={hero?.imageUrl || "/photos/image copy 8.png"}
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
