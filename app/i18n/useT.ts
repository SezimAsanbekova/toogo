"use client";

import { useMemo } from "react";
import { useLocale } from "./context";
import { getTranslations } from "./loader";

type Namespace = "common" | "landing" | "locations" | "locationsData";

export function useT<T = Record<string, unknown>>(namespace: Namespace): T {
  const { locale } = useLocale();
  return useMemo(() => getTranslations<T>(locale, namespace), [locale, namespace]);
}
