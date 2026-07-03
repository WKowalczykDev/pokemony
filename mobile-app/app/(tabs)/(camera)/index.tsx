import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components";

export default function CameraScreen() {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <EmptyState title="Camera" message="The camera preview will appear here." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
