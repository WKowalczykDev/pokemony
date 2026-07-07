import { BottomSheetProvider } from "@swmansion/react-native-bottom-sheet";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PokemonCard,
  PokemonDetailSheet,
} from "@/components";
import { useFavoritePokemon } from "@/hooks/use-favorite-pokemon";
import { useFavoritePokemonDetails } from "@/hooks/use-favorite-pokemon-details";
import { colors } from "@/theme/colors";
import type { PokemonDetails } from "@/types/pokemon";

function formatName(name: string) {
  return name.replaceAll("-", " ");
}

function getPokemonSubtitle(pokemon: PokemonDetails) {
  return pokemon.types.map((type) => formatName(type.name)).join(", ");
}

export default function FavoritesScreen() {
  const [selectedPokemonName, setSelectedPokemonName] = useState<string>();
  const { favoriteIds, removeFavorite } = useFavoritePokemon();
  const { error, isError, isPending, pokemon, refetch } = useFavoritePokemonDetails(favoriteIds);

  if (favoriteIds.length === 0) {
    return (
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.stateContainer}>
        <EmptyState title="Favorites" message="Your favorite Pokemon will appear here." />
      </SafeAreaView>
    );
  }

  if (isPending && pokemon.length === 0) {
    return (
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.stateContainer}>
        <LoadingState message="Loading favorites..." />
      </SafeAreaView>
    );
  }

  if (isError && pokemon.length === 0) {
    return (
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.stateContainer}>
        <ErrorState
          message={error?.message ?? "Favorite Pokemon could not be loaded."}
          onRetry={refetch}
          title="Could not load favorites"
        />
      </SafeAreaView>
    );
  }

  return (
    <BottomSheetProvider>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={pokemon}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setSelectedPokemonName(item.name);
                }}
              >
                <PokemonCard
                  imageUrl={item.imageUrl}
                  name={formatName(item.name)}
                  subtitle={getPokemonSubtitle(item)}
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  removeFavorite(item.id);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove favorite</Text>
              </Pressable>
            </View>
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
    </BottomSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  item: {
    gap: 8,
  },
  listContent: {
    gap: 12,
    padding: 16,
  },
  removeButton: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  removeButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  stateContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
