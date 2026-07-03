import { ScrollView, Text } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text selectable>Pokemony</Text>
      <Text selectable>Expo Router is ready. Tabs arrive in the next step.</Text>
    </ScrollView>
  );
}
