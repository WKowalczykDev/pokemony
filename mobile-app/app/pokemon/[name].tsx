import { BottomSheet } from "@swmansion/react-native-bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View, Pressable } from "react-native";

import { ErrorState, LoadingState, PokemonDetail } from "@/components";
import { usePokemonDetails } from "@/hooks/use-pokemon-details";
import { colors } from "@/theme/colors";

const closedSheetIndex = 0;
const defaultSheetIndex = 1;

function getRouteName(name: string | string[] | undefined) {
  return Array.isArray(name) ? name[0] : name;
}

export default function PokemonDetailRoute() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const pokemonName = getRouteName(name);
  const { height } = useWindowDimensions();
  const [sheetIndex, setSheetIndex] = useState(defaultSheetIndex);
  const isClosingRef = useRef(false);
  const { data, error, isError, isPending, refetch } = usePokemonDetails(pokemonName);
  const detents = [
    closedSheetIndex,
    Math.round(height * 0.50),
    Math.round(height * 0.92),
  ];

  const closeRoute = useCallback(() => {
    if (isClosingRef.current) {
      return;
    }

    isClosingRef.current = true;
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace("/(tabs)/(pokedex)");
  }, []);

  const handleIndexChange = useCallback(
    (nextIndex: number) => {
      setSheetIndex(nextIndex);

      if (nextIndex === closedSheetIndex) {
        closeRoute();
      }
    },
    [closeRoute],
  );

  const closeSheet = useCallback(() => {
    setSheetIndex(closedSheetIndex);
  }, []);

  const handleSettle = useCallback(
    (settledIndex: number) => {
      if (settledIndex === closedSheetIndex) {
        closeRoute();
      }
    },
    [closeRoute],
  );

  return (
    <View style={styles.screen}>
      <Pressable style={StyleSheet.absoluteFill} onPress={closeSheet} />
      <BottomSheet
        animateIn
        detents={detents}
        index={sheetIndex}
        onIndexChange={handleIndexChange}
        onSettle={handleSettle}
        surface={<View style={styles.surface} />}
      >
        <View style={styles.container}>
          {isPending ? <LoadingState message="Loading Pokemon details..." /> : null}
          {isError ? (
            <ErrorState
              message={error.message}
              onRetry={() => {
                void refetch();
              }}
              title="Could not load Pokemon"
            />
          ) : null}
          {data ? <PokemonDetail pokemon={data} onSetFavorite={() => { }} /> : null}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 160,
  },
  surface: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  }
});
