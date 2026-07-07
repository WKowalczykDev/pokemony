import { ModalBottomSheet } from "@swmansion/react-native-bottom-sheet";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { useFavoritePokemon } from "@/hooks/use-favorite-pokemon";
import { usePokemonDetails } from "@/hooks/use-pokemon-details";
import { colors } from "@/theme/colors";

import { ErrorState } from "./error-state";
import { LoadingState } from "./loading-state";
import { PokemonDetail } from "./pokemon-detail";

type PokemonDetailSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedPokemonName: string | undefined;
};

const closedSheetIndex = 0;
const defaultSheetIndex = 1;

export function PokemonDetailSheet({
  isOpen,
  onClose,
  selectedPokemonName,
}: PokemonDetailSheetProps) {
  const { height } = useWindowDimensions();
  const [sheetIndex, setSheetIndex] = useState(isOpen ? defaultSheetIndex : closedSheetIndex);
  const { data, error, isError, isPending, refetch } = usePokemonDetails(selectedPokemonName);
  const { isFavorite, removeFavorite, setFavorite } = useFavoritePokemon();
  const detents = useMemo(
    () => [closedSheetIndex, Math.round(height * 0.5), Math.round(height * 0.92)],
    [height],
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
        {data ? (
          <PokemonDetail
            isFavorite={isFavorite(data.id)}
            onRemoveFavorite={() => {
              removeFavorite(data.id);
            }}
            onSetFavorite={() => {
              setFavorite(data.id);
            }}
            pokemon={data}
          />
        ) : null}
      </View>
    </ModalBottomSheet>
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
});
