import { Stack } from "expo-router/stack";

export default function PokedexLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Pokedex" }} />
      <Stack.Screen
        name="pokemon/[name]"
        options={{
          animation: "fade",
          contentStyle: { backgroundColor: "transparent" },
          headerShown: false,
          presentation: "transparentModal",
        }}
      />
    </Stack>
  );
}
