import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";

import { fetchPokemonPage, type PokemonPage } from "@/api/pokeapi";

const PAGE_SIZE = 20;
const POKEMON_LIST_QUERY_KEY = ["pokemon-list"] as const;

export function usePokemonList() {
  return useInfiniteQuery<
    PokemonPage,
    Error,
    InfiniteData<PokemonPage>,
    typeof POKEMON_LIST_QUERY_KEY,
    number
  >({
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchPokemonPage({
        limit: PAGE_SIZE,
        offset: pageParam,
      }),
    queryKey: POKEMON_LIST_QUERY_KEY,
  });
}
