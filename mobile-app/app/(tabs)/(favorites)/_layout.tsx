import { Stack } from "expo-router/stack";

export default function FavoritesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Favorites" }} />
    </Stack>
  );
}
