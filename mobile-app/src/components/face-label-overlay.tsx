import { StyleSheet, Text } from "react-native";
import { Image } from "expo-image";

import { useFavoritePokemon } from "@/hooks/use-favorite-pokemon";
import { useFavoritePokemonDetails } from "@/hooks/use-favorite-pokemon-details";

import type { FaceOverlay } from "@/hooks/use-face-overlay";

type FaceLabelOverlayProps = {
  faceOverlay: FaceOverlay;
};

export function FaceLabelOverlay({ faceOverlay }: FaceLabelOverlayProps) {
  const { favoriteIds } = useFavoritePokemon();
  const lastFavoriteId = favoriteIds.at(-1);

  const { pokemon } = useFavoritePokemonDetails(lastFavoriteId ? [lastFavoriteId] : []);
  const spriteUrl = pokemon[0]?.imageUrl;

  if (!faceOverlay) {
    return null;
  }

  if (!spriteUrl) {
    return (
      <Text style={[styles.label, { left: faceOverlay.left, top: faceOverlay.top }]}>Debil</Text>
    );
  }

  return (
    <Image
      contentFit="contain"
      source={{ uri: spriteUrl }}
      style={[
        styles.sprite,
        {
          height: faceOverlay.size,
          left: faceOverlay.left,
          top: faceOverlay.top,
          transform: [
            { translateX: -faceOverlay.size / 2 },
            { translateY: -faceOverlay.size * 0.8 },
          ],
          width: faceOverlay.size,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  sprite: {
    position: "absolute",
  },

  label: {
    position: "absolute",
    color: "red",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    transform: [{ translateX: -30 }],
    width: 60,
  },
});
