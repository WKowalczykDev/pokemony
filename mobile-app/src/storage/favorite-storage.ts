import type { FavoritePokemonIds } from "@/types/pokemon";

import { getString, setString, subscribe } from "./storage";

export const FAVORITE_POKEMON_IDS_KEY = "favoritePokemonIds:v1";

function normalizeFavoritePokemonIds(value: unknown): FavoritePokemonIds {
  if (!Array.isArray(value)) {
    return [];
  }

  const seenIds = new Set<number>();
  const ids: FavoritePokemonIds = [];

  for (const item of value) {
    if (!Number.isInteger(item) || item <= 0 || seenIds.has(item)) {
      continue;
    }

    seenIds.add(item);
    ids.push(item);
  }

  return ids;
}

export function parseFavoritePokemonIds(value: string | undefined): FavoritePokemonIds {
  if (!value) {
    return [];
  }

  try {
    return normalizeFavoritePokemonIds(JSON.parse(value));
  } catch {
    return [];
  }
}

export function readFavoritePokemonIds(): FavoritePokemonIds {
  return parseFavoritePokemonIds(getString(FAVORITE_POKEMON_IDS_KEY));
}

export function writeFavoritePokemonIds(ids: FavoritePokemonIds): FavoritePokemonIds {
  const normalizedIds = normalizeFavoritePokemonIds(ids);
  setString(FAVORITE_POKEMON_IDS_KEY, JSON.stringify(normalizedIds));

  return normalizedIds;
}

export function addFavoritePokemonId(id: number): FavoritePokemonIds {
  const currentIds = readFavoritePokemonIds();

  if (currentIds.includes(id)) {
    return currentIds;
  }

  return writeFavoritePokemonIds([...currentIds, id]);
}

export function removeFavoritePokemonId(id: number): FavoritePokemonIds {
  return writeFavoritePokemonIds(
    readFavoritePokemonIds().filter((favoriteId) => favoriteId !== id),
  );
}

export function subscribeToFavoritePokemonIds(onChange: () => void) {
  return subscribe(FAVORITE_POKEMON_IDS_KEY, onChange);
}
