import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { getPokemonSpriteImageUrl } from "@/api/pokemon-images";
import { colors } from "@/theme/colors";
import type { PokemonDetails } from "@/types/pokemon";

import { CachedPokemonImage } from "./cached-pokemon-image";

type PokemonDetailProps = {
  pokemon: PokemonDetails;
  isFavorite?: boolean;
  onRemoveFavorite?: () => void;
  onSetFavorite?: () => void;
};

function formatName(name: string) {
  return name.replaceAll("-", " ");
}

export function PokemonDetail({
  pokemon,
  isFavorite = false,
  onRemoveFavorite,
  onSetFavorite,
}: PokemonDetailProps) {
  const fallbackImageUrl = getPokemonSpriteImageUrl(pokemon.id);
  const favoriteAction = isFavorite ? onRemoveFavorite : onSetFavorite;
  const favoriteLabel = isFavorite ? "Remove favorite" : "Set favorite";

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <CachedPokemonImage
        accessibilityLabel={`${pokemon.name} image`}
        contentFit="contain"
        fallbackImageUrl={fallbackImageUrl}
        fallbackKey={pokemon.name}
        imageUrl={pokemon.imageUrl}
        style={styles.image}
      />

      <Text style={styles.title}>{formatName(pokemon.name)}</Text>
      <Text>Types: {pokemon.types.map((type) => formatName(type.name)).join(", ")}</Text>
      <Text>Height: {pokemon.height} dm</Text>
      <Text>Weight: {pokemon.weight} hg</Text>
      <Text>
        Abilities:{" "}
        {pokemon.abilities
          .map((ability) => `${formatName(ability.name)}${ability.isHidden ? " (hidden)" : ""}`)
          .join(", ")}
      </Text>

      <Text style={styles.heading}>Stats</Text>
      {pokemon.stats.map((stat) => (
        <Text key={stat.name}>
          {formatName(stat.name)}: {stat.value}
        </Text>
      ))}

      {favoriteAction ? (
        <Pressable accessibilityRole="button" onPress={favoriteAction} style={styles.button}>
          <Text style={styles.buttonText}>{favoriteLabel}</Text>
        </Pressable>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  content: {
    gap: 10,
    padding: 16,
  },
  heading: {
    fontWeight: "600",
  },
  image: {
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: 6,
    height: 160,
    width: 160,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
