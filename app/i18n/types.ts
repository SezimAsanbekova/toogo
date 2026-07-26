export type Locale = "ru" | "en" | "kg";

export const LOCALES: Locale[] = ["ru", "en", "kg"];
export const DEFAULT_LOCALE: Locale = "ru";

export const LOCALE_NAMES: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  kg: "Кыргызча",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  ru: "🇷🇺",
  en: "🇬🇧",
  kg: "🇰🇬",
};
