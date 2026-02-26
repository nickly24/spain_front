export const LOCALES = ["ru", "en", "es"];
export const DEFAULT_LOCALE = "ru";

export function isValidLocale(locale) {
  return LOCALES.includes(locale);
}

export function getLocaleFromParams(params) {
  const resolved = typeof params?.then === "function" ? null : params;
  const lang = resolved?.lang ?? resolved?.locale;
  return typeof lang === "string" && isValidLocale(lang) ? lang : DEFAULT_LOCALE;
}
