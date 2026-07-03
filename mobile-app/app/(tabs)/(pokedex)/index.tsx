import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components";

export default function PokedexScreen() {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <EmptyState title="Pokedex" message="The Pokemon list will appear here." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
