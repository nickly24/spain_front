import { DEFAULT_LOCALE } from "./i18n";

const UI = {
  ru: {
    header: {
      closeMenu: "Закрыть меню",
      openMenu: "Открыть меню",
    },
    footer: {
      description:
        "Продажа, аренда и строительство недвижимости в Испании. Подбираем объекты под ваш запрос и сопровождаем на всех этапах.",
      phone: "Телефон",
      email: "Email",
      navigation: "Навигация",
      feedback: "Обратная связь",
      feedbackText:
        "Напишите нам в разделе «Контакты» — ответим и предложим варианты под ваш бюджет и локацию.",
      goToContacts: "Перейти к контактам",
      rights: "Все права защищены.",
      privacy: "Политика конфиденциальности",
    },
    catalog: {
      city: "Город",
      allCities: "Все города",
      bedrooms: "Кол-во спален",
      any: "Любое",
      studio: "Студия",
      price: "Стоимость",
      from: "от",
      to: "до",
      reset: "Сбросить",
      found: "Найдено",
      page: "Страница",
      of: "из",
      rentSuffix: "/ мес",
    },
    property: {
      views_one: "просмотр",
      views_few: "просмотра",
      views_many: "просмотров",
      ratingLabel: (rating) => `Рейтинг ${rating} из 5`,
      bedroomsShort: "сп.",
      areaUnit: "м²",
      moreDetails: "Подробнее",
      thousandSuffix: " тыс",
    },
    meta: {
      homeDefault: "MG Group — Недвижимость в Испании",
      saleDefault: "Продажа недвижимости",
      rentDefault: "Аренда недвижимости",
      aboutDefault: "О компании",
      contactsDefault: "Контакты",
      constructionDefault: "Строительство и проекты",
      newsDefault: "Новости и статьи",
      partnersDefault: "Партнёрам",
      privacyDefault: "Политика конфиденциальности",
    },
    contacts: {
      languagesLabel: "Языки",
    },
  },
  en: {
    header: {
      closeMenu: "Close menu",
      openMenu: "Open menu",
    },
    footer: {
      description:
        "Real estate sales, rentals and construction in Spain. We select properties for your request and support you at every step.",
      phone: "Phone",
      email: "Email",
      navigation: "Navigation",
      feedback: "Get in touch",
      feedbackText:
        "Message us in the Contacts section — we’ll reply and suggest options for your budget and location.",
      goToContacts: "Go to contacts",
      rights: "All rights reserved.",
      privacy: "Privacy policy",
    },
    catalog: {
      city: "City",
      allCities: "All cities",
      bedrooms: "Bedrooms",
      any: "Any",
      studio: "Studio",
      price: "Price",
      from: "from",
      to: "to",
      reset: "Reset",
      found: "Found",
      page: "Page",
      of: "of",
      rentSuffix: "/ mo",
    },
    property: {
      views_one: "view",
      views_many: "views",
      ratingLabel: (rating) => `Rating ${rating} out of 5`,
      bedroomsShort: "bd",
      areaUnit: "m²",
      moreDetails: "Details",
      thousandSuffix: "k",
    },
    meta: {
      homeDefault: "MG Group — Real estate in Spain",
      saleDefault: "Property for sale",
      rentDefault: "Property for rent",
      aboutDefault: "About",
      contactsDefault: "Contacts",
      constructionDefault: "Construction",
      newsDefault: "News",
      partnersDefault: "Partners",
      privacyDefault: "Privacy policy",
    },
    contacts: {
      languagesLabel: "Languages",
    },
  },
  es: {
    header: {
      closeMenu: "Cerrar menú",
      openMenu: "Abrir menú",
    },
    footer: {
      description:
        "Venta, alquiler y construcción de inmuebles en España. Seleccionamos propiedades según tu solicitud y te acompañamos en todas las etapas.",
      phone: "Teléfono",
      email: "Email",
      navigation: "Navegación",
      feedback: "Contacto",
      feedbackText:
        "Escríbenos en la sección «Contactos» — responderemos y propondremos opciones según tu presupuesto y zona.",
      goToContacts: "Ir a contactos",
      rights: "Todos los derechos reservados.",
      privacy: "Política de privacidad",
    },
    catalog: {
      city: "Ciudad",
      allCities: "Todas las ciudades",
      bedrooms: "Dormitorios",
      any: "Cualquiera",
      studio: "Estudio",
      price: "Precio",
      from: "desde",
      to: "hasta",
      reset: "Restablecer",
      found: "Encontrados",
      page: "Página",
      of: "de",
      rentSuffix: "/ mes",
    },
    property: {
      views_one: "vista",
      views_many: "vistas",
      ratingLabel: (rating) => `Valoración ${rating} de 5`,
      bedroomsShort: "hab.",
      areaUnit: "m²",
      moreDetails: "Detalles",
      thousandSuffix: "k",
    },
    meta: {
      homeDefault: "MG Group — Inmuebles en España",
      saleDefault: "Inmuebles en venta",
      rentDefault: "Inmuebles en alquiler",
      aboutDefault: "Sobre nosotros",
      contactsDefault: "Contactos",
      constructionDefault: "Construcción",
      newsDefault: "Noticias",
      partnersDefault: "Socios",
      privacyDefault: "Política de privacidad",
    },
    contacts: {
      languagesLabel: "Idiomas",
    },
  },
};

export function getUi(lang) {
  const key = UI[lang] ? lang : DEFAULT_LOCALE;
  return UI[key] || UI.ru;
}

export function getIntlLocale(lang) {
  if (lang === "es") return "es-ES";
  if (lang === "en") return "en-GB";
  return "ru-RU";
}

export function formatInt(value, lang, options = {}) {
  try {
    return new Intl.NumberFormat(getIntlLocale(lang), options).format(value);
  } catch {
    return String(value);
  }
}

export function formatMoneyEUR(value, lang) {
  if (typeof value !== "number") return "";
  return formatInt(value, lang);
}

export function formatViewsCount(n, lang) {
  const ui = getUi(lang);
  if (lang === "ru") {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 14) return ui.property.views_many;
    if (mod10 === 1) return ui.property.views_one;
    if (mod10 >= 2 && mod10 <= 4) return ui.property.views_few;
    return ui.property.views_many;
  }
  return n === 1 ? ui.property.views_one : ui.property.views_many;
}

export function formatCompactK(n, lang) {
  // компактный формат нужен только для крупных чисел (просмотры)
  try {
    return new Intl.NumberFormat(getIntlLocale(lang), {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(n);
  } catch {
    if (n < 1000) return String(n);
    const ui = getUi(lang);
    const num = (n / 1000).toFixed(1);
    const normalized = lang === "ru" ? num.replace(".", ",") : num;
    return `${normalized}${ui.property.thousandSuffix}`;
  }
}

