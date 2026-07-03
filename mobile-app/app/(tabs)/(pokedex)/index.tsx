import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokedexScreen() {
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <View>
        <Text style={styles.title}>Pokedex</Text>
        <Text>The Pokemon list will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
});
