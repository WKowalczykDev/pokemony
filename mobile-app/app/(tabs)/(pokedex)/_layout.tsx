import { Stack } from "expo-router/stack";

export default function PokedexLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Pokedex" }} />
    </Stack>
  );
}
