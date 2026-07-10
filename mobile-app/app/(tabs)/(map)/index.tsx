import { BottomSheetProvider } from "@swmansion/react-native-bottom-sheet";
import { Icon } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet } from "react-native";
import MapView, { Marker, type LongPressEvent } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, MapPinListDrawer, MapPinSheet } from "@/components";
import { useFavoritePokemon } from "@/hooks/use-favorite-pokemon";
import { useFavoritePokemonDetails } from "@/hooks/use-favorite-pokemon-details";
import { useIosMapLocation } from "@/hooks/use-ios-map-location";
import { useMapPins } from "@/hooks/use-map-pins";
import { colors } from "@/theme/colors";
import type { MapPin } from "@/types/map";

function formatName(name: string) {
  return name.replaceAll("-", " ");
}

function getMarkerDescription(pin: MapPin) {
  if (pin.pokemonId) {
    return `Pokemon #${pin.pokemonId}`;
  }

  return pin.source === "camera" ? "Camera pin" : "Manual map pin";
}

function IosMapScreen() {
  const mapRef = useRef<MapView>(null);
  const [selectedPin, setSelectedPin] = useState<MapPin>();
  const [isPinListOpen, setIsPinListOpen] = useState(false);
  const { favoriteIds } = useFavoritePokemon();
  const currentFavoriteId = favoriteIds.at(-1);
  const currentFavoriteIds = useMemo(
    () => (currentFavoriteId ? [currentFavoriteId] : []),
    [currentFavoriteId],
  );
  const { pokemon: currentFavoritePokemon } = useFavoritePokemonDetails(currentFavoriteIds);
  const currentFavorite = currentFavoritePokemon[0];
  const { pins, addPin, removePin } = useMapPins();
  const { centerOnUser, hasLocationPermission, region } = useIosMapLocation();

  useEffect(() => {
    if (region) {
      mapRef.current?.animateToRegion(region, 500);
    }
  }, [region]);

  const handleLongPress = useCallback(
    (event: LongPressEvent) => {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      const favoriteName =
        currentFavorite?.name ?? (currentFavoriteId ? `Favorite #${currentFavoriteId}` : undefined);

      addPin({
        imageUrl: currentFavorite?.imageUrl,
        latitude,
        longitude,
        pokemonId: currentFavorite?.id ?? currentFavoriteId,
        pokemonName: favoriteName,
        source: "manual",
      });
    },
    [addPin, currentFavorite, currentFavoriteId],
  );

  const handleOpenPinList = useCallback(() => {
    setSelectedPin(undefined);
    setIsPinListOpen(true);
  }, []);

  const handleClosePinList = useCallback(() => {
    setIsPinListOpen(false);
  }, []);

  const handleRemovePin = useCallback(
    (pinId: string) => {
      removePin(pinId);
      setSelectedPin((currentPin) => (currentPin?.id === pinId ? undefined : currentPin));
    },
    [removePin],
  );

  return (
    <BottomSheetProvider>
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
        <MapView
          ref={mapRef}
          showsMyLocationButton={hasLocationPermission}
          showsUserLocation={hasLocationPermission}
          style={styles.map}
          onLongPress={handleLongPress}
          onMapReady={() => {
            void centerOnUser();
          }}
        >
          {pins.map((pin) => (
            <Marker
              coordinate={{
                latitude: pin.latitude,
                longitude: pin.longitude,
              }}
              description={getMarkerDescription(pin)}
              key={pin.id}
              onPress={() => {
                setSelectedPin(pin);
              }}
              title={formatName(pin.pokemonName)}
            />
          ))}
        </MapView>
        <Pressable
          accessibilityLabel="Open map pins"
          accessibilityRole="button"
          onPress={handleOpenPinList}
          style={styles.pinListButton}
        >
          <Icon md="menu" sf="line.3.horizontal" />
        </Pressable>
      </SafeAreaView>
      {selectedPin ? (
        <MapPinSheet
          isOpen
          onClose={() => {
            setSelectedPin(undefined);
          }}
          pin={selectedPin}
        />
      ) : null}
      <MapPinListDrawer
        isOpen={isPinListOpen}
        onClose={handleClosePinList}
        onRemovePin={handleRemovePin}
        pins={pins}
      />
    </BottomSheetProvider>
  );
}

export default function MapScreen() {
  if (Platform.OS !== "ios") {
    return (
      <SafeAreaView edges={["bottom", "left", "right"]} style={styles.stateContainer}>
        <EmptyState title="Map" message="Map pins are available on iOS for now." />
      </SafeAreaView>
    );
  }

  return <IosMapScreen />;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  map: {
    flex: 1,
  },
  pinListButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    left: 16,
    position: "absolute",
    top: 16,
    width: 44,
  },
  stateContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
