"use client";

import { useMemo } from "react";
import { useT } from "./useT";
import { LOCATIONS, type Location } from "../data/locations";

type LocalizedEntry = {
  name: string;
  region: string;
  description: string;
  recommendations: string;
  tags: string[];
};

type LocationsDataT = Record<string, LocalizedEntry>;

/**
 * Returns a single location merged with translations for the current locale.
 */
export function useLocationTranslated(id: number): Location & LocalizedEntry {
  const data = useT<LocationsDataT>("locationsData");
  const base = LOCATIONS.find((l) => l.id === id)!;
  return useMemo(() => {
    const t = data[String(id)];
    return t ? { ...base, ...t } : base;
  }, [data, id, base]);
}

/**
 * Returns all locations merged with translations for the current locale.
 */
export function useAllLocationsTranslated(): (Location & LocalizedEntry)[] {
  const data = useT<LocationsDataT>("locationsData");
  return useMemo(() => {
    return LOCATIONS.map((loc) => {
      const t = data[String(loc.id)];
      return t ? { ...loc, ...t } : loc;
    });
  }, [data]);
}
