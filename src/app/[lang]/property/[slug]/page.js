import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "../../../../components/Container";
import { PageHero } from "../../../../components/PageHero";
import { PropertyGallery } from "../../../../components/PropertyGallery";
import { prisma } from "../../../../lib/prisma";
import { getLocaleFromParams } from "../../../../lib/i18n";
import { formatCompactK, formatMoneyEUR, formatViewsCount, getUi } from "../../../../lib/ui";
import { getPropertyTagLabels } from "../../../../lib/tags";
import { getCityLabelFromProperty } from "../../../../lib/cities";

function PropertyRating({ property, lang }) {
  const ui = getUi(lang);
  const views = property.views ?? 0;
  const rating = property.rating ?? 5;
  const fullStars = Math.floor(rating);
  const hasHalf = rating > fullStars && rating < 5 && (rating % 1) >= 0.25;
  const path = "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";
  const gradientId = "property-star-half";

  return (
    <div className="flex flex-wrap items-center gap-6 border-y border-black/5 py-4">
      <div className="flex items-center gap-2 text-slate-600">
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium">
          {formatCompactK(views, lang)} {formatViewsCount(views, lang)}
        </span>
      </div>
      <div className="flex items-center gap-2" aria-label={ui.property.ratingLabel(Number(rating).toFixed(1))}>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => {
            const filled = i <= fullStars && !(i === fullStars + 1 && hasHalf);
            const half = i === fullStars + 1 && hasHalf;
            if (half) {
              return (
                <span key={i} className="relative inline-block size-5" style={{ width: "1.25rem", height: "1.25rem" }}>
                  <svg className="absolute inset-0 size-5 text-slate-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path fillRule="evenodd" clipRule="evenodd" d={path} />
                  </svg>
                  <svg className="absolute inset-0 size-5 text-amber-400" viewBox="0 0 20 20" fill={`url(#${gradientId})`} aria-hidden>
                    <defs>
                      <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                    <path fillRule="evenodd" clipRule="evenodd" d={path} />
                  </svg>
                </span>
              );
            }
            return (
              <svg
                key={i}
                className={filled ? "size-5 text-amber-400" : "size-5 text-slate-200"}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path fillRule="evenodd" clipRule="evenodd" d={path} />
              </svg>
            );
          })}
        </div>
        <span className="text-sm font-semibold text-slate-800">{Number(rating).toFixed(1)}</span>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const properties = await prisma.property.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return properties.map((p) => ({ slug: p.slug }));
}

