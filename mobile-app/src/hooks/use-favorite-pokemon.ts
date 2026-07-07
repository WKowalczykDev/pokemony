import { useCallback, useEffect, useMemo, useState } from "react";

import {
  addFavoritePokemonId,
  readFavoritePokemonIds,
  removeFavoritePokemonId,
  subscribeToFavoritePokemonIds,
} from "@/storage/favorite-storage";

export function useFavoritePokemon() {
  const [favoriteIds, setFavoriteIds] = useState(readFavoritePokemonIds);

  useEffect(() => {
    return subscribeToFavoritePokemonIds(() => {
      setFavoriteIds(readFavoritePokemonIds());
    });
  }, []);

  const setFavorite = useCallback((pokemonId: number) => {
    setFavoriteIds(addFavoritePokemonId(pokemonId));
  }, []);

  const removeFavorite = useCallback((pokemonId: number) => {
    setFavoriteIds(removeFavoritePokemonId(pokemonId));
  }, []);

  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const isFavorite = useCallback(
    (pokemonId: number) => favoriteIdSet.has(pokemonId),
    [favoriteIdSet],
  );

  return {
    favoriteIds,
    isFavorite,
    removeFavorite,
    setFavorite,
  };
}
