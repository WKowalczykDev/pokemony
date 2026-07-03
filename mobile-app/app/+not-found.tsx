import { Link } from "expo-router";
import { ScrollView, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text selectable>Screen not found</Text>
      <Link href="/">Go home</Link>
    </ScrollView>
  );
}
