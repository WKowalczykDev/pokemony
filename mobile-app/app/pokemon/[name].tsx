import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components";
import { colors } from "@/theme/colors";

export default function PokemonDetailRoute() {
  const { name } = useLocalSearchParams<{ name: string }>();

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <EmptyState
        title={name ? name : "Pokemon"}
        message="Pokemon details will be implemented in the next step."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 16,
  },
});
