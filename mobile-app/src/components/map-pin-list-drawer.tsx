import { Icon } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "@/theme/colors";
import type { MapPin } from "@/types/map";

import { EmptyState } from "./empty-state";
import { PokemonCard } from "./pokemon-card";

type MapPinListDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onRemovePin: (pinId: string) => void;
  pins: MapPin[];
};

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

export function MapPinListDrawer({ isOpen, onClose, onRemovePin, pins }: MapPinListDrawerProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [slideProgress] = useState(() => new Animated.Value(0));
  const drawerWidth = Math.min(Math.round(width * 0.86), 360);
  const translateX = useMemo(
    () =>
      slideProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [-drawerWidth, 0],
      }),
    [drawerWidth, slideProgress],
  );
  const scrimOpacity = useMemo(
    () =>
      slideProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    [slideProgress],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    slideProgress.setValue(0);

    Animated.timing(slideProgress, {
      duration: 180,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideProgress]);

  return (
    <Modal animationType="none" onRequestClose={onClose} transparent visible={isOpen}>
      <View style={styles.modalRoot}>
        <Animated.View style={[styles.scrim, { opacity: scrimOpacity }]}>
          <Pressable
            accessibilityLabel="Close map pins"
            accessibilityRole="button"
            onPress={onClose}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.drawer,
            {
              paddingBottom: insets.bottom + 16,
              paddingTop: insets.top + 16,
              transform: [{ translateX }],
              width: drawerWidth,
            },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Map pins</Text>
            <Pressable
              accessibilityLabel="Close map pins"
              accessibilityRole="button"
              hitSlop={8}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Icon md="close" sf="xmark" />
            </Pressable>
          </View>
          <FlatList
            contentContainerStyle={[
              styles.listContent,
              pins.length === 0 ? styles.emptyListContent : null,
            ]}
            data={pins}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <EmptyState message="Saved Pokemon map pins will appear here." title="No map pins" />
            }
            renderItem={({ item }) => (
              <View style={styles.item}>
                <PokemonCard
                  imageUrl={item.imageUrl}
                  name={formatName(item.pokemonName)}
                  subtitle={getSubtitle(item)}
                />
                <View style={styles.details}>
                  <Text selectable style={styles.detailText}>
                    Added: {formatCreatedAt(item.createdAt)}
                  </Text>
                  <Text selectable style={styles.detailText}>
                    Latitude: {item.latitude.toFixed(5)}
                  </Text>
                  <Text selectable style={styles.detailText}>
                    Longitude: {item.longitude.toFixed(5)}
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel={`Remove ${formatName(item.pokemonName)} map pin`}
                  accessibilityRole="button"
                  onPress={() => {
                    onRemovePin(item.id);
                  }}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove pin</Text>
                </Pressable>
              </View>
            )}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    alignItems: "center",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  detailText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 19,
  },
  details: {
    gap: 4,
  },
  drawer: {
    backgroundColor: colors.background,
    borderRightColor: colors.border,
    borderRightWidth: 1,
    flex: 1,
    gap: 12,
    paddingHorizontal: 16,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  item: {
    gap: 8,
  },
  listContent: {
    gap: 16,
    paddingBottom: 8,
  },
  modalRoot: {
    flex: 1,
  },
  removeButton: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  removeButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  scrim: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 26,
  },
});
