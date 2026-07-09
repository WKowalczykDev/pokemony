import { StyleSheet, Text } from "react-native";

import type { FaceOverlay } from "@/hooks/use-face-overlay";

import { CachedPokemonImage } from "./cached-pokemon-image";

type FaceLabelOverlayProps = {
  faceOverlay: FaceOverlay;
  fallbackImageUrl?: string;
  fallbackKey?: string;
  imageUrl?: string;
};

export function FaceLabelOverlay({
  faceOverlay,
  fallbackImageUrl,
  fallbackKey,
  imageUrl,
}: FaceLabelOverlayProps) {
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
      fallbackKey={fallbackKey}
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
