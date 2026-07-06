import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors } from "@/theme/colors";
import type { PokemonDetails } from "@/types/pokemon";

type PokemonDetailProps = {
  pokemon: PokemonDetails;
  onSetFavorite: () => void;
};

function formatName(name: string) {
  return name.replaceAll("-", " ");
}

export function PokemonDetail({ pokemon, onSetFavorite }: PokemonDetailProps) {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image
        accessibilityLabel={`${pokemon.name} image`}
        contentFit="contain"
        source={{ uri: pokemon.imageUrl }}
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

      <Pressable accessibilityRole="button" onPress={onSetFavorite} style={styles.button}>
        <Text style={styles.buttonText}>Set favorite</Text>
      </Pressable>
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
    height: 160,
    width: 160,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
