import { useQuery } from "@tanstack/react-query";

import { fetchPokemonDetails } from "@/api/pokeapi";

export function usePokemonDetails(nameOrId: string | number | undefined) {
  const normalizedNameOrId =
    typeof nameOrId === "string" ? nameOrId.trim().toLowerCase() : nameOrId;

  return useQuery({
    enabled: Boolean(normalizedNameOrId),
    queryFn: () => fetchPokemonDetails(normalizedNameOrId as string | number),
    queryKey: ["pokemon-details", normalizedNameOrId],
  });
}
