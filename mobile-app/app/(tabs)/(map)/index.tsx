import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components";

export default function MapScreen() {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <EmptyState title="Map" message="Pokemon map pins will appear here." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
