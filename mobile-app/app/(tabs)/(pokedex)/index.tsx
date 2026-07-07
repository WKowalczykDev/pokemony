import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PokemonDetailSheet,
  PokemonListRow,
} from "@/components";
import { usePokemonList } from "@/hooks/use-pokemon-list";
import { colors } from "@/theme/colors";
import type { PokemonListItem } from "@/types/pokemon";

export default function PokedexScreen() {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [selectedPokemonName, setSelectedPokemonName] = useState<string>();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetching,
    isFetchingNextPage,
    isPending,
    isRefetching,
    refetch,
  } = usePokemonList();

  useEffect(() => {
    let isActive = true;
    const items = data?.pages.flatMap((page) => page.items) ?? [];
    const seenIds = new Set<number>();
    const nextPokemon = items.filter((item) => {
      if (seenIds.has(item.id)) {
        return false;
      }

      seenIds.add(item.id);
      return true;
    });

    queueMicrotask(() => {
      if (isActive) {
        setPokemon(nextPokemon);
      }
    });

    return () => {
      isActive = false;
    };
  }, [data]);

  if (isPending && pokemon.length === 0) {
    return (
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.stateContainer}>
        <LoadingState message="Loading Pokemon..." />
      </SafeAreaView>
    );
  }

  if (isError && pokemon.length === 0) {
    return (
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.stateContainer}>
        <ErrorState
          message={error.message}
          onRetry={() => {
            void refetch();
          }}
          title="Could not load Pokemon"
        />
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
        <FlatList
          contentContainerStyle={[
            styles.listContent,
            pokemon.length === 0 && styles.emptyListContent,
          ]}
          data={pokemon}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            !isFetching ? (
              <EmptyState
                title="No Pokemon found"
                message="Pull to refresh and try loading the Pokedex again."
              />
            ) : null
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footer}>
                <LoadingState message="Loading more Pokemon..." />
              </View>
            ) : null
          }
          onEndReached={() => {
            if (!hasNextPage || isFetchingNextPage || isRefetching) {
              return;
            }

            void fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          onRefresh={() => {
            void refetch();
          }}
          refreshing={isRefetching && !isFetchingNextPage}
          renderItem={({ item }) => (
            <PokemonListRow
              imageUrl={item.imageUrl}
              name={item.name}
              onPress={() => {
                setSelectedPokemonName(item.name);
              }}
            />
          )}
        />
      </SafeAreaView>
      {selectedPokemonName ? (
        <PokemonDetailSheet
          isOpen
          onClose={() => {
            setSelectedPokemonName(undefined);
          }}
          selectedPokemonName={selectedPokemonName}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stateContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
