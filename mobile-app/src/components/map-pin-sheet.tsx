import { ModalBottomSheet } from "@swmansion/react-native-bottom-sheet";
import { Image } from "expo-image";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { colors } from "@/theme/colors";
import type { MapPin } from "@/types/map";

import { PokemonCard } from "./pokemon-card";

type MapPinSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  pin: MapPin;
};

const closedSheetIndex = 0;
const defaultSheetIndex = 1;

function formatName(name: string) {
  return name.replaceAll("-", " ");
}

function formatCreatedAt(createdAt: string) {
  const date = new Date(createdAt);

  if (!Number.isFinite(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString();
}

function getSubtitle(pin: MapPin) {
  if (pin.pokemonId) {
    return `Pokemon #${pin.pokemonId}`;
  }

  return pin.source === "camera" ? "Camera pin" : "Manual map pin";
}

export function MapPinSheet({ isOpen, onClose, pin }: MapPinSheetProps) {
  const { height } = useWindowDimensions();
  const hasPhoto = Boolean(pin.photoAssetId);
  const [sheetIndex, setSheetIndex] = useState(isOpen ? defaultSheetIndex : closedSheetIndex);
  const detents = useMemo(
    () => [
      closedSheetIndex,
      Math.round(height * (hasPhoto ? 0.55 : 0.38)),
      Math.round(height * 0.7),
    ],
    [hasPhoto, height],
  );

  const handleIndexChange = useCallback((nextIndex: number) => {
    setSheetIndex(nextIndex);
  }, []);

  const handleSettle = useCallback(
    (settledIndex: number) => {
      if (settledIndex === closedSheetIndex && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose],
  );

  return (
    <ModalBottomSheet
      animateIn
      detents={detents}
      index={sheetIndex}
      onIndexChange={handleIndexChange}
      onSettle={handleSettle}
      scrimColor="rgba(0, 0, 0, 0.3)"
      scrimOpacities={[0, 0.45, 0.55]}
      surface={<View style={styles.surface} />}
    >
      <View style={styles.container}>
        {pin.photoAssetId ? (
          <Image
            accessibilityLabel="Captured photo"
            contentFit="cover"
            source={{ uri: pin.photoAssetId }}
            style={styles.photo}
          />
        ) : null}
        <PokemonCard
          imageUrl={pin.imageUrl}
          name={formatName(pin.pokemonName)}
          subtitle={getSubtitle(pin)}
        />
        <View style={styles.details}>
          <Text style={styles.detailText}>Added: {formatCreatedAt(pin.createdAt)}</Text>
          <Text style={styles.detailText}>Latitude: {pin.latitude.toFixed(5)}</Text>
          <Text style={styles.detailText}>Longitude: {pin.longitude.toFixed(5)}</Text>
        </View>
      </View>
    </ModalBottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    minHeight: 160,
    padding: 16,
  },
  details: {
    gap: 6,
  },
  detailText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  photo: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    height: 180,
    width: "100%",
  },
  surface: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
  },
});
