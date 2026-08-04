"use client";

import { useState, useEffect } from "react";
import { type Difficulty } from "../data/locations";

export interface DbLocation {
  id: string;
  name: string;
  region: string;
  description: string;
  altitude: number;
  distance: number;
  travelTime: string;
  difficulty: Difficulty;
  visitPrice: number;
  bestSeason: string;
  recommendations: string;
  isPopular: boolean;
  latitude: number;
  longitude: number;
  image: string;
  images: string[];
  // compat fields kept for old components
  tags: string[];
}

let _cache: DbLocation[] | null = null;
let _promise: Promise<DbLocation[]> | null = null;

function fetchLocations(): Promise<DbLocation[]> {
  if (_cache) return Promise.resolve(_cache);
  if (!_promise) {
    _promise = fetch("/api/locations")
      .then((r) => r.json())
      .then((data: DbLocation[]) => {
        // add empty tags array for compat
        _cache = data.map((l) => ({ ...l, tags: [] }));
        return _cache!;
      });
  }
  return _promise;
}

/**
 * Returns all locations from the database.
 * Replaces the old hook that read from the static LOCATIONS array.
 */
export function useAllLocationsTranslated(): DbLocation[] {
  const [data, setData] = useState<DbLocation[]>(_cache ?? []);

  useEffect(() => {
    if (_cache) { setData(_cache); return; }
    fetchLocations().then(setData);
  }, []);

  return data;
}

/**
 * Returns a single location from the database by id.
 */
export function useLocationTranslated(id: number | string): DbLocation | null {
  const [data, setData] = useState<DbLocation | null>(null);

  useEffect(() => {
    fetchLocations().then((locs) => {
      const found = locs.find((l) => l.id === String(id));
      setData(found ?? null);
    });
  }, [id]);

  return data;
}
