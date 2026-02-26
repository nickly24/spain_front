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
  const meta = await getPageMeta("contacts", lang);
  return { title: meta?.seoTitle ?? meta?.title ?? ui.meta.contactsDefault };
}

export default async function ContactsPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const lang = getLocaleFromParams(resolved);
  const ui = getUi(lang);
  const localesForContact = lang === "ru" ? ["ru"] : ["ru", lang];

  const [phoneContacts, hero, page, snippets] = await Promise.all([
    prisma.contact.findMany({
      where: { type: "phone" },
      orderBy: { id: "asc" },
      include: { translations: { where: { locale: { in: localesForContact } } } },
    }),
    prisma.heroBanner.findFirst({ where: { pageSlug: "contacts" } }),
    prisma.page.findUnique({ where: { slug: "contacts" } }),
    prisma.pageContent.findMany({ where: { pageSlug: "contacts", locale: lang } }),
  ]);

  const contentMap = new Map((snippets || []).map((s) => [s.key, s.value]));

  const D = {
    ru: {
      heroSubtitle:
        "Свяжитесь с MG Group по вопросам покупки, аренды и строительства недвижимости в Испании. Мы ответим и предложим варианты под ваш запрос.",
      headerTitle: "КОНТАКТЫ",
      headerText: "По продаже, аренде и строительству — звоните или пишите.",
      phonesBlockTitle: "ТЕЛЕФОНЫ",
      emailBlockLabel: "Почта",
      addressBlockLabel: "Адрес",
      addressText: "Испания, [уточним адрес офиса]",
      hoursBlockLabel: "Время работы",
      hoursText: "Пн–Пт 10:00–19:00",
    },
    en: {
      heroSubtitle:
        "Contact MG Group about buying, renting, or construction projects in Spain. We’ll reply and suggest options for your request.",
      headerTitle: "CONTACTS",
      headerText: "For sales, rentals and construction — call or email us.",
      phonesBlockTitle: "PHONES",
      emailBlockLabel: "Email",
      addressBlockLabel: "Address",
      addressText: "Spain, [office address to be confirmed]",
      hoursBlockLabel: "Working hours",
      hoursText: "Mon–Fri 10:00–19:00",
    },
    es: {
      heroSubtitle:
        "Contacta con MG Group sobre compra, alquiler o proyectos de construcción en España. Responderemos y propondremos opciones para tu solicitud.",
      headerTitle: "CONTACTOS",
      headerText: "Para venta, alquiler y construcción — llámanos o escríbenos.",
      phonesBlockTitle: "TELÉFONOS",
      emailBlockLabel: "Email",
      addressBlockLabel: "Dirección",
      addressText: "España, [dirección de la oficina por confirmar]",
      hoursBlockLabel: "Horario",
      hoursText: "Lun–Vie 10:00–19:00",
    },
  };
  const d = D[lang] || D.ru;

  const heroSubtitle =
    contentMap.get("contacts.hero.subtitle") ||
    contentMap.get("__page_content__") ||
    page?.content ||
    d.heroSubtitle;
  const headerLabel = contentMap.get("contacts.header.label") || "MG Group (Marescol S.L)";
  const headerTitle = contentMap.get("contacts.header.title") || d.headerTitle;
  const headerText =
    contentMap.get("contacts.header.text") ||
    d.headerText;
  const phonesBlockTitle = contentMap.get("contacts.phones.title") || d.phonesBlockTitle;
  const emailBlockLabel = contentMap.get("contacts.email.label") || d.emailBlockLabel;
  const emailAddress = contentMap.get("contacts.email.address") || "info@mggroup.es";
  const addressBlockLabel = contentMap.get("contacts.address.label") || d.addressBlockLabel;
  const addressText =
    contentMap.get("contacts.address.text") || d.addressText;
  const hoursBlockLabel = contentMap.get("contacts.hours.label") || d.hoursBlockLabel;
  const hoursText = contentMap.get("contacts.hours.text") || d.hoursText;

  const pageTr = await prisma.page.findUnique({
    where: { slug: "contacts" },
    include: { translations: { where: { locale: lang }, take: 1 } },
  });
  const tr = pageTr?.translations?.[0];
  const heroTitle = tr?.title ?? "Контакты";
  const homeLabel = { ru: "Главная", en: "Home", es: "Inicio" }[lang];
  const crumbsStr = `${homeLabel} / ${heroTitle}`;
  const languagesLabel =
    contentMap.get("contacts.languages.label") || ui.contacts.languagesLabel;

  const phoneContactsWithLocale = phoneContacts.map((c) => {
    const trs = Array.isArray(c.translations) ? c.translations : [];
    const picked = trs.find((t) => t.locale === lang) || trs.find((t) => t.locale === "ru") || null;
    return {
      ...c,
      topic: picked?.topic ?? c.topic,
      name: picked?.name ?? c.name,
      person: picked?.person ?? c.person,
      languages: picked?.languages ?? c.languages,
    };
  });

  return (
    <div>
      <PageHero
        title={heroTitle}
        subtitle={heroSubtitle}
        crumbs={crumbsStr}
        imageSrc={hero?.imageUrl || "/photos/image copy 7.png"}
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <div className="border border-black/10 bg-white p-6 shadow-sm sm:p-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {headerLabel}
                </div>
                <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                  {headerTitle}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{headerText}</p>
              </div>
            </div>

            <div className="mt-8 border border-black/10">
              <div className="flex items-center gap-3 border-b border-black/10 px-6 py-4">
                <svg
                  className="size-5 text-[#7DC931]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <div className="text-sm font-extrabold tracking-wider text-slate-900">
                  {phonesBlockTitle}
                </div>
              </div>

              <div className="divide-y divide-[#ff6a3d]/30">
                {phoneContactsWithLocale.map((p) => {
                  const isPlaceholder =
                    p.phone.includes("…") || p.phone.includes("X") || p.phone.includes("х");
                  const telHref = !isPlaceholder
                    ? `tel:${p.phone.replace(/[^\d+]/g, "")}`
                    : null;
                  return (
                    <div
                      key={p.topic}
                      className="grid grid-cols-1 gap-3 px-6 py-5 sm:grid-cols-12 sm:items-center"
                    >
                      <div className="sm:col-span-4">
                        <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                          {p.topic}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          {p.name}
                        </div>
                        {p.person ? (
                          <div className="mt-1 text-xs font-semibold text-[#ff6a3d]">
                            {p.person}
                          </div>
                        ) : null}
                      </div>
                      <div className="sm:col-span-8 sm:text-right">
                        {telHref ? (
                          <a
                            className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight text-slate-900 hover:text-[#FF5A2B]"
                            href={telHref}
                          >
                            {p.phone}
                          </a>
                        ) : (
                          <div className="text-lg font-semibold tracking-tight text-slate-900">
                            {p.phone}
                          </div>
                        )}
                        {p.languages ? (
                          <div className="mt-1 text-xs text-slate-500">
                            {languagesLabel}: {p.languages}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-black/10 pt-8 md:grid-cols-3">
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center bg-[#7DC931] text-white">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                    {emailBlockLabel}
                  </div>
                  <a
                    className="mt-1 inline-block text-sm font-semibold text-slate-900 hover:text-[#FF5A2B]"
                    href={`mailto:${emailAddress}`}
                  >
                    {emailAddress}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center bg-[#7DC931] text-white">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                    {addressBlockLabel}
                  </div>
                  <div className="mt-1 text-sm text-slate-700">{addressText}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center bg-[#7DC931] text-white">
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                    {hoursBlockLabel}
                  </div>
                  <div className="mt-1 text-sm text-slate-700">{hoursText}</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
