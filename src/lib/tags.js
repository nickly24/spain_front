import { prisma } from "./prisma";

export function normalizeTagKey(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function pickTranslatedLabel(translations, locale, fallback) {
  const list = Array.isArray(translations) ? translations : [];
  const direct = list.find((t) => t?.locale === locale)?.label;
  if (direct) return direct;
  const ru = list.find((t) => t?.locale === "ru")?.label;
  if (ru) return ru;
  const any = list[0]?.label;
  return any || fallback || "";
}

export async function getTagsForSection(section) {
  return prisma.tag.findMany({
    where: { section },
    orderBy: [{ visible: "desc" }, { sortOrder: "asc" }, { id: "asc" }],
    include: { translations: true },
  });
}

export function getPropertyTagLabels(property, locale) {
  const tags = Array.isArray(property?.tags) ? property.tags : [];
  const labels = tags
    .map((pt) => {
      const tag = pt?.tag;
      if (!tag) return null;
      const label = pickTranslatedLabel(tag.translations, locale, tag.key);
      return label || null;
    })
    .filter(Boolean);

  if (labels.length) return labels;

  // Fallback для старых данных: property.badges (JSON со строками).
  const legacy = Array.isArray(property?.badges) ? property.badges : [];
  return legacy.filter(Boolean);
}

// Небольшой словарь для первичного импорта из старых badges.
// Админ сможет потом отредактировать в интерфейсе тегов.
export function defaultBadgeTranslations(ruLabel) {
  const ru = String(ruLabel || "").trim();
  const map = {
    "у моря": { en: "Near the sea", es: "Cerca del mar" },
    "после ремонта": { en: "After renovation", es: "Recién reformado" },
    "бассейн": { en: "Pool", es: "Piscina" },
    "терраса": { en: "Terrace", es: "Terraza" },
    "новостройка": { en: "New build", es: "Obra nueva" },
    "инфраструктура": { en: "Infrastructure", es: "Infraestructura" },
    "комплекс": { en: "Residential complex", es: "Complejo residencial" },
    "центр": { en: "City center", es: "Centro" },
    "инвестиция": { en: "Investment", es: "Inversión" },
    "для семьи": { en: "Family-friendly", es: "Para familias" },
    "закрытый комплекс": { en: "Gated community", es: "Urbanización cerrada" },
    "вид на город": { en: "City view", es: "Vistas a la ciudad" },
    "современный дизайн": { en: "Modern design", es: "Diseño moderno" },
    "исторический центр": { en: "Historic center", es: "Centro histórico" },
    "лофт": { en: "Loft", es: "Loft" },
    "рядом с парком": { en: "Near a park", es: "Cerca del parque" },
    "патио": { en: "Patio", es: "Patio" },
    "исторический район": { en: "Historic district", es: "Barrio histórico" },
    "длительная аренда": { en: "Long-term rent", es: "Alquiler de larga duración" },
    "для отдыха": { en: "For holidays", es: "Para vacaciones" },
    "садик": { en: "Garden", es: "Jardín" },
    "балкон": { en: "Balcony", es: "Balcón" },
    "атмосфера": { en: "Atmosphere", es: "Ambiente" },
  };

  const hit = map[ru];
  return {
    ru,
    en: hit?.en || ru,
    es: hit?.es || ru,
  };
}

