import { useQueries } from "@tanstack/react-query";

import { fetchPokemonDetails } from "@/api/pokeapi";
import type { PokemonDetails } from "@/types/pokemon";

function isPokemonDetails(item: PokemonDetails | undefined): item is PokemonDetails {
  return Boolean(item);
}

export function useFavoritePokemonDetails(favoriteIds: number[]) {
  const queries = useQueries({
    queries: favoriteIds.map((id) => ({
      enabled: Number.isInteger(id) && id > 0,
      queryFn: () => fetchPokemonDetails(id),
      queryKey: ["pokemon-details", id],
    })),
  });

  const pokemon = queries.map((query) => query.data).filter(isPokemonDetails);
  const firstError = queries.find((query) => query.isError)?.error;

  return {
    error: firstError instanceof Error ? firstError : undefined,
    isError: queries.some((query) => query.isError),
    isFetching: queries.some((query) => query.isFetching),
    isPending: queries.some((query) => query.isPending),
    pokemon,
    refetch: () => {
      void Promise.all(queries.map((query) => query.refetch()));
    },
  };
}
