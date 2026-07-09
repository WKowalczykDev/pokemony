import { StyleSheet, Text } from "react-native";

import { getPokemonOfficialArtworkImageUrl, getPokemonSpriteImageUrl } from "@/api/pokemon-images";
import { useFavoritePokemon } from "@/hooks/use-favorite-pokemon";

import type { FaceOverlay } from "@/hooks/use-face-overlay";

import { CachedPokemonImage } from "./cached-pokemon-image";

type FaceLabelOverlayProps = {
  faceOverlay: FaceOverlay;
};

export function FaceLabelOverlay({ faceOverlay }: FaceLabelOverlayProps) {
  const { favoriteIds } = useFavoritePokemon();
  const lastFavoriteId = favoriteIds.at(-1);
  const imageUrl = lastFavoriteId ? getPokemonOfficialArtworkImageUrl(lastFavoriteId) : undefined;
  const fallbackImageUrl = lastFavoriteId ? getPokemonSpriteImageUrl(lastFavoriteId) : undefined;

  if (!faceOverlay) {
    return null;
  }

  if (!imageUrl) {
    return (
      <Text style={[styles.label, { left: faceOverlay.left, top: faceOverlay.top }]}>Debil</Text>
    );
  }

  return (
    <CachedPokemonImage
      accessibilityLabel="Favorite Pokemon image"
      contentFit="contain"
      fallbackImageUrl={fallbackImageUrl}
      fallbackKey={lastFavoriteId ? String(lastFavoriteId) : undefined}
      imageUrl={imageUrl}
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
