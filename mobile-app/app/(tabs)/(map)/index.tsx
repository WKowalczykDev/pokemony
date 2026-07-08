import { BottomSheetProvider } from "@swmansion/react-native-bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import MapView, { Marker, type LongPressEvent } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState, MapPinSheet } from "@/components";
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
  const { favoriteIds } = useFavoritePokemon();
  const currentFavoriteId = favoriteIds.at(-1);
  const currentFavoriteIds = useMemo(
    () => (currentFavoriteId ? [currentFavoriteId] : []),
    [currentFavoriteId],
  );
  const { pokemon: currentFavoritePokemon } = useFavoritePokemonDetails(currentFavoriteIds);
  const currentFavorite = currentFavoritePokemon[0];
  const { pins, addPin } = useMapPins();
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
  stateContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
