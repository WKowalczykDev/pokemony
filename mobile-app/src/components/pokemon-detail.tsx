import { Image } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors } from "@/theme/colors";
import type { PokemonDetails } from "@/types/pokemon";

type PokemonDetailProps = {
  pokemon: PokemonDetails;
  isFavorite?: boolean;
  onRemoveFavorite?: () => void;
  onSetFavorite?: () => void;
};

const SPRITE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

function formatName(name: string) {
  return name.replaceAll("-", " ");
}

function getPokemonSpriteUrl(id: number) {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export function PokemonDetail({
  pokemon,
  isFavorite = false,
  onRemoveFavorite,
  onSetFavorite,
}: PokemonDetailProps) {
  const fallbackImageUrl = useMemo(() => getPokemonSpriteUrl(pokemon.id), [pokemon.id]);
  const initialImageUrl = pokemon.imageUrl || fallbackImageUrl;
  const imageStateKey = `${pokemon.id}:${initialImageUrl}`;
  const [imageState, setImageState] = useState<{
    imageUrl: string | undefined;
    stateKey: string;
  }>({
    imageUrl: initialImageUrl,
    stateKey: imageStateKey,
  });
  const activeImageUrl =
    imageState.stateKey === imageStateKey ? imageState.imageUrl : initialImageUrl;

  const handleImageError = useCallback(() => {
    setImageState({
      imageUrl:
        activeImageUrl && activeImageUrl !== fallbackImageUrl ? fallbackImageUrl : undefined,
      stateKey: imageStateKey,
    });
  }, [activeImageUrl, fallbackImageUrl, imageStateKey]);

  const favoriteAction = isFavorite ? onRemoveFavorite : onSetFavorite;
  const favoriteLabel = isFavorite ? "Remove favorite" : "Set favorite";

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image
        accessibilityLabel={`${pokemon.name} image`}
        contentFit="contain"
        onError={handleImageError}
        recyclingKey={activeImageUrl ?? pokemon.name}
        source={activeImageUrl ? { uri: activeImageUrl } : undefined}
        style={styles.image}
        cachePolicy="memory-disk"
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
