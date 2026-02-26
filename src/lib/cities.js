export function pickTranslatedLabel(translations, locale, fallback) {
  const list = Array.isArray(translations) ? translations : [];
  const direct = list.find((t) => t?.locale === locale)?.label;
  if (direct) return direct;
  const ru = list.find((t) => t?.locale === "ru")?.label;
  if (ru) return ru;
  const any = list[0]?.label;
  return any || fallback || "";
}

export function getCityLabelFromProperty(property, locale) {
  const cityRel = property?.cityRel;
  if (cityRel?.translations) {
    return pickTranslatedLabel(cityRel.translations, locale, property?.city);
  }
  return property?.city || "";
}

export function getCityKeyFromProperty(property) {
  return property?.cityRel?.key || property?.city || "";
}