export default async function PropertyPage({ params }) {
  const resolved = typeof params?.then === "function" ? await params : params;
  const slug = resolved?.slug;
  const lang = getLocaleFromParams(resolved);
  const ui = getUi(lang);
  const base = `/${lang}`;
  const localesForTag = lang === "ru" ? ["ru"] : ["ru", lang];
  const localesForCity = localesForTag;

  const property = slug
    ? await prisma.property.findUnique({
        where: { slug },
        include: {
          images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }] },
          tags: {
            orderBy: [{ sortOrder: "asc" }, { tagId: "asc" }],
            include: {
              tag: {
                include: {
                  translations: { where: { locale: { in: localesForTag } } },
                },
              },
            },
          },
          cityRel: {
            include: {
              translations: { where: { locale: { in: localesForCity } } },
            },
          },
        },
      })
    : null;
  if (!property) return notFound();
  const propertyWithLocale = {
    ...property,
    badgesLocalized: getPropertyTagLabels(property, lang),
    cityLabel: getCityLabelFromProperty(property, lang),
  };

  const tr =
    lang !== "ru"
      ? await prisma.propertyTranslation.findUnique({
          where: { propertyId_locale: { propertyId: property.id, locale: lang } },
        })
      : null;
  const title = tr?.title ?? property.title;
  const description = tr?.description ?? property.description ?? "";

  const isSale = property.listingType === "sale";
  const price = isSale
    ? `€ ${formatMoneyEUR(property.priceEur, lang)}`
    : `€ ${formatMoneyEUR(property.rentEurPerMonth, lang)} ${ui.catalog.rentSuffix}`;

  const catalogPath = isSale ? `${base}/sale` : `${base}/rent`;
  const catalogLabel = isSale
    ? (lang === "ru" ? "Продажа" : lang === "en" ? "Sale" : "Venta")
    : (lang === "ru" ? "Аренда" : lang === "en" ? "Rent" : "Alquiler");
  const homeLabel = { ru: "Главная", en: "Home", es: "Inicio" }[lang];
  const objectLabel = { ru: "Объект", en: "Property", es: "Inmueble" }[lang];
  const crumbsStr = `${homeLabel} / ${catalogLabel} / ${objectLabel}`;
  const backLabel = { ru: "← Назад в каталог", en: "← Back to catalog", es: "← Volver al catálogo" }[lang];
  const idLabel = { ru: "ID объекта", en: "Property ID", es: "ID del inmueble" }[lang];
  const priceLabel = { ru: "Цена", en: "Price", es: "Precio" }[lang];
  const rentLabel = { ru: "Аренда", en: "Rent", es: "Alquiler" }[lang];
  const descLabel = { ru: "Описание", en: "Description", es: "Descripción" }[lang];
  const specsLabel = { ru: "Характеристики", en: "Features", es: "Características" }[lang];
  const cityLabel = { ru: "Город", en: "City", es: "Ciudad" }[lang];
  const bedsLabel = { ru: "Спальни", en: "Bedrooms", es: "Dormitorios" }[lang];
  const areaLabel = { ru: "Площадь", en: "Area", es: "Superficie" }[lang];
  const formatLabel = { ru: "Формат", en: "Type", es: "Tipo" }[lang];
  const studioLabel = { ru: "Студия", en: "Studio", es: "Estudio" }[lang];
  const contactLabel = { ru: "Связаться по объекту", en: "Contact about this property", es: "Contactar sobre este inmueble" }[lang];
  const contactText =
    lang === "ru"
      ? "Уточним детали, организуем просмотр и подберём альтернативы, если нужно."
      : lang === "en"
        ? "We will clarify details, arrange a viewing and suggest alternatives if needed."
        : "Aclararemos detalles, organizaremos una visita y propondremos alternativas si hace falta.";
  const callLabel = { ru: "Позвонить", en: "Call", es: "Llamar" }[lang];
  const requestLabel = { ru: "Оставить заявку", en: "Submit request", es: "Enviar solicitud" }[lang];

  return (
    <div>
      <PageHero
        title={title}
        subtitle={`${propertyWithLocale.cityLabel || propertyWithLocale.city} • ${
          propertyWithLocale.bedrooms === 0 ? studioLabel : `${propertyWithLocale.bedrooms} ${bedsLabel.toLowerCase()}`
        } • ${propertyWithLocale.areaM2} ${ui.property.areaUnit} • ${price}`}
        crumbs={crumbsStr}
        imageSrc={propertyWithLocale.images?.[0]?.url || "/photos/poster.jpg"}
      />

      <section className="bg-[#e8f4e8]">
        <Container className="py-12">
          <div className="rounded-3xl border border-black/10 bg-white shadow-sm">
            <div className="group -mt-px rounded-t-3xl border-b border-black/10 px-6 py-4 transition-colors duration-200 hover:bg-[#ff6a3d]/10">
              <Link
                href={catalogPath}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:bg-[#ff6a3d] hover:text-white"
              >
                {backLabel}
              </Link>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">{idLabel}</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{property.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">{isSale ? priceLabel : rentLabel}</div>
                  <div className="mt-1 text-lg font-semibold text-[#ff6a3d]">{price}</div>
                </div>
              </div>

              <PropertyRating property={propertyWithLocale} lang={lang} />

              {(propertyWithLocale.badgesLocalized || propertyWithLocale.badges)?.length ? (
                <div className="flex flex-wrap gap-2 pt-4">
                  {(propertyWithLocale.badgesLocalized || propertyWithLocale.badges).map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-[#7DC931]/40 bg-[#7DC931]/10 px-4 py-2 text-sm font-medium text-[#5a9a24]"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-6">
                <PropertyGallery
                  images={(propertyWithLocale.images || []).map((img) => img.url)}
                  alt={title}
                />
              </div>

              <div className="mt-6">
                <h2 className="text-base font-semibold text-slate-900">{descLabel}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">{description}</p>
              </div>

              <div className="mt-6">
                <h2 className="text-base font-semibold text-slate-900">{specsLabel}</h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
                    <div className="grid size-10 place-items-center rounded-2xl bg-black/3 text-slate-700">
                      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{cityLabel}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {propertyWithLocale.cityLabel || propertyWithLocale.city}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
                    <div className="grid size-10 place-items-center rounded-2xl bg-black/3 text-slate-700">
                      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                        <path d="M21 10.5V18a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-7.5a2 2 0 0 1 2-2h1V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2.5h2a2 2 0 0 1 2 2ZM6 8.5h8V6H6v2.5Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{bedsLabel}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {propertyWithLocale.bedrooms === 0 ? studioLabel : propertyWithLocale.bedrooms}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
                    <div className="grid size-10 place-items-center rounded-2xl bg-black/3 text-slate-700">
                      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                        <path d="M3 3h18v2H3V3Zm2 6h14v12H5V9Zm2 2v8h10v-8H7Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{areaLabel}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {propertyWithLocale.areaM2} {ui.property.areaUnit}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-4">
                    <div className="grid size-10 place-items-center rounded-2xl bg-black/3 text-slate-700">
                      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
                        <path d="M12 3 2 12h3v9h6v-6h2v6h6v-9h3L12 3Z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">{formatLabel}</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">
                        {isSale ? (lang === "ru" ? "Продажа" : lang === "en" ? "Sale" : "Venta") : catalogLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-b-3xl border-t border-black/10 bg-black/2 px-6 py-6">
              <div className="text-sm font-semibold text-slate-900">{contactLabel}</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{contactText}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="tel:+34865450175"
                  className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-black/5"
                >
                  {callLabel}
                </a>
                <Link
                  href={`${base}/contacts`}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#ff6a3d] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#ff5a2b]"
                >
                  {requestLabel}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
