import type { Locale } from "./types";

import ruCommon from "./locales/ru/common.json";
import ruLanding from "./locales/ru/landing.json";
import ruLocations from "./locales/ru/locations.json";
import ruLocationsData from "./locales/ru/locationsData.json";

import enCommon from "./locales/en/common.json";
import enLanding from "./locales/en/landing.json";
import enLocations from "./locales/en/locations.json";
import enLocationsData from "./locales/en/locationsData.json";

import kgCommon from "./locales/kg/common.json";
import kgLanding from "./locales/kg/landing.json";
import kgLocations from "./locales/kg/locations.json";
import kgLocationsData from "./locales/kg/locationsData.json";

type Namespace = "common" | "landing" | "locations" | "locationsData";

const translations: Record<Locale, Record<Namespace, object>> = {
  ru: { common: ruCommon, landing: ruLanding, locations: ruLocations, locationsData: ruLocationsData },
  en: { common: enCommon, landing: enLanding, locations: enLocations, locationsData: enLocationsData },
  kg: { common: kgCommon, landing: kgLanding, locations: kgLocations, locationsData: kgLocationsData },
};

export function getTranslations<T = Record<string, unknown>>(
  locale: Locale,
  namespace: Namespace
): T {
  return translations[locale]?.[namespace] as T ?? translations["ru"][namespace] as T;
}
